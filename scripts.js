'use strict';

let Graphics = (function () {
    let context = null;
    let imgFloor = new Image();
    imgFloor.isReady = false;
    imgFloor.onload = function() {
    	this.isReady = true;
    };
    imgFloor.src = 'floor1.png';

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

    function drawCharacter(m, res, myChar){
      context.drawImage(myChar.myChar, myChar.location.x*(res/m), myChar.location.y*(res/m),res/m, res/m);
    }

    function Cell(spec){

      let that={};
      that.update = function (){
        console.log('updating function');
      };

      that.draw = function(m, res) {
        context.strokeStyle = 'rgb(255,255,255)';
        context.lineWidth = 6
        context.save();
        if(imgFloor.isReady){
          context.drawImage(imgFloor, spec.x*(res/m), spec.y*(res/m),res/m, res/m);
       }
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
          context.moveTo(spec.x*(res/m), spec.y*(res/m));
          context.lineTo((spec.x+1)*(res/m), spec.y*(res/m));
          context.stroke();
        }
        //Draw lower wall
        if(spec.wall.bottom === null){
          // console.log('Bottom Wall start: ', spec.x*(res/m), (spec.y+1)*(res/m))
          // console.log('Bottom Wall end: ', (spec.x+1)*(res/m), (spec.y+1)*(res/m))
          context.beginPath();
          context.moveTo(spec.x*(res/m), (spec.y+1)*(res/m));
          context.lineTo((spec.x+1)*(res/m), (spec.y+1)*(res/m));
          context.stroke();
        }
        //Draw Right wall
        if(spec.wall.right === null){
          // console.log('right Wall');
          context.beginPath();
          context.moveTo((spec.x+1)*(res/m), spec.y*(res/m));
          context.lineTo((spec.x+1)*(res/m), (spec.y+1)*(res/m));
          context.stroke();
        }
        //Draw Left wall
        if(spec.wall.left === null){
          context.beginPath();
          context.moveTo(spec.x*(res/m), spec.y*(res/m));
          context.lineTo(spec.x*(res/m), (spec.y+1)*(res/m));
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
      Cell: Cell,
      drawCharacter: drawCharacter
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
          breadCrumb: false,
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
    function addToPrims(x, y){

    }
    let startX = Math.floor((Math.random()*mSize))
    let startY = Math.floor((Math.random()*mSize))
    prim.push(maze[startX][startY]);
    //prim.push(maze[0][0]);
    while(prim.length !== 0){
      let num = Math.floor(Math.random()*prim.length)
      let temp = prim[num];
      prim.splice(num, 1);
      neighbors = [];
      maze[temp.y][temp.x].passage = true;

      if(isValid(temp.x, temp.y-1)){//top
        if(isNeighbor(maze[temp.y-1][temp.x])){
          neighbors.push(maze[temp.y-1][temp.x]);
        }else if(maze[temp.y-1][temp.x].visited === false){
          maze[temp.y-1][temp.x].visited = true;
          prim.push(maze[temp.y-1][temp.x]);
        }

      }
      if(isValid(temp.x+1, temp.y)){//right
        if(isNeighbor(maze[temp.y][temp.x+1])){
          neighbors.push(maze[temp.y][temp.x+1]);
        }else if(maze[temp.y][temp.x+1].visited === false){
          maze[temp.y][temp.x+1].visited = true;
          prim.push(maze[temp.y][temp.x+1]);
        }
      }
      if(isValid(temp.x, temp.y+1)){//bottom
        if(isNeighbor(maze[temp.y+1][temp.x])){
            neighbors.push(maze[temp.y+1][temp.x]);
        }else if(maze[temp.y+1][temp.x].visited === false){
          maze[temp.y+1][temp.x].visited = true;
          prim.push(maze[temp.y+1][temp.x]);
        }
      }
      if(isValid(temp.x-1, temp.y)){//left
        if(isNeighbor(maze[temp.y][temp.x-1])){
          neighbors.push(maze[temp.y][temp.x-1]);
        }else if(maze[temp.y][temp.x-1].visited === false){
          maze[temp.y][temp.x-1].visited = true;
          prim.push(maze[temp.y][temp.x-1]);
        }
      }
      if(neighbors.length !== 0){
          let num2 = Math.floor(Math.random()*neighbors.length)
          let temp2 = neighbors[num2];
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
    }
  }
  // initMaze(5);
  function updateBreadCrumb(y, x){
    maze[y][x].breadCrumb = true;
  }
  return{
    maze: maze,
    initMaze: initMaze,
    updateBreadCrumb: updateBreadCrumb
  }
}());

let myCharacter = (function(){
  let that = {};
  let location;

  function createCharacter(location){
    let myChar = new Image();
    myChar.isReady = false;
    myChar.onload = function(){
      this.isReady = true;
    }
    myChar.src = 'undeadLock.png';
    return {
      location: location,
      myChar: myChar
    }
  }
  function moveCharacter(keyCode, character, maze){
    console.log('keyCode: ', keyCode);
  	if (keyCode === 40 || keyCode ===83 || keyCode === 75) {
  		if (character.location.wall.bottom) {
  			character.location = character.location.wall.bottom;
        MyMaze.updateBreadCrumb(character.location.y, character.location.x)
  		}
  	}
  	if (keyCode === 38 || keyCode === 87 || keyCode === 73) {
  		if (character.location.wall.top) {
  			character.location = character.location.wall.top;
        MyMaze.updateBreadCrumb(character.location.y, character.location.x)
  		}
  	}
  	if (keyCode === 39 || keyCode === 68 || keyCode === 76) {
  		if (character.location.wall.right) {
  			character.location = character.location.wall.right;
        MyMaze.updateBreadCrumb(character.location.y, character.location.x)
  		}
  	}
  	if (keyCode === 37 || keyCode === 65 || keyCode === 74) {
  		if (character.location.wall.left) {
  			character.location = character.location.wall.left;
        MyMaze.updateBreadCrumb(character.location.y, character.location.x)
  		}
  	}
  };
  return {
    createCharacter: createCharacter,
    moveCharacter: moveCharacter
  }
}());

let MyGame = (function(){
  let that = {};
  let previousTime = 0;
  let elapsedTime = 0;
  let currentMaze = [];
  let myChar
  let mSize = 5;
  let myRes = 1000;
  let inputStage = {};

  function render(maze, character){
    drawMaze(maze);
    drawCharacter(character);
  }

  function drawMaze(maze){
    for(let i = 0; i < mSize; ++i){
      for(let j = 0; j < mSize; ++j){
        let g = Graphics.Cell(maze[i][j]);
        g.draw(mSize, myRes);
      }
    }
  }

  function drawCharacter(character){
    Graphics.drawCharacter(mSize, myRes, character);
  }

  function processInput(character, maze) {
  	for (let input in inputStage) {
  		myCharacter.moveCharacter(inputStage[input], character, maze);
  	}
  	inputStage = {};
  }

  function gameLoop(time){
    elapsedTime = time - previousTime;
    previousTime = time;
    processInput(myChar, currentMaze);
    render(currentMaze, myChar)
    requestAnimationFrame(gameLoop);
  }

  that.initialize = function() {
      window.addEventListener('keydown', function(event) {
    		//moveCharacter(event.keyCode, myCharacter);
    		inputStage[event.keyCode] = event.keyCode;
    	});
      Graphics.initialize();
      currentMaze = MyMaze.initMaze(mSize);
      drawMaze(currentMaze);
      myChar = myCharacter.createCharacter(currentMaze[0][0]);
      drawCharacter(myChar);
      gameLoop(previousTime);
  }
  return that;
}());
