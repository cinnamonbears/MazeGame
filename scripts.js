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
        //console.log('spec', spec)
        //Draw top wall
        if(spec.start == true){
          // console.log('start');
        }
        if(spec.end == true){
          // console.log('end');
        }
        if(spec.wall.top === null){
          // console.log('top Wall');
          context.beginPath();
          context.moveTo(spec.x*(1000/m), spec.y*(1000/m));
          context.lineTo((spec.x+1)*(1000/m), spec.y*(1000/m));
          context.stroke();
        }
        //Draw lower wall
        if(spec.wall.bottom === null){
          // console.log('Bottom Wall start: ', spec.x*(1000/m), (spec.y+1)*(1000/m))
          // console.log('Bottom Wall end: ', (spec.x+1)*(1000/m), (spec.y+1)*(1000/m))
          context.beginPath();
          context.moveTo(spec.x*(1000/m), (spec.y+1)*(1000/m));
          context.lineTo((spec.x+1)*(1000/m), (spec.y+1)*(1000/m));
          context.stroke();
        }
        //Draw Right wall
        if(spec.wall.right === null){
          // console.log('right Wall');
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
  let that = {};
  let maze = [];

  function initMaze(m){
    for(let row = 0; row < m; row++){
      maze[row] = [];
      for(let col = 0; col < m; col++){
        maze[row][col] = {
          x:col,
          y:row,
          passage: false,
          wall: {top: null, bottom: null, left: null, right: null},
          visited: false,
          correctPath: false,
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
    assignWalls(maze, m)
    //console.log(maze)
    return maze;
  };

  function assignWalls(maze, mSize){
    let prim = [];
    let neighbors = [];
    function isValid(x,y){

      if ((x>=0 && x < mSize) && (y >=0 && y < mSize)){
        return true;
      }
      return false;
    }
    function isNeighbor(temp){
      return (temp.passage);
    }
    let startX = Math.floor((Math.random()*mSize))
    let startY = Math.floor((Math.random()*mSize))
    // prim.push(maze[startX][startY]);
    prim.push(maze[0][0]);
    console.log('Starting point:  ', prim);
    while(prim.length !== 0){
      let num = Math.floor(Math.random()*prim.length)
      let temp = prim[num];
      prim.splice(num, 1);
      neighbors = [];
      maze[temp.y][temp.x].passage = true;

      if(isValid(temp.x, temp.y-1)){//top
        console.log('top')
        if(isNeighbor(maze[temp.y-1][temp.x])){
          neighbors.push(maze[temp.y-1][temp.x]);
        }else{

          prim.push(maze[temp.y-1][temp.x]);
        }
      }
      if(isValid(temp.x+1, temp.y)){//right
        console.log('right');
        if(isNeighbor(maze[temp.y][temp.x+1])){
          neighbors.push(maze[temp.y][temp.x+1]);
        }else{
          prim.push(maze[temp.y][temp.x+1]);
        }
      }
      if(isValid(temp.x, temp.y+1)){//bottom
        console.log('bottom');
        if(isNeighbor(maze[temp.y+1][temp.x])){
            neighbors.push(maze[temp.y+1][temp.x]);
        }else{
          prim.push(maze[temp.y+1][temp.x]);
        }
      }
      if(isValid(temp.x-1, temp.y)){//left
        console.log('left');
        if(isNeighbor(maze[temp.y][temp.x-1])){
          neighbors.push(maze[temp.y][temp.x-1]);
        }else{
          prim.push(maze[temp.y][temp.x-1]);
        }
      }
      if(neighbors.length !== 0){
          let num2 = Math.floor(Math.random()*neighbors.length)
          let temp2 = neighbors[num2];
          console.log('array at the position : ', num2, neighbors[num2]);
          console.log('Neighbors array: ', neighbors);
          if((temp2.x === temp.x) && (temp2.y == temp.y+1)){
            maze[temp.y][temp.x].wall.bottom = maze[temp2.y][temp2.x];
            maze[temp2.y][temp2.x].wall.top = maze[temp.y][temp.x];
          }else if((temp2.x === temp.x) && (temp2.y ==temp.y-1)){
            maze[temp.y][temp.x].wall.top=maze[temp2.y][temp2.x]
            maze[temp2.y][temp2.x].wall.bottom = maze[temp.y][temp.x];
          }else if((temp2.x === temp.x-1) && (temp2.y === temp.y)){
            maze[temp.y][temp.x].wall.left = maze[temp2.y][temp2.x]
            maze[temp2.y][temp2.x].wall.right = maze[temp.y][temp.x]
          }else if((temp2.x === temp.x+1) &&(temp2.y === temp.y)){
            maze[temp.y][temp.x].wall.right = maze[temp2.y][temp2.x]
            maze[temp2.y][temp2.x].wall.left = maze[temp.y][temp.x]
          }
      }
      console.log('prims: ', prim);
      //  break;
    }
  }
  initMaze(5);
  // function update(m){
  //   // console.log(maze)
  //   for(let row = 0; row < m; row++){
  //     for(let col =0; col<m; col++){
  //       //maze[row][col] = Graphics.Cell(maze[row][col]);
  //       //console.log('maze: ', maze[row][col])
  //     }
  //   }
  //   // console.log(maze)
  // }
  // function render(m){
  //
  //   Graphics.beginRender();
  //   for(let row = 0; row < m; row++){
  //     for(let col = 0; col<m; col++){
  //       // console.log(row, col);
  //       // console.log(maze);
  //       Graphics.Cell.maze[row][col].draw(mSize);
  //     }
  //   }
  // }
  return{
    maze: maze,
    initMaze: initMaze
  }
}());

let MyGame = (function(){
  let that = {};
  let previousTime = 0;
  let elapsedTime = 0;
  let currentMaze = [];
  let mSize = 3

  function gameLoop(time){
    elapsedTime = time - previousTime;
    previousTime = time;
    //update(mSize);
    //render(mSize);

    requestAnimationFrame(gameLoop);
  }

  function drawMaze(maze){
    for(let i = 0; i < mSize; ++i){
      for(let j = 0; j < mSize; ++j){
        let g = Graphics.Cell(maze[i][j]);
        g.draw(mSize);
        //console.log('Maze: ', maze[i][j]);
      }
    }
  }

  that.initialize = function() {
      Graphics.initialize();
      currentMaze = MyMaze.initMaze(mSize);
      console.log('Maze: ', currentMaze)
      drawMaze(currentMaze);
      gameLoop();
  }
  return that;
}());
