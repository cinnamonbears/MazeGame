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

    let hint = new Image();
    hint.isReady=false;
    hint.onload = function(){
      this.isReady = true;
    }
    hint.src = 'hint.png';

    let finish = new Image();
    finish.isReady = false;
    finish.onload = function(){
      this.isReady = true;
    }
    finish.src = 'finish.png';

    let home = new Image();
    home.isReady = false;
    home.onload = function(){
      this.isReady = true;
    }
    home.src = 'home.png';

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
        if(spec.start == true){
          context.drawImage(home, spec.x*(res/m)+(.25*(res/m)),
                            spec.y*(res/m)+(.25*(res/m)),(res/m)/1.5, (res/m)/1.5);
        }
        if(spec.end == true){
          context.drawImage(finish, spec.x*(res/m)+(.25*(res/m)),
                            spec.y*(res/m)+(.25*(res/m)),(res/m)/1.5, (res/m)/1.5);
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

    function drawHint(m, res, location){
      context.save();
      context.drawImage(hint, location.x*(res/m)+(.33*(res/m)),
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
      drawShortestPath: drawShortestPath,
      drawHint: drawHint
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
          bonusPoints: false, //part of the path for bonus points
          passage: false,//is a passage in the maze
          wall: {top: null, bottom: null, left: null, right: null}, // Walls
          visited: false, //cell was visited during creation
          breadCrumb: false,//cell has been visited
          parent: null, //parent maze cell
          start: false, //Starting Cell
          end: false // ending cell
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
        maze[row][col].bonusPoints = true;
    shortestPath.push(p);
    while(p.parent !== null){
      shortestPath.push(p.parent);
      p = p.parent
      maze[p.y][p.x].bonusPoints = true;
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

  function checkScore(c){
    return (c.location.breadCrumb === false && c.location.bonusPoints === true)
  }

  function moveCharacter(keyCode, character, maze, score){
  	if (keyCode === 40 || keyCode ===83 || keyCode === 75) {
  		if (character.location.wall.bottom) {
  			character.location = character.location.wall.bottom;
        if(checkScore(character)){
          score += 5;
        }else if(character.location.breadCrumb === false){
          score -= 1;
        }
        MyMaze.updateBreadCrumb(character.location.y, character.location.x)
  		}
  	}
  	else if (keyCode === 38 || keyCode === 87 || keyCode === 73) {
  		if (character.location.wall.top) {
  			character.location = character.location.wall.top;
        if(checkScore(character)){
          score += 5;
        }else if(character.location.breadCrumb === false){
          score -= 1;
        }
        MyMaze.updateBreadCrumb(character.location.y, character.location.x)
  		}
  	}
  	else if (keyCode === 39 || keyCode === 68 || keyCode === 76) {
  		if (character.location.wall.right) {
  			character.location = character.location.wall.right;
        if(checkScore(character)){
          score += 5;
        }else if(character.location.breadCrumb === false){
          score -= 1;
        }
        MyMaze.updateBreadCrumb(character.location.y, character.location.x)
  		}
  	}
  	else if (keyCode === 37 || keyCode === 65 || keyCode === 74) {
  		if (character.location.wall.left) {
  			character.location = character.location.wall.left;
        if(checkScore(character)){
          score += 5;
        }else if(character.location.breadCrumb === false){
          score -= 1;
        }
        MyMaze.updateBreadCrumb(character.location.y, character.location.x)
  		}
  	}
    return score;
  };
  return {
    createCharacter: createCharacter,
    moveCharacter: moveCharacter
  }
}());

let MyGame = (function(){
  let that = {};
  let previousTime = performance.now();
  let elapsedTime = 0;
  let currentMaze;
  let myChar;
  let mSize = 20;
  let myRes = 1000;
  let inputStage = {};
  let trail = false;
  let path = false;
  let hint = false;
  let showScore = false;
  let tempMaze;
  let score = 0;
  let timer = 0;
  let gameOver = false;

  function render(maze, character){
    drawMaze(maze);
    if(trail){
      drawBreadCrumbs();
    }
    if(path){
      drawShortestPath();
    }
    if(hint){
      drawHint();
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

  function drawHint(){
    if(currentMaze.shortestPath.length > 1){
      Graphics.drawHint(mSize, myRes, currentMaze.shortestPath[currentMaze.shortestPath.length-2])
    }
  }

  function processInput(character, maze) {
    for (let input in inputStage) {
      if(input == 72){
        hint = true;
      }else if(input == 66){
        trail ? trail=false : trail = true;
      }else if(input == 80){
        path ? path=false : path = true;
      }else if(input == 89){
        showScore ? showScore = false : showScore = true;
      }else{
        score = myCharacter.moveCharacter(inputStage[input], character, maze, score);
        if(score < 0) score =0;
      }
    }
    inputStage = {};
  }

  function update(timeStamp, character){
    let lastLocation = {x:character.location.x, y:character.location.y};
    processInput(character, currentMaze.maze);
    if(lastLocation.x !== character.location.x || lastLocation.y !== character.location.y){
      MyMaze.updateShortestPath(character.location);
      hint = false;
    }
    if(character.location. y === mSize -1 && character.location.x === mSize -1){
      console.log('Game Over');
      gameOver = true;
    }
    lastLocation = {x:character.location.x, y:character.location.y};
    if(timeStamp > 1000){
      timer+=1;
      console.log(timer);
      elapsedTime -= 1000;
    }
  }

  function resetGame(){
    previousTime = performance.now();
    elapsedTime = 0;
    currentMaze;
    myChar;
    mSize = 20;
    myRes = 1000;
    inputStage = {};
    trail = false;
    path = false;
    hint = false;
    showScore = false;
    tempMaze = [];
    score = 0;
    timer = 0;
    gameOver = false;
  }

  function gameLoop(time){
    elapsedTime += time - previousTime;
    previousTime = time;
    update(elapsedTime, myChar);
    render(currentMaze.maze, myChar);
    if(!gameOver){
      requestAnimationFrame(gameLoop);
    }
  }

  that.initialize = function(mazeSize) {
      resetGame();
      mSize = mazeSize;
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

function onFiveByFive(size){
  MyGame.initialize(size);
}
