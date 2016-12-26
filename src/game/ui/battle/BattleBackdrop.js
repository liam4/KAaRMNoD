const ansi = require('../../../lib/ansi')

const DisplayElement = require('../../../lib/ui/DisplayElement')

module.exports = class BattleBackdrop extends DisplayElement {
  constructor() {
    super()

    this.texture = [

    String.raw`-------------------------------------//                            |--!/               |##|         \\--------------------------------------//                                          |--------`,
    String.raw`-------------------------------------|                             \!-|/               \__/          |--------------------------------------|                                           |--------`,
    String.raw`--------------------------I-I-------//   z                          \-/    ..                        \\------------------------------------//                       ...@.#...           |--------`,
    String.raw`--------------------------| |-------|   *!*                         \!     ..                         |------------------------------------|   e_e                     .#.              \\-------`,
    String.raw`--------------------------| |------//    z      +/\+                                 __               \\---;------------------------------//    ;                                        |-------`,
    String.raw`----+--+------------------| |------|             \/                   ....          .EE.               |---;----------;-------------------|                      #         #   .         |-------`,
    String.raw`----|  |-----/\-----------| |-----//                    ..              ?..          ~~  ~~~~          \\-*-*\_._._./*-*\;---------------//   .  ~~~              #     #            .   \-------`,
    String.raw`--;-|  |---./  \--;-------| |-----|         /\         ****      _                            #         |          _    |;-/-*-*\___-----|     ....            # #                  ..    \\-----`,
    String.raw`-;;-|  |.-;/   ;\-;--;----I I----//        +\/+          * *    /#\                       !             \\     ;  /;\   |;-|  # |;  \---//                   # ##  #              ..**\    \\----`,
    String.raw`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~=~~===~=~~=======~~=======================-=============x================~====~~~=~~~~~~~~~~~~~~~~~~~~~~~~~~~========================x==============--/*.==~==~~~~~~`,
    String.raw`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^===^^^======^^==========^========x===========.===========================^^=^^=^^^^^^^^^^^^^^^^^^^^^^^^^^=^=^^==================z=================/**..=*====-=^^^`,
    String.raw`------------------------------============----=============-==================*==========================-===---=-------------------=--===========================================/*-*.===--=----`

    ]

    this.scrollAmount = 0
  }

  drawTo(writable) {
    writable.write(ansi.setAttributes([ansi.A_DIM]))

    for (let y = 0; y < this.texture.length; y++) {
      const row = this.texture[y]
      const rendX = this.absX
      const rendY = this.absY + y
      if (rendY > this.absBottom || rendY < this.absTop) continue

      const text = row.slice(this.scrollAmount, this.scrollAmount + this.w)
      writable.write(ansi.moveCursor(rendY, rendX))
      writable.write(text)
    }

    writable.write(ansi.resetAttributes())
  }

  get textureLength() {
    return Math.max(...this.texture.map(row => row.length))
  }

  scrollToPercent(pc) {
    this.scrollAmount = (this.textureLength - this.w) / 100 * pc
  }

  smoothlyScrollToPercent(pc, divisor = 8) {
    const old = this.scrollAmount
    this.scrollToPercent(pc)
    this.scrollAmount = old + Math.ceil((this.scrollAmount - old) / divisor)
  }
}
