const telc = require('../../../lib/telchars')
const smoothen = require('../../../lib/util/smoothen')

const FocusElement = require('../../../lib/ui/form/FocusElement')

const Pane = require('../../../lib/ui/Pane')
const Sprite = require('../../../lib/ui/Sprite')
const BattleBackdrop = require('./BattleBackdrop')

module.exports = class Battle extends FocusElement {
  constructor(dungeonCls) {
    super()

    this.dungeonCls = dungeonCls

    this.cursorX = null
    this.cursorY = null

    this.pane = new Pane()
    this.addChild(this.pane)

    this.backdrop = new BattleBackdrop()
    this.pane.addChild(this.backdrop)

    this.sprite = new Sprite()
    this.sprite.texture = [
      'aAAAa',
      'bBBBb',
      'cCCCc'
    ]
    this.pane.addChild(this.sprite)

    this.currentWaveNum = 0
  }

  drawTo(writable) {
    const wnum = this.currentWaveNum

    this.backdrop.smoothlyScrollToPercent((100 / 3) * wnum, 3)

    this.sprite.x = smoothen(
      (this.pane.contentW / 3 - this.sprite.textureWidth) / 3 * wnum,
      this.sprite.x, 3)

    this.sprite.y = 8

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
  }

  keyPressed(keyBuf) {
    // if (telc.isRight(keyBuf)) {
    //   this.sprite.x++
    // } else if (telc.isLeft(keyBuf)) {
    //   this.sprite.x--
    // } else if (telc.isUp(keyBuf)) {
    //   this.sprite.y--
    // } else if (telc.isDown(keyBuf)) {
    //   this.sprite.y++
    // }

    if (telc.isRight(keyBuf)) {
      this.currentWaveNum++
    } else if (telc.isLeft(keyBuf)) {
      this.currentWaveNum--
    }
  }
}
