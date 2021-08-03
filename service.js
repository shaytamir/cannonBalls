import { mouse } from "./mouseState.js";

class Cannonfield {
  constructor(elem, color1, color2, div_name, _width, _height) {
    this.elem = elem;
    this.color1 = color1;
    this.color2 = color2;
    this.div_name = div_name;
    this.width = _width;
    this.height = _height;
    this.isCannon = false;
  }
  clearCannonfield = () => {
    this.ctx.clearRect(0, 0, this.width, this.height);
  };

  cannonOn = (e) => {
    this.canvas = document.getElementById(`canvas_${this.div_name}`);
    this.canvas.style.display = "block";
    this.canvasBounds = this.canvas.getBoundingClientRect();
    this.ctx = this.canvas.getContext("2d");

    mouse.x = e.pageX - this.canvasBounds.left - scrollX;
    mouse.y = e.pageY - this.canvasBounds.top - scrollY;

    this.clearCannonfield();
    return (this.isCannon = true);
  };
  cannonOff = () => {
    const canvaStyle = document.getElementById(`canvas_${this.div_name}`);
    canvaStyle.style.display = "none";
    this.clearCannonfield();
    return (this.isCannon = false);
  };
  createCircle = (e, radius, color) => {
    this.ctx.beginPath();
    this.ctx.arc(e.x, e.y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  };
  circlePosition = (e) => {
    this.x = mouse.x;
    this.y = mouse.y;
    this.minusPosWidth = mouse.position.x - mouse.x;
    this.minusPosHeight = mouse.position.y - mouse.y;
    this.createCircle(mouse, 10, this.color1);
  };

  recreateCircle = () => {
    let x = this.x;
    let y = this.y;
    this.createCircle({ x, y }, 10, this.color1);
  };
  createbullet = (e) => {
    const canvas = this.canvas;
    const ctx = this.ctx;
    const canvasBounds = this.canvas.getBoundingClientRect();

    mouse.x = mouse.position.x - canvasBounds.left - scrollX;
    mouse.y = mouse.position.y - canvasBounds.top - scrollY;

    let opposite = mouse.x - this.x + window.pageXOffset;
    let adjacent = mouse.y - this.y + window.pageYOffset;
    let angle = Math.atan2(adjacent, opposite);
    let speed = 8;
    const xAdd = speed * Math.cos(angle);
    const yAdd = speed * Math.sin(angle);

    let recreateCircle = () => {
      this.recreateCircle();
    };
    let x = this.x;
    let y = this.y;

    let color2 = this.color2;

    function drawBullet(e) {
      ctx.clearRect(x - 10, y - 10, 22, 22);
      recreateCircle();

      ctx.beginPath();
      ctx.arc(x + xAdd * 1.5, y + yAdd * 1.5, 4, 0, Math.PI * 2);
      ctx.fillStyle = color2;
      ctx.fill();
      ctx.closePath();
    }
    function draw() {
      drawBullet();
      if (x - 15 > canvas.width || x + xAdd < 0) return;
      if (y - 15 > canvas.height || y + yAdd < 0) return;

      x += xAdd;
      y += yAdd;
      requestAnimationFrame(draw);
    }
    draw();
  };
}

Cannonfield.prototype.addToHtml = function () {
  this.newDiv = document.createElement(this.elem);
  this.newDiv.id = this.div_name;
  this.newDiv.style.borderColor = this.color1;
  this.newDiv.style.width = this.width + "px";
  this.newDiv.style.height = this.height + "px";
  this.newDiv.className = "cannon_field";
  document.getElementById("container").appendChild(this.newDiv);
  /* create canvas */
  this.newDiv.innerHTML += `<canvas id="canvas_${this.div_name}" class="cannon_field_canvas" style="display:none;" width="${this.width}" height="${this.height}" ></canvas>`;

  document.getElementById(this.div_name).addEventListener("mousedown", (e) => {
    if (!this.isCannon) {
      /* click when no cannon */
      this.cannonOn(e);
      this.circlePosition(e);
    } else if (this.isCannon) {
      /* click when no cannon */

      let movingPosition = this.canvas.getBoundingClientRect();
      let movingX = movingPosition.left - this.canvasBounds.left;
      let movingY = movingPosition.top - this.canvasBounds.top;

      if (
        /* click on cannon positioning */
        e.x >= this.x - 10 + this.minusPosWidth + movingX &&
        e.x <= this.x + 10 + this.minusPosWidth + movingX &&
        e.y >= this.y - 10 + this.minusPosHeight + movingY &&
        e.y <= this.y + 10 + this.minusPosHeight + movingY
      ) {
        this.cannonOff();
      } else {
        /*click off cannon positioning */
        const div_name = this.div_name;

        let createBullet = (e) => {
          this.createbullet(e);
        };
        function shootBalls() {
          const timeout = setInterval(function () {
            createBullet(e);
          }, 5);
          document.getElementById(div_name).addEventListener("mouseup", () => {
            clearInterval(timeout);
            document
              .getElementById(div_name)
              .removeEventListener("mousemove", shootBalls);
          });
          document.getElementById(div_name).addEventListener("mouseout", () => {
            clearInterval(timeout);
            document
              .getElementById(div_name)
              .removeEventListener("mousemove", shootBalls);
          });
        }
        if (mouse.left.pressed) {
          shootBalls();
        }
      }
    }
  });
};

export function newCannonfield(
  elem,
  color1,
  color2,
  div_name,
  _width,
  _height
) {
  let cannonfield = new Cannonfield(
    elem,
    color1,
    color2,
    div_name,
    _width,
    _height
  );
  cannonfield.addToHtml();
}
