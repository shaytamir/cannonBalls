function ButtonState() {
  this.down = false;
  this.pressed = false;
}
function Vector2(x, y) {
  this.x = typeof x !== "undefined" ? x : 0;
  this.y = typeof y !== "undefined" ? y : 0;
}

function handleMouseMove(e) {
  let x = e.x;
  let y = e.y;
  // console.log(x, y);

  mouse.position = new Vector2(x, y);
}
function handleMouseDown(e) {
  document.onmousemove(e);

  if (e.which === 1) {
    if (!mouse.left.down) mouse.left.pressed = true;
    mouse.left.down = true;
  } else if (e.which === 2) {
    if (!mouse.middle.down) mouse.middle.pressed = true;
    mouse.middle.down = true;
  } else if (e.which === 3) {
    if (!mouse.right.down) mouse.right.pressed = true;
    mouse.right.down = true;
  }
}
function handleMouseUp(e) {
  document.onmousemove(e);

  if (e.which === 1) {
    mouse.left.down = false;
  } else if (e.which === 2) {
    mouse.middle.down = false;
  } else if (e.which === 3) {
    mouse.right.down = false;
  }
}

export function MouseHandler() {
  this.left = new ButtonState();
  this.middle = new ButtonState();
  this.right = new ButtonState();
  this.position = new Vector2();

  document.onmousemove = handleMouseMove;
  document.onmousedown = handleMouseDown;
  document.onmouseup = handleMouseUp;
}

MouseHandler.prototype.reset = () => {
  this.left.pressed = false;
  this.middle.pressed = false;
  this.right.pressed = false;
};

export let mouse = new MouseHandler();
