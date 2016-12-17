const net = require('net')
const ansi = require('./lib/ansi')
const unic = require('./lib/unichars')
const Pane = require('./lib/ui/Pane')

const server = new net.Server(socket => {
  //console.log(socket.constructor.prototype)

  let socketWidth = 80
  let socketHeight = 24

  socket.write(ansi.clearScreen())

  // const cols = [3, 15, 20, 21, 24, 38]
  // for (let col of cols) {
  //   for (let l = 0; l <= socketHeight; l++) {
  //     socket.write(ansi.moveCursor(l, col));
  //     socket.write(unic.BOX_V)
  //   }
  // }

  const p = new Pane()
  p.w = socketWidth
  p.h = socketHeight
  p.drawFrame(socket)

  const p2 = new Pane()
  p2.w = 8
  p2.h = 3
  p.addChild(p2)
  p2.drawFrame(socket)
})

server.listen(8008)
