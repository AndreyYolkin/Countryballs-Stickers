function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = false
  }
  if (typeof radius === 'undefined') {
    radius = 0
  }
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius }
  } else {
    const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 }
    for (const side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side]
    }
  }
  ctx.beginPath()
  ctx.moveTo(x + radius.tl, y)
  ctx.lineTo(x + width - radius.tr, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
  ctx.lineTo(x + width, y + height - radius.br)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
  ctx.lineTo(x + radius.bl, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
  ctx.lineTo(x, y + radius.tl)
  ctx.quadraticCurveTo(x, y, x + radius.tl, y)
  ctx.closePath()
  if (fill) {
    ctx.fill()
  }
  if (stroke) {
    ctx.stroke()
  }
}
if (fabric && fabric.Textbox) {
  fabric.Textbox.prototype._renderBackground = function(ctx) {
    if (!this.backgroundColor) {
      return
    }
    const dim = this._getNonTransformedDimensions()
    ctx.fillStyle = this.backgroundColor

    ctx.fillRect(
      -dim.x / 2 - this.padding,
      -dim.y / 2 - this.padding,
      dim.x + this.padding * 2,
      dim.y + this.padding * 2
    )
    // if there is background color no other shadows
    // should be casted
    this._removeShadow(ctx)
  }

  fabric.Textbox.prototype._renderTextLinesBackground = function(ctx) {
    if (!this.textBackgroundColor && !this.styleHas('textBackgroundColor')) {
      return
    }
    let heightOfLine
    let lineLeftOffset; const originalFill = ctx.fillStyle
    let line; let lastColor
    const leftOffset = this._getLeftOffset()
    let lineTopOffset = this._getTopOffset()
    let boxStart = 0; let boxWidth = 0; let charBox; let currentColor; const path = this.path
    let drawStart

    for (let i = 0, len = this._textLines.length; i < len; i++) {
      heightOfLine = this.getHeightOfLine(i)
      if (!this.textBackgroundColor && !this.styleHas('textBackgroundColor', i)) {
        lineTopOffset += heightOfLine
        continue
      }
      line = this._textLines[i]
      lineLeftOffset = this._getLineLeftOffset(i)
      boxWidth = 10
      boxStart = -5
      lastColor = this.getValueOfPropertyAt(i, 0, 'textBackgroundColor')
      for (let j = 0, jlen = line.length; j < jlen; j++) {
        charBox = this.__charBounds[i][j]
        currentColor = this.getValueOfPropertyAt(i, j, 'textBackgroundColor')
        if (path) {
          ctx.save()
          ctx.translate(charBox.renderLeft, charBox.renderTop)
          ctx.rotate(charBox.angle)
          ctx.fillStyle = currentColor
          currentColor && roundRect(ctx,
            -charBox.width / 2,
            -heightOfLine / this.lineHeight * (1 - this._fontSizeFraction),
            charBox.width,
            heightOfLine / this.lineHeight,
            6,
            currentColor
          )
          ctx.restore()
        } else if (currentColor !== lastColor) {
          drawStart = leftOffset + lineLeftOffset + boxStart
          if (this.direction === 'rtl') {
            drawStart = this.width - drawStart - boxWidth
          }
          ctx.fillStyle = lastColor
          lastColor && roundRect(ctx,
            drawStart,
            lineTopOffset,
            boxWidth,
            heightOfLine / this.lineHeight,
            6,
            lastColor
          )
          boxStart = charBox.left
          boxWidth = charBox.width
          lastColor = currentColor
        } else {
          boxWidth += charBox.kernedWidth
        }
      }
      if (currentColor && !path) {
        drawStart = leftOffset + lineLeftOffset + boxStart
        if (this.direction === 'rtl') {
          drawStart = this.width - drawStart - boxWidth
        }
        ctx.fillStyle = currentColor
        roundRect(ctx,
          drawStart,
          lineTopOffset,
          boxWidth,
          heightOfLine / this.lineHeight,
          6,
          currentColor
        )
      }
      lineTopOffset += heightOfLine
    }
    ctx.fillStyle = originalFill
    // if there is text background color no
    // other shadows should be casted
    this._removeShadow(ctx)
  }
}

export default {}
