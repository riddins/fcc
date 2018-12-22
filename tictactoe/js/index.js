$(document).ready(()=>{
  var board = newBoard();
  renderBoard(board);
  $('.sqr').click(clickSquare);
  
  function clickSquare() {
    if (!board.hasWinner() && board.activePlayer === board.player.mark) {
      board = board.takeSquare(board.player.mark, $(this).attr('id'));
      $('#' + board.lastMove).off('click', clickSquare);
      renderBoard(board);
      board = board.opponent.makeMove(board, board.opponent.mark);
      $('#' + board.lastMove).off('click', clickSquare);
      renderBoard(board);
    }
  }
});



function renderBoard(board){
  $('.sqr').removeClass('o x');
  var squares = board.getSquares();
  Object.keys(squares).forEach((key)=>{
    var sq = squares[key];
    // check for marked square
    if (sq.value === 'x' || sq.value === 'o') {
      $('#' + key).addClass(squares[key].value);
    }
    // check for winning square
    if (board.isWinningSquare(key)) {
      $('#' + key).addClass('winner');
    }
  });
}

function minMax(board, mark, isMaximizer, depth) {
  var score;
  var justPlayed = mark;
  var activePlayer = board.activePlayer;
  
  if (isMaximizer) {
    //score = -9999
    if (board.isWinner(justPlayed)) {
      score = 10 - depth;
    } else if (board.isWinner(activePlayer)) {
      score = -10 + depth;
    } else if (board.hasEnded()){
      score = 0;
    } else {
      var availSquares = board.getSquares('');
      score = 9999
      Object.keys(availSquares).forEach((key)=>{
        var tmpBoard = board.takeSquare(activePlayer, key);
        var tmpScore = minMax(tmpBoard, activePlayer, false, depth + 1);
        if (tmpScore < score) score = tmpScore;
      });
    }
  } else {
    //score = 9999
    if (board.isWinner(justPlayed)) {
      score = -10 + depth;
    } else if (board.isWinner(activePlayer)) {
      score = 10 - depth;
    } else if (board.hasEnded()) {
      score = 0;
    } else { 
      availSquares = board.getSquares('');
      score = -9999
      Object.keys(availSquares).forEach((key)=>{
        var tmpBoard = board.takeSquare(activePlayer, key);
        var tmpScore = minMax(tmpBoard, activePlayer, true, depth + 1);
        if (tmpScore > score) score = tmpScore;
      });
    }
  }
  return score;
}

