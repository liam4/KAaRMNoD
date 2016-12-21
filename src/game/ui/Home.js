const unic = require('../../lib/unichars')
const ansi = require('../../lib/ansi')

const FocusElement = require('../../lib/ui/form/FocusElement')

const Pane = require('../../lib/ui/Pane')

const WorldMap =      require('./WorldMap')
const BuildingTools = require('./BuildingTools')
const Shop =          require('./Shop')

module.exports = class Home extends FocusElement {
  constructor(user) {
    super()

    this.user = null

    this.buildingZoneSize = 5

    this.kingdomBuildings = []

    this.worldMapPane = new Pane()
    this.addChild(this.worldMapPane)

    this.worldMap = new WorldMap()
    this.worldMapPane.addChild(this.worldMap)

    this.buildingToolsPane = new Pane()
    this.buildingToolsPane.visible = false
    this.addChild(this.buildingToolsPane)

    this.buildingTools = new BuildingTools()
    this.buildingToolsPane.addChild(this.buildingTools)

    this.rightPane = new Pane()
    this.addChild(this.rightPane)

    this.shopPane = new Pane()
    this.shopPane.visible = false
    this.addChild(this.shopPane)

    this.shop = new Shop()
    this.shopPane.addChild(this.shop)

    this.initEventListeners()
  }

  initEventListeners() {
    this.worldMap.on('tileselected', t => this.tileSelected(t))
    this.buildingTools.on('cancelled', () => this.buildingToolsCancelled())
    this.shop.on('cancelled', () => this.shopCancelled())
    this.shop.on('itemselected', item => this.shopItemSelected(item))
  }

  fixLayout() {
    this.w = this.parent.contentW
    this.h = this.parent.contentH

    this.worldMapPane.w = this.contentW - 12

    if (this.buildingToolsPane.visible) {
      this.buildingToolsPane.h = 3
      this.worldMapPane.h = this.contentH - this.buildingToolsPane.h

      this.buildingToolsPane.x = this.worldMapPane.x
      this.buildingToolsPane.y = this.worldMapPane.bottom
      this.buildingToolsPane.w = this.worldMapPane.w
    } else {
      this.worldMapPane.h = this.contentH
    }

    this.rightPane.x = this.worldMapPane.right + 1
    this.rightPane.y = 0
    this.rightPane.w = this.contentW - this.rightPane.left
    this.rightPane.h = this.contentH

    if (this.shopPane.visible) {
      this.shopPane.w = this.contentW - 10
      this.shopPane.h = this.contentH - 5
      this.shopPane.centerInParent()

      this.shop.w = this.shopPane.contentW
      this.shop.h = this.shopPane.contentH
    }
  }

  loadUser(user) {
    // Call this when the user is logged in.

    this.user = user

    this.kingdomBuildings = this.user.kingdomBuildings

    this.buildWorldMapTiles()
  }

  focus() {
    this.root.select(this.worldMap)
  }

  keyPressed(keyBuf) {
    if (keyBuf[0] === 0x13) {
      Pane.alert(this.root, 'Saving.')
      this.emit('saverequested')
    }
  }

  tileSelected(t) {
    if (!t) return

    if (this.isTileInKingdom(t)) {
      const selectedBuilding = this.kingdomBuildings.filter(
        b => b.x === t.x && b.y === t.y)[0]

      if (selectedBuilding) {
        this.buildingToolsPane.visible = true
        this.fixAllLayout()

        this.root.select(this.buildingTools)
      } else {
        this.shopPane.visible = true
        this.fixAllLayout()

        this.root.select(this.shop)
      }
    }
  }

  isTileInKingdom(t) {
    // Returns whether or not the given tile is within the kingdom building
    // zone.

    return t.x < this.buildingZoneSize && t.y < this.buildingZoneSize
  }

  buildWorldMapTiles() {
    const buildingZoneSize = this.buildingZoneSize;

    const wallAttributes = [ansi.C_WHITE]

    // building space tiles
    for (let y = 0; y < buildingZoneSize; y++) {
      for (let x = 0; x < buildingZoneSize; x++) {
        const tile = this.kingdomBuildings.filter(
          t => t.x === x && t.y === y)[0]
        const type = tile ? tile.type : null

        this.setBuildingAt(type, x, y)
      }
    }

    // building space horizontal (south) wall
    for (let x = 0; x < buildingZoneSize; x++) {
      this.worldMap.setTileAt(x, buildingZoneSize, {
        textureAttributes: wallAttributes,
        texture: [
          '..........',
          '══════════',
          '──────────',
          '──────────',
          '══════════',
          '..........'
        ]
      })
    }

    // building space vertical (east) wall
    for (let y = 0; y < buildingZoneSize; y++) {
      this.worldMap.setTileAt(buildingZoneSize, y, {
        x: buildingZoneSize, y: y,
        textureAttributes: wallAttributes,
        texture: [
          '.║ │  │ ║.',
          '.║ │  │ ║.',
          '.║ │  │ ║.',
          '.║ │  │ ║.',
          '.║ │  │ ║.',
          '.║ │  │ ║.'
        ]
      })
    }

    // building space wall corner (southeast)
    this.worldMap.setTileAt(buildingZoneSize, buildingZoneSize, {
      x: buildingZoneSize, y: buildingZoneSize,
      textureAttributes: wallAttributes,
      texture: [
        '.║ │  │ ║.',
        '═╝ │  │ ║.',
        '───┘  │ ║.',
        '──────┘ ║.',
        '════════╝.',
        '..........'
      ]
    })
  }

  buildingToolsCancelled() {
    this.buildingToolsPane.visible = false
    this.root.select(this.worldMap)
    this.fixAllLayout()
  }

  closeShopPane() {
    this.shopPane.visible = false
    this.root.select(this.worldMap)
    this.fixAllLayout()
  }

  shopCancelled() {
    this.closeShopPane()
  }

  shopItemSelected(item) {
    const {x, y} = this.worldMap.selectedTile
    this.kingdomBuildings.push({x: x, y: y, type: item.title})

    this.closeShopPane()

    this.setBuildingAt(item.title, x, y)
  }

  setBuildingAt(type, x, y) {
    // Sets a building at the given position, using the correct texture,
    // given the building type. If type is invalid the tile set will be red
    // and a warning will be shown in the console; if type is null a blank
    // "empty" tile will be set.

    if (type === 'Fountain') {
      this.setFountainTileAt(x, y)
    } else if (type === 'Forgery') {
      this.setForgeryTileAt(x, y)
    } else if (type === 'Training Grounds') {
      this.setTrainingGroundsTileAt(x, y)
    } else {
      this.worldMap.setTileAt(x, y, {
        textureAttributes: [ansi.C_WHITE, ansi.A_DIM],
        texture: [
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........'
        ]
      })
    }
  }

  setFountainTileAt(x, y) {
    this.worldMap.setTileAt(x, y, {
      textureAttributes: [ansi.C_BLUE],
      texture: [
        '..........',
        '.┌──────┐.',
        '.│-*-*-*│.',
        '.│*-*-*-│.',
        '.└──────┘.',
        '..........'
      ]
    })
  }

  setForgeryTileAt(x, y) {
    this.worldMap.setTileAt(x, y, {
      textureAttributes: [ansi.C_YELLOW],
      texture: [
        '┌────────┐',
        '│||||||||│',
        '│||||||||│',
        '│||||||||│',
        '│||||||||│',
        '└────────┘'
      ]
    })
  }

  setTrainingGroundsTileAt(x, y) {
    this.worldMap.setTileAt(x, y, {
      textureAttributes: [ansi.C_YELLOW],
      texture: [
        '..........',
        '.-~-~-~-~.',
        '.~~~~~~~~.',
        '.~~~~~~~~.',
        '.~-~-~-~-.',
        '..........'
      ]
    })
  }
}
