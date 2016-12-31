module.exports = class Element {
  // An element. Usually water, fire, msytic, earth, or air. Not to be
  // confused with UI elements! (See lib.)

  constructor() {
    this.effectiveAgainst = null
  }

  isEffectiveAgainst(element) {
    return (element === this.effectiveAgainst)
  }
}

Element.WATER = new Element()
Element.FIRE = new Element()
Element.MYSTIC = new Element()
Element.EARTH = new Element()
Element.AIR = new Element()

// Water > Fire > Mystic > Earth > Air > Water

Element.WATER.effectiveAgainst = Element.FIRE
Element.FIRE.effectiveAgainst = Element.MYSTIC
Element.MYSTIC.effectiveAgainst = Element.EARTH
Element.EARTH.effectiveAgainst = Element.AIR
Element.AIR.effectiveAgainst = Element.WATER
