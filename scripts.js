'use strict';

let Graphics = (function () {
    let context = null;
    let imgFloor = new Image();
    imgFloor.isReady = false;
    imgFloor.onload = function() {
    	this.isReady = true;
    };
    imgFloor.src = 'floor1.png';

    let breadCrumb = new Image();
    breadCrumb.isReady = false;
    breadCrumb.onload = function(){
      this.isReady = true;
    }
    breadCrumb.src = 'BreadCrumbs.png';

    let shortestPath = new Image();
    shortestPath.isReady = false;
    shortestPath.onload = function(){
      this.isReady = true;
    }
    shortestPath.src = 'shortestPath.png';

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

      that.draw = function(m, res) {
        context.strokeStyle = 'rgb(255,255,255)';
        context.lineWidth = 6
        context.save();
        if(imgFloor.isReady){
          context.drawImage(imgFloor, spec.x*(res/m), spec.y*(res/m),res/m, res/m);
       }
        //Draw top wall
        if(spec.start == true){
        }
        if(spec.end == true){
        }
        if(spec.wall.top === null){
          context.beginPath();
          context.moveTo(spec.x*(res/m), spec.y*(res/m));
          context.lineTo((spec.x+1)*(res/m), spec.y*(res/m));
          context.stroke();
        }
        //Draw lower wall
        if(spec.wall.bottom === null){
          context.beginPath();
          context.moveTo(spec.x*(res/m), (spec.y+1)*(res/m));
          context.lineTo((spec.x+1)*(res/m), (spec.y+1)*(res/m));
          context.stroke();
        }
        //Draw Right wall
        if(spec.wall.right === null){
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
        context.restore();
      };

      return that;
    }

    function drawCharacter(m, res, myChar){
      context.save();
      context.drawImage(myChar.myChar, myChar.location.x*(res/m)+(.25*(res/m)),
                        myChar.location.y*(res/m)+(.25*(res/m)),(res/m)/1.5, (res/m)/1.5);
      context.restore();
    }

    function drawBreadCrumbs(m, res, location) {
      context.save();
      if(location.breadCrumb){
        context.drawImage(breadCrumb, location.x*(res/m)+(.33*(res/m)),
                          location.y*(res/m)+(.33*(res/m)),(res/m)/3, (res/m)/3)
      }
      context.restore();
    }

    function drawShortestPath(m, res, location){
      context.save();
      context.drawImage(shortestPath, location.x*(res/m)+(.33*(res/m)),
                        location.y*(res/m)+(.33*(res/m)),(res/m)/3, (res/m)/3);
      context.restore();
    }

    function beginRender() {
        context.clear();
    }

    return {
      beginRender: beginRender,
      initialize: initialize,
      Cell: Cell,
      drawCharacter: drawCharacter,
      drawBreadCrumbs: drawBreadCrumbs,
      drawShortestPath: drawShortestPath
    };
}());

let MyMaze = (function(){
  let that = {};
  let maze = [];
  let shortestPath = [];

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
          parent: null,
          start: false,
          end: false
        }
        if(row === 0 && col === 0){
          maze[row][col].start = true;
          maze[row][col].breadCrumb = true;
        }
        if(row === m-1 && col === m-1){
          maze[row][col].end = true;
        }
        //maze[row][col] = Graphics.Cell(cell);  I want to put this after the maze has been completed.
      }
    }
    assignWalls(m);
    createShortestPath(m);
    return {
      maze,
      shortestPath
    };
  };

  function assignWalls(mSize){
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
    // prim.push(maze[startX][startY]);
    prim.push(maze[0][0]);
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
          maze[temp.y][temp.x].parent = maze[temp2.y][temp2.x];
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

  function createShortestPath(m){
    let row = m-1,
        col = m-1,
        p = maze[row][col];
    shortestPath.push(p);
    while(p.parent !== null){
      shortestPath.push(p.parent);
      p = p.parent
    }
  }

  function updateShortestPath(location){
    if(location.x === shortestPath[shortestPath.length-2 ].x && location.y === shortestPath[shortestPath.length-2].y){
      shortestPath.pop();
    }else{
      shortestPath.push(maze[location.y][location.x]);
    }
  }

  return{
    maze: maze,
    initMaze: initMaze,
    updateBreadCrumb: updateBreadCrumb,
    updateShortestPath: updateShortestPath
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
    //console.log('keyCode: ', keyCode);
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
  let currentMaze;
  let myChar;
  let mSize = 6;
  let myRes = 1000;
  let inputStage = {};
  let trail = false;
  let path = false;
  let tempMaze;

  function render(maze, character){
    drawMaze(maze);
    if(trail){
      drawBreadCrumbs();
    }
    if(path){
      drawShortestPath();
    }
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

  function drawShortestPath(){
    for(let i = 0; i < currentMaze.shortestPath.length; i++){
      Graphics.drawShortestPath(mSize, myRes, currentMaze.shortestPath[i]);
    }
  }

  function drawBreadCrumbs(){
    for(let i = 0; i < mSize; ++i){
      for(let j = 0; j < mSize; ++j){
        //let g = Graphics.Cell(maze[i][j]);
        Graphics.drawBreadCrumbs(mSize, myRes, currentMaze.maze[i][j]);
      }
    }
  }

  function processInput(character, maze) {
    for (let input in inputStage) {
    	myCharacter.moveCharacter(inputStage[input], character, maze);
    }
    inputStage = {};
  }

  function update(timeStamp, character){
    let lastLocation = {x:character.location.x, y:character.location.y};
    processInput(character, currentMaze.maze)
    if(lastLocation.x !== character.location.x || lastLocation.y !== character.location.y){
      MyMaze.updateShortestPath(character.location);
      console.log(currentMaze.shortestPath);
    }
    lastLocation = {x:character.location.x, y:character.location.y};
  }

  function gameLoop(time){
    elapsedTime = time - previousTime;
    previousTime = time;
    update(elapsedTime, myChar);
    render(currentMaze.maze, myChar)
    requestAnimationFrame(gameLoop);
  }

  that.initialize = function() {
      window.addEventListener('keydown', function(event) {
    		inputStage[event.keyCode] = event.keyCode;
    	});
      Graphics.initialize();
      currentMaze = MyMaze.initMaze(mSize);
      drawMaze(currentMaze.maze);
      myChar = myCharacter.createCharacter(currentMaze.maze[0][0]);
      drawCharacter(myChar);
      gameLoop(previousTime);
  }
  return that;
}());
