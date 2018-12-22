var gCurrentOper;
var gOperators = {
  '*': 'multiply',
  '+': 'add',
  '-': 'subtract',
  '/': 'divide'
}

$(document).ready(function(){
  $('#ac').click(clickAllClear);
  $('#c').click(clickClear);
  bindClicks();
});

function clearOperator(){
  if (gCurrentOper){
      $(gCurrentOper).css('background-color', '');
      $(gCurrentOper).css('color', ''); 
      gCurrentOper = undefined;
    }
}

function updateOperator(operEle){
  clearOperator();  
  if(operEle){
    gCurrentOper = operEle;
    $(operEle).css('background-color', 'black');
    $(operEle).css('color', 'white');
  }
}



function clickAllClear(){
  $('#entry').text('');
  $('#equation').text('');
  clearOperator();
}

function clickClear(){
  var eq = $('#equation').text();
  var tail = eq.slice(-2);
  if (['+', '-', '*', '/'].indexOf(tail[0]) > -1 && tail[1] === ' '){
    $('#equation').text(eq.slice(0, eq.length - 2) + ' ');
    var newOper = $('#' + gOperators[tail[0]]);
    updateOperator(newOper);
  }
  $('#entry').text('');
  //console.log(gCurrentOper);
  //console.log(eq.slice(0, eq.length - 2));
}

function bindClicks(){
  //bind click events for Num buttons
  var nums = $('.btn.num')
  for (var i=0; i < nums.length; i++){
    $(nums[i]).click(clickNum($(nums[i]).text()));
  }
  //bind click events for Opeartor buttons
  var opers = $('.btn.operator')
  for (i=0; i < opers.length; i++){
    var oper = $(opers[i]).text(); 
    if (['+/-','='].indexOf(oper) === -1){
      $(opers[i]).click(clickOperator(opers[i]));
    } 
    else if (oper === '=') {
      $(opers[i]).click(clickEqual);
    }
    else if (oper === '+/-'){
      $(opers[i]).click(clickNegate);
    }
  }
} 

function clickNum(val){
  return ()=>{
    var entry = $('#entry').text();
    
    if (entry === '0') entry = '';
    
    if(gCurrentOper){
      var oper = $(gCurrentOper).text();
      if ( oper === '=' ) {
        $('#equation').text(' ');
        entry = '';
      } 
      else {
        var tmpText = $('#equation').text(); 
        tmpText += $(gCurrentOper).text() + ' ';
        $('#equation').text(tmpText);
      }
      clearOperator();
    }
    
    if(!gCurrentOper){
      entry += val;
      $('#entry').text(entry);
    }
    
  };
}

function clickOperator(operEle){
  return ()=>{
    var equation = $('#equation').text();
    var entry = $('#entry').text();
    
    if ( ['', '.'].indexOf(entry) === -1) {
      if (equation === ''){
        equation += entry + ' ';
      }
      else { equation += entry + ' '; }
      
      $('#equation').text(equation); 
      $('#entry').text(''); 
    }
    if (equation !== '') updateOperator(operEle);
  }
}

function clickEqual(){
  var entry = $('#entry').text();
  var equation = $('#equation').text();
  var arrayEquation = equation.trimRight().split(' ');
  var result;
  var oper;
  
  if (entry) arrayEquation.push(entry);
  if (gCurrentOper) clearOperator();
  gCurrentOper = $('#equal')

  arrayEquation.forEach((x)=>{
    if (['+', '-', '*', '/'].indexOf(x) > -1){
      oper = x;
    }
    else {
      x = Number(x);
      if (!result){ 
        result = x;
      }
      else {
        //console.log(result + ' ' + oper + ' ' + x);
        //console.log(result + x);
        switch (oper){
          case '+': result += x; break;
          case '-': result -= x; break;
          case '*': result *= x; break;
          case '/': result /= x; break;
        }
        //console.log(result); 
      }
    }
  });
  $('#entry').text(result);
  $('#equation').text('');
  
}

function clickNegate(){
  var entry = $('#entry').text();
  if (entry) $('#entry').text(Number(entry) * -1);
}