//********** NEW BOARD
function newBoard (squares, activeMark, playerMark, lastMove) {
  var rows = 3;
  var columns = 3;
  var colHeads = ['a', 'b', 'c'];
  if (!playerMark) playerMark = 'x';
  var player = {
    mark: playerMark,
  };

  var op = {
    mark: getOtherMark(player.mark),
    makeMove: makeMove
  }
  
  if (!activeMark) activeMark = player.mark;
  
  if (!squares) {
    squares = {};
    for (var i=0; i<rows; i++){
      for (var j=0; j<columns; j++){
        var sqr = newSquare(i, j);
        //console.log('i: ' + i + ', j: ' + j + ', ' + sqr.toString());
        squares[sqr.address] = sqr;
      }
    }
  }

  function makeMove(board, mark){
    var bestBoard;
    var bestScore = -9999;
    var availSquares;
    if (board.hasEnded()) {
      console.log('has ended')
      bestBoard = board;
    } else {
      availSquares = board.getSquares('');
      Object.keys(availSquares).forEach((key)=>{
        var tmpBoard = board.takeSquare(mark, key);
        var tmpScore = minMax(tmpBoard, mark, true, 0);
        console.log('bestScore: ' + bestScore + ' tmpScore(' + key + '): ' + tmpScore);
        if (tmpScore > bestScore) {
          bestBoard = tmpBoard;
          bestScore = tmpScore;
        }
      })
    }
    return bestBoard;
  }
 
  // returns a new squares object replicating the squares on the board for the 
  // specified mark.  Returns all squares if no mark is specified.
  function getSquares(mark) {
    var selected = {};
    
    if (!mark && mark !== '') {
      selected = squares;
    } else {
      Object.keys(squares).forEach((key)=>{
        var sq = squares[key];
        if (sq.value === mark){
          selected[key] = sq;
        }
      });
    }
    
    return selected
  } 
  
  function printSquares(mark){
    Object.keys(squares).forEach((key)=>{
      var sq = squares[key];
      if (sq.value === mark || !mark) console.log(key);
    });
  }
 
  // return new board with the square indicated by key taken by the specified mark
  function takeSquare(mark, key){
    var tmpBoard = this;
    if (mark === activeMark) {
      var sq = squares[key];
      var newSquares = {};
      //console.log('take: ' + sq.address);
      Object.keys(squares).forEach((key)=>{
        var tmp = squares[key];
        newSquares[key] = newSquare(tmp.rowIdx, tmp.colIdx, tmp.value);
      });
      newSquares[key] = newSquare(sq.rowIdx, sq.colIdx, mark);
      tmpBoard = newBoard(newSquares, getOtherMark(mark), player.mark, key); 
    }
    return tmpBoard; 
  }
  
  function hasEnded(){
    return hasWinner() || Object.keys(getSquares('')).length === 0;
  }
  
  function hasStarted(){
    return getSquares('x').length > 0 || getSquares('o').length > 0;
  }
  
  function hasWinner(){
    return isWinner(op.mark) || isWinner(player.mark);
  }
  
  function isWinner(mark){
    var winner = false;
   
    // check rows
    for (var i=0; i<3; i++){
      for (var j=0; j<3; j++){
        var adr = colHeads[j] + (i + 1);
        if (squares[adr].value !== mark) break;
        if (j===2) winner = true;
      }
      if (winner) break; 
    }
    
    // check columns
    if (!winner){
      for (i=0; i<3; i++){
        for (j=0; j<3; j++){
          adr = colHeads[i] + (j + 1);
          if (squares[adr].value !== mark) break;
          if (j===2) winner = true;
        }
        if (winner) break;
      }  
    }
    
    // check first diagnal
    if (!winner) {
      for (i=0; i<3; i++){
        adr = colHeads[i] + (i + 1);
        if (squares[adr].value !== mark) break;
        if (i===2) winner = true;
      }
    }  
    
    // check second diagnal
    if (!winner) {
      for (i=2; i>=0; i--){
        adr = colHeads[i] + (3 - i);
        if (squares[adr].value !== mark) break;
        if (i===0) winner = true;
      }
    }
    
    return winner;
    
  } 
  
  function isWinningSquare(adr){
    var winner = false;
    var sq = squares[adr];
    
    if (isWinningRow(sq.rowIdx+1)) {winner = true;}
    else if (isWinningCol(sq.colHeader)) {winner = true;}
    else if (isWinningDiagLeft(sq.address)) {winner = true;}
    else if (isWinningDiagRight(sq.address)) {winner = true;}
    return winner;
  }
  
  function isWinningRow(row){
    var a = squares['a'+row].value;
    var b = squares['b'+row].value;
    var c = squares['c'+row].value;
    var winner = a === b && b === c && !(a === '');
    return winner;
  }
  
  function isWinningCol(col){  
    var a = squares[col+'1'].value;
    var b = squares[col+'2'].value;
    var c = squares[col+'3'].value;
    var winner = a === b && b === c && !(a === '');
    return winner;
  }
    
  function isWinningDiagLeft(adr){
    var a = squares['a1'].value;
    var b = squares['b2'].value;
    var c = squares['c3'].value;
    var inDiag = false;
    if (adr === 'a1' || adr === 'b2' || adr === 'c3') inDiag = true;
    var winner = a === b && b === c && inDiag && !(a === '');
    return winner;
  }
  
  function isWinningDiagRight(adr){
    var a = squares['a3'].value;
    var b = squares['b2'].value;
    var c = squares['c1'].value;
    var inDiag = false;
    if (adr === 'a3' || adr === 'b2' || adr === 'c1') inDiag = true;
    var winner = a === b && b === c && inDiag && !(a === '');
    return winner;
  }
  
  return {
    //squares: squares,
    getSquares: getSquares,
    printSquares: printSquares,
    takeSquare: takeSquare,
    isWinner: isWinner,
    player: player,
    opponent: op,
    activePlayer: activeMark,
    hasWinner: hasWinner,
    hasStarted: hasStarted,
    hasEnded: hasEnded,
    lastMove: lastMove,
    isWinningSquare: isWinningSquare
  }  
  
  //NEW SQUARE
  function newSquare (row, column, value) {
    if (!value) value = '';
        
    return {
      address: toAddress(row, column),
      colIdx: column,
      colHeader: colHeads[column],
      rowIdx: row,
      toString: toString,
      value: value
    }
    
    function toString() {
      return 'Square: ' + this.address + ', val: ' + this.value + ', rowIdx: ' + this.rowIdx + ', colIdx: ' + this.colIdx
    }
    
  } 
  
  function toAddress(rowIdx, colIdx){
    return colHeads[colIdx] + (rowIdx + 1);
  }
  
  function getOtherMark(mark){
    var otherMark = mark;
    if (mark === 'x') { 
      otherMark = 'o';
    } else if (mark === 'o') {
      otherMark = 'x';
    }
    return otherMark;
  }
}