const FocusElement = require('../../lib/ui/form/FocusElement')

const Pane = require('../../lib/ui/Pane')

const WorldMap =      require('./WorldMap')
const BuildingTools = require('./BuildingTools')

module.exports = class Home extends FocusElement {
  constructor() {
    super()

    this.kingdomBuildings = [
      {x: 2, y: 1}
    ]

    this.worldMapPane = new Pane()
    this.addChild(this.worldMapPane)

    this.worldMap = new WorldMap()
    this.worldMapPane.addChild(this.worldMap)

    this.buildingToolsPane = new Pane()
    this.buildingToolsPane.visible = false
    this.addChild(this.buildingToolsPane)

    this.buildingTools = new BuildingTools()
    this.buildingToolsPane.addChild(this.buildingTools)

    this.worldMap.on('tileselected', t => this.tileSelected(t))

    this.rightPane = new Pane()
    this.addChild(this.rightPane)
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

      this.buildingToolsPane.fixAllLayout()
      this.worldMapPane.fixAllLayout()
    } else {
      this.worldMapPane.h = this.contentH
    }

    this.rightPane.x = this.worldMapPane.right + 1
    this.rightPane.y = 0
    this.rightPane.w = this.contentW - this.rightPane.left
    this.rightPane.h = this.contentH
  }

  focus() {
    this.root.select(this.worldMap)
  }

  tileSelected(t) {
    console.log(t)

    const selectedBuilding = this.kingdomBuildings.filter(
      b => b.x === t.x && b.y === t.y)[0]

    if (selectedBuilding) {
      this.buildingToolsPane.visible = true
      this.fixLayout()

      this.root.select(this.buildingTools)
    }
  }
}
