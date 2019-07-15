/**
 *
 */
class PlayerPad {
  constructor(canvasW, canvasH) {
    this.x = 10;
    this.y = 100;
    this.w = 10;
    this.h = 50;
    this.speed = 3;

    this.id = 100;

    this.cw = canvasW;
    this.ch = canvasH;
    this.fillStyle = '#7215a8';
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    // ctx.fill();
    ctx.closePath();
  }

  movePad(dy) {
    this.y += dy;
    if (this.borderCollide(this.cw, this.ch)) {
      if (this.y < 0) this.y = 0;
      if (this.y + this.h >= this.ch) this.y = this.ch - this.h;
    }
  }

  borderCollide(w, h) {
    if (this.y + this.h > h || this.y < 0) {
      // console.log('[collide-pad-y]', this.y);
      return true;
    }
    return false;
  }
}

export default PlayerPad;
