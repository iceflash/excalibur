/**
 * Ball class
 */
class Ball {

    constructor(cw, ch){
        this.x = 200;
        this.y = 200;
        this.r = 10;
        this.speed = 0;
        this.direction = 70; // 0 is down direction

        this.cw = cw;
        this.ch = ch;

        this.fillStyle = "#0095DD";
    }
  
    draw(ctx){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 180);
      ctx.fillStyle = this.fillStyle;
      ctx.fill();
      ctx.closePath();
    }
  
    move(){
      this.borderCollide(this.cw, this.ch);
  
      this.x += Math.sin(this.direction*Math.PI/180)*this.speed;
      this.y += Math.cos(this.direction*Math.PI/180)*this.speed;
    }
  
    borderCollide(w,h){
      
      if(this.x+this.r>w ||this.x-this.r<0){
        this.direction = this.direction * -1;
        // console.log('[collide-x]', this.direction);
        return true;
      }
  
      if(this.y+this.r>h ||this.y-this.r<0){
        this.direction = 180 - this.direction; 
        
        // console.log('[collide-y]', this.direction);
        return true;
      }
    }
  
    rectCollide(rect){
      
      //pad collide
      if(this.x)
      if( ((((this.x - this.r) < rect.x+rect.w) && ((this.x - this.r) > rect.x)) || // right from rect
          (((this.x + this.r) > rect.x) && ((this.x + this.r) < rect.x+rect.w)) )&& // left from rect and on y
          ((this.y+this.r) > rect.y &&
          (this.y-this.r) < rect.y+rect.h)){
  
        // make bounce
        this.direction = this.direction * -1;
        // console.log('[collide-with-pad-x]', this.direction);
        return true;
      }
    }  
  };

  export default Ball;