const ansi = require('../../../lib/ansi')
const telc = require('../../../lib/telchars')
const smoothen = require('../../../lib/util/smoothen')

const FocusElement = require('../../../lib/ui/form/FocusElement')

const DisplayElement = require('../../../lib/ui/DisplayElement')
const Label = require('../../../lib/ui/Label')
const Pane = require('../../../lib/ui/Pane')
const Sprite = require('../../../lib/ui/Sprite')
const BattleBackdrop = require('./BattleBackdrop')
const Player = require('../../enemies/Player')
const EnemyDrop = require('./EnemyDrop')

module.exports = class Battle extends FocusElement {
  constructor(dungeonCls, user) {
    super()

    this.dungeonCls = dungeonCls
    this.user = user

    this.cursorX = null
    this.cursorY = null

    this.pane = new Pane()
    this.addChild(this.pane)

    this.backdrop = new BattleBackdrop()
    this.pane.addChild(this.backdrop)

    this.player = new Player(user)
    this.player.sprite.texture = [
      'aAAAa',
      'bBBBb',
      'cCCCc'
    ]
    this.pane.addChild(this.player.sprite)

    this.titleLabel = new Label(dungeonCls.title)
    this.titleLabel.textAttributes = [ansi.A_BRIGHT, ansi.C_RED]
    this.addChild(this.titleLabel)

    this.healthLabel = new Label('HP:')
    this.addChild(this.healthLabel)

    this.healthValueLabel = new Label('0')
    this.healthValueLabel.textAttributes = [ansi.C_RED]
    this.addChild(this.healthValueLabel)

    this.specialLabel = new Label('[S]pecial')
    this.specialLabel.textAttributes = [ansi.C_WHITE, ansi.A_DIM]
    this.addChild(this.specialLabel)

    // Whether or not the player will use a special attack when they get a
    // turn.
    this.playerWillSpecial = false

    // What team last attacked. Either 'player' or 'enemy'.
    this.lastTurn = 'player'

    // The character that is currently attacking another character, and the
    // target of that character.
    this.attacker = null
    this.attackerTarget = null

    // General animation stuff.
    this.anim = {status: 'idle'}

    // The enemies of the player in the battle. These are of the Character
    // class, and they're also usually instances of Enemy.
    this.enemies = []

    // The items that enemies drop when they're defeated. These are Sprites.
    this.enemyDropSprites = []
  }

  drawTo(writable) {
    const wnum = this.currentWaveNum

    // Backdrop positioning
    const targetPc = (100 / (this.dungeonCls.waves.length - 1)) * wnum
    this.backdrop.smoothlyScrollToPercent(targetPc, 3)

    this.player.sprite.y = 8

    // Line up all of the eneies except for the first, which may be animated.
    for (let enemy of this.enemies.slice(1)) {
      const targetX = this.enemyIdlePos(enemy)
      enemy.sprite.x = smoothen(targetX, enemy.sprite.x, 3)
      enemy.sprite.y = 8
    }

    // Front enemy animation
    const frontEnemy = this.enemies[0]
    if (frontEnemy) {
      const { sprite } = frontEnemy

      let targetX, speed = 3
      if (
        this.anim.status === 'enemy going to player' ||
        this.anim.status === 'enemy waiting for player hurt'
      ) {
        targetX = this.player.sprite.x + this.player.sprite.textureWidth + 2

        if (this.anim.status === 'enemy going to player') speed = 2
      } else {
        targetX = this.enemyIdlePos(frontEnemy)
      }

      sprite.x = smoothen(targetX, sprite.x, speed)
      sprite.y = 8

      if (
        this.anim.status === 'enemy going to player' &&
        sprite.x === targetX
      ) {
        this.anim.status = 'enemy waiting for player hurt'
        this.anim.ticks = 3
      }

      if (this.anim.status === 'enemy waiting for player hurt') {
        this.player.sprite.textureAttributes = [ansi.C_RED]
        this.anim.ticks--

        if (this.anim.ticks === 0) {
          this.player.sprite.textureAttributes = []
          this.anim.status = 'enemy going back to idle'
          this.characterAttackedBy(this.player, frontEnemy)
        }
      } else if (
        this.anim.status === 'enemy going back to idle' &&
        sprite.x === targetX
      ) {
        this.anim.status = 'idle'
        this.lastTurn = 'enemy'

        this.resetAttackerVars()
      }

    }

    // Player animation, along with unnecessary if-this.player
    if (this.player) {
      const { sprite } = this.player

      let targetX, speed = 3
      if ((
        this.anim.status === 'player going to enemy' ||
        this.anim.status === 'player waiting for enemy hurt'
      ) && frontEnemy) {
        targetX = frontEnemy.sprite.x - sprite.textureWidth - 2
        speed = 2
      } else {
        targetX = this.playerIdlePos(0)
      }

      sprite.x = smoothen(targetX, sprite.x, speed)

      if (
        this.anim.status === 'player going to enemy' &&
        sprite.x === targetX
      ) {
        this.anim.status = 'player waiting for enemy hurt'
        this.anim.ticks = 3
      }

      if (this.anim.status === 'player waiting for enemy hurt') {
        this.anim.ticks--

        if (frontEnemy) {
          frontEnemy.sprite.textureAttributes = [ansi.C_RED]
        }

        if (this.anim.ticks === 0) {
          if (frontEnemy) {
            frontEnemy.sprite.textureAttributes = []
            this.characterAttackedBy(frontEnemy, this.player)
          }

          this.anim.status = 'player going back to idle'

          this.resetAttackerVars()
          this.resetPlayerMoveControls()
        }
      } else if (
        this.anim.status === 'player going back to idle' &&
        sprite.x === targetX
      ) {
        this.anim.status = 'idle'
        this.lastTurn = 'player'
      }
    }

    if (this.anim.status === 'idle') {
      if (this.lastTurn === 'player') {
        this.anim.status = 'enemy going to player'
        this.attacker = frontEnemy
        this.attackerTarget = this.player
      } else if (this.lastTurn === 'enemy') {
        this.anim.status = 'player going to enemy'
        this.attacker = this.player
        this.attackerTarget = frontEnemy

        // Since the player is now attacking, we can't change what we want
        // the player to do, so dim those controls.
        this.specialLabel.textAttributes.push(ansi.A_DIM)
      }
    }

    // Label texts
    this.healthValueLabel.text = this.player.health

    super.drawTo(writable)
  }

  fixLayout() {
    this.w = this.parent.contentW
    this.h = this.parent.contentH

    this.pane.w = Math.min(60, this.contentW - 2)
    this.pane.h = 14
    this.pane.centerInParent()

    this.backdrop.w = this.pane.contentW
    this.backdrop.h = this.pane.contentH

    this.titleLabel.x = Math.floor((this.w - this.titleLabel.w) / 2)
    this.titleLabel.y = this.pane.top - 3

    this.healthLabel.x = this.pane.x + 5
    this.healthLabel.y = this.pane.bottom + 1

    this.healthValueLabel.x = this.healthLabel.right + 1
    this.healthValueLabel.y = this.healthLabel.y

    this.specialLabel.x = this.healthLabel.x
    this.specialLabel.y = this.healthLabel.y + 1
  }

  keyPressed(keyBuf) {
    if (telc.isSelect(keyBuf)) {
      this.startWave(this.currentWaveNum + 1)
    }

    // We can only decide on a new thing to do if the player isn't already
    // attacking.
    if (this.attacker !== this.player) {
      if (keyBuf[0] === 0x73) { // S-pecial
        this.specialLabel.textAttributes = [ansi.A_BRIGHT, ansi.C_YELLOW]
        this.willSpecial = true
      } else if (keyBuf[0] === 0x61) { // A-ttack
        this.specialLabel.textAttributes = [ansi.A_DIM, ansi.C_WHITE]
        this.willSpecial = false
      }
    }
  }

  startWave(n) {
    this.currentWaveNum = n
    const wave = this.dungeonCls.waves[this.currentWaveNum]

    for (let sprite of this.enemies) {
      this.pane.removeChild(sprite)
    }

    this.enemies.splice(0)

    if (!wave) return

    for (let enemyCls of wave) {
      const enemy = new enemyCls()

      enemy.sprite.x = this.pane.contentW + 5
      enemy.sprite.texture = [
        '!!!',
        '!!!',
        '!!!'
      ]
      this.pane.addChild(enemy.sprite)
      this.enemies.push(enemy)
    }
  }

  killEnemy(enemy) {
    enemy.health = 0
    this.pane.removeChild(enemy.sprite)
    this.enemies.splice(this.enemies.indexOf(enemy), 1)

    // Drops. TODO: Make this not random and actually with meaning..
    for (let i = 0; i < Math.ceil(Math.random() * 3); i++) {
      const drop = new EnemyDrop()
      drop.texture = ['G']
      drop.textureAttributes = [ansi.C_YELLOW]
      drop.x = enemy.sprite.x
      drop.y = enemy.sprite.y
      drop.on('removerequested', () => {
        this.pane.removeChild(drop)
      })
      this.pane.addChild(drop)
      this.enemyDropSprites.push(drop)
    }

    if (this.enemies.length === 0) {
      if (this.currentWaveNum < this.dungeonCls.waves.length - 1) {
        this.startWave(this.currentWaveNum + 1)
      } else {
        Pane.alert(this.root, 'You win!')
        this.anim.status = 'player won'
      }
    }
  }

  enemyIdlePos(enemy) {
    const i = this.enemies.indexOf(enemy)

    if (i === 0) {
      return this.pane.contentW - ((this.enemies.length) * 6 + 5)
    } else {
      return this.pane.contentW - (this.enemies.length - i) * 6
    }
  }

  playerIdlePos(player) {
    // TODO

    const i = 0

    if (i === 0) {
      return Math.round(
        (this.pane.contentW / 4 - this.player.sprite.textureWidth)
        / (this.dungeonCls.waves.length - 1) * this.currentWaveNum
      )
    }
  }

  resetAttackerVars() {
    // Resets the attacker/attackerTarget variables.

    this.attacker = null
    this.attackerTarget = null
  }

  resetPlayerMoveControls() {
    // Called to reset the move controls that decide what the player will be
    // doing when it's their turn.

    this.playerWillSpecial = false
    this.specialLabel.textAttributes = [ansi.A_DIM, ansi.C_WHITE]
  }

  characterAttackedBy(target, attacker) {
    const damage = attacker.attack

    target.health -= damage

    if (this.enemies.includes(target)) {
      if (target.health <= 0) {
        this.killEnemy(target)
      }
    }
  }
}
