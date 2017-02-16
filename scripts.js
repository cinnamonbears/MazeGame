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

      that.draw = function(m) {
        context.save();
        //Draw top wall
        if(spec.start == true){
          console.log('start');
        }
        if(spec.end == true){
          console.log('end');
        }
        if(spec.wall.top === null){
          console.log('top Wall');
          context.beginPath();
          context.moveTo(spec.x*(1000/m), spec.y*(1000/m));
          context.lineTo((spec.x+1)*(1000/m), spec.y*(1000/m));
          context.stroke();
        }
        //Draw lower wall
        if(spec.wall.bottom === null){
          console.log('Bottom Wall start: ', spec.x*(1000/m), (spec.y+1)*(1000/m))
          console.log('Bottom Wall end: ', (spec.x+1)*(1000/m), (spec.y+1)*(1000/m))
          context.beginPath();
          context.moveTo(spec.x*(1000/m), (spec.y+1)*(1000/m));
          context.lineTo((spec.x+1)*(1000/m), (spec.y+1)*(1000/m));
          context.stroke();
        }
        //Draw Right wall
        if(spec.wall.right === null){
          console.log('right Wall');
          context.beginPath();
          context.moveTo((spec.x+1)*(1000/m), spec.y*(1000/m));
          context.lineTo((spec.x+1)*(1000/m), (spec.y+1)*(1000/m));
          context.stroke();
        }
        //Draw Left wall
        if(spec.wall.left === null){
          context.beginPath();
          context.moveTo(spec.x*(1000/m), spec.y*(1000/m));
          context.lineTo(spec.x*(1000/m), (spec.y+1)*(1000/m));
          context.stroke();
        }
        //console.log(spec.x, spec.y);
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
  let maze = [];
  let previousTime = 0;
  let elapsedTime = 0;

  let mSize = 5;
  function initMaze(m){
    //console.log('init my maze');
    for(let row = 0; row < m; row++){
      maze[row] = [];
      for(let col = 0; col < m; col++){
        maze[row][col] = {
          x:row,
          y:col,
          wall: {top: null, bottom: null, left: null, right: null},
          visited: false,
          correctPath: false,
          here: false,
          start: false,
          end: false
        }
        if(row === 0 && col === 0){
          maze[row][col].start = true;
        }
        if(row === m-1 && col === m-1){
          maze[row][col].end = true;
        }
        //maze[row][col] = Graphics.Cell(cell);  I want to put this after the maze has been completed.
      }
    }
    let startX = Math.floor((Math.random()*mSize))
    console.log(startX);
    let startY = Math.floor((Math.random()*mSize))
    console.log(startY);
    //console.log(maze)
  }
  initMaze(mSize);
  //  console.log(maze)

  function update(m){
    for(let row = 0; row < m; row++){
      for(let col =0; col<m; col++){
        maze[row][col].update();
      }
    }
  }
  function render(m){

    Graphics.beginRender();
    for(let row = 0; row < m; row++){
      for(let col =0; col<m; col++){
        //console.log(row, col)
        maze[row][col].draw(mSize);
      }
    }
  }
  function gameLoop(time){
    elapsedTime = time - previousTime;
    previousTime = time;

    update(mSize);
    render(mSize);

    requestAnimationFrame(gameLoop);
  }

  that.initialize = function() {
      Graphics.initialize();

      gameLoop();
  }
  return that;
}());
