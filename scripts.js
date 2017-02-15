'use strict';

let Graphics = (function () {
    let context = null;

    function initialize() {
        let canvas = document.getElementById('canvas-main');
        context = canvas.getContext('2d');

        CanvasRenderingContext2D.prototype.clear = function() {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, canvas.width, canvas.height);
            this.restore();
        };
    }

    function Cell(spec){
      let that={};

      that.update = function (){
        console.log('updating function');
      };

      that.draw = function() {
        context.save();
        console.log(spec.location.x, spec.location.y);
        context.beginPath();
        context.moveTo(spec.location.x, spec.location.y);
        context.lineTo(spec.location.x+10, spec.location.y+10);
        context.stroke();
        context.restore();
      };

      return that;
    }

    function beginRender() {
        context.clear();
    }

    return {
      beginRender: beginRender,
      initialize: initialize,
      Cell: Cell
    };
}());


let MyMaze = (function(){
  let that = {}
  //let previousTime = performance.now();
  let previousTime = 0;
  let elapsedTime = 0;

  let mSize = 0;
  function initMaze(m){
    console.log('init my maze');
  }
  let myCell = Graphics.Cell({
    location: {x:0, y:0},
    wall: {up: null, down:null, left:null, right:null},
    visited: false,
    correctPath: false,
    here: false
  });

  let myCell2 = Graphics.Cell({
    location: {x:10, y:0},
    wall: {up: null, down:null, left:null, right:null},
    visited: false,
    correctPath: false,
    here: false
  });

  function update(){
    myCell.update();
    myCell2.update();
  }
  function render(){
    Graphics.beginRender();
    myCell.draw();
    myCell2.draw();
  }
  function gameLoop(time){
    elapsedTime = time - previousTime;
    previousTime = time;

    update();
    render();

    requestAnimationFrame(gameLoop);
  }

  that.initialize = function() {
      Graphics.initialize();

      gameLoop();
  }
  return that;
}());
/*
function cell(){
  var that ={};
  var location = {x:0, y:0},
      wall = {up: null, down:null, left:null, right:null},
      visited = false,
      correctPath = false,
      here = false;

  that.updateLocation = function(sX, sY){
    location.x = sX;
    location.y = sY;
  }

  that.updateUpWall = function(){
    wall.up = true;
  },
  that.updateDownWall = function(){
    wall.down = true;
  },
  that.updateLeftWall = function(){
    wall.left = true;
  },
  that.updateRightWall = function(){
    wall.right = true;
  },
  that.logger = function (){
    console.log(`x: ${location.x}, y: ${location.y}`);
    console.log(`wallUp: ${wall.up}, wallDown: ${wall.down}, wallLeft: ${wall.left}, wallRight: ${wall.right}`)
  }
  return that;
}

let mSize = 5;
let maze = [];
for(i=0; i<mSize; ++i){
  maze[i] = [];
  for(j=0; j<mSize; ++j){
      maze[i][j] = cell();
      maze[i][j].updateLocation(i, j);
  }

}

for(i=0; i<mSize; ++i){
  for(j=0; j< mSize; ++j){
    console.log('MyCell: ', maze[i][j].logger());
  }
}
*/
