const ESC = '\x1b'

module.exports = {
  ESC,

  C_BLACK:   0,
  C_RED:     1,
  C_GREEN:   2,
  C_YELLOW:  3,
  C_BLUE:    4,
  C_MAGENTA: 5,
  C_CYAN:    6,
  C_WHITE:   7,
  C_RESET:   9,

  clearScreen() {
    // Clears the screen, removing any characters displayed, and resets the
    // cursor position.

    return `${ESC}[2J`
  },

  moveCursorRaw(line, col) {
    // Moves the cursor to the given line and column on the screen.
    // Returns the pure ANSI code, with no modification to line or col.

    return `${ESC}[${line};${col}H`
  },

  moveCursor(line, col) {
    // Moves the cursor to the given line and column on the screen.
    // Note that since in JavaScript indexes start at 0, but in ANSI codes
    // the top left of the screen is (1, 1), this function adjusts the
    // arguments to act as if the top left of the screen is (0, 0).

    return `${ESC}[${line + 1};${col + 1}H`
  },

  setForeground(color) {
    // Sets the foreground color to print text with. See C_(COLOR) for colors
    // that can be used with this; C_RESET resets the foreground.
    //
    // If null or undefined is passed, this function will return a blank
    // string (no ANSI escape codes).

    if (typeof color === 'undefined' || color === null) {
      return ''
    }

    return `${ESC}[3${color}m`
  }
}
