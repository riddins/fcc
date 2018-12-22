$(document).ready(()=>{
  $('#start').on('click', clock.start);
  $('#stop').on('click', clock.stop);
  $('#reset').on('click', clock.reset);
  $('#set').on('click', clickSet);
  $('#start').show();
  $('#stop').hide();
  $('#set').hide();
  $('#inputTime').hide();
  $('#inputBreak').hide();
  $('#clock').on('click', inputTime);
  $('#break').on('click', inputBreak);
  clock.set();
  clock.setBreak();
});

function inputTime(){
  toggleButtons();
  $('#clock').hide();
  $('#inputTime').show();
}

function inputBreak(){
  toggleButtons();
  $('#break').hide();
  $('#inputBreak').show();
}

function toggleButtons(){
  $('#start').hide();
  $('#stop').hide();
  $('#reset').hide();
  $('#set').show();
}

function clickSet(){ 
  var dur = $('#inputTime').val();
  var bDur = $('#inputBreak').val();
  clock.set(dur);
  clock.setBreak(bDur);
  $('#inputTime').hide();
  $('#inputBreak').hide();
  $('#set').hide();
  $('#start').show();
  //$('#stop').show();
  $('#reset').show();
  $('#clock').show();
  $('#break').show();
}


// clock module
var clock = (function (){
  var dur = 25;
  var brDur = 5;
  var current;
  var curBreak;
  var stopped;
  
  function startClock(){
    setTimeout(updateClock, 1000);
    $('#start').hide();
    $('#stop').show();
  };

  function stopClock(){
    $('#stop').hide();
    $('#start').show();
  }
  
  function setClock(val){
    if (val === '' || val === undefined) val = dur;
    dur = val;
    $('#clock').html(dur);
  }
  
  function setBreak(val){
    if (val === '' || val === undefined) val = brDur;
    brDur = val;
    $('#break').html(brDur);
  }
  
  function resetClock(){
    stopClock();
    setClock(dur);
    setBreak(brDur);
  }

  function updateClock(){
    current = $('#clock').html();
    curBreak = $('#break').html();
    stopped = $('#stop').is(':hidden');
    if (current - 1 >= 0 && !stopped) {
      $('#clock').html(current - 1);
    }
    else if (curBreak - 1 >= 0 && !stopped) {
      $('#break').html(curBreak - 1);
    }
    else if (!stopped) {setClock(); setBreak();};
    if (!stopped) setTimeout(updateClock, 1000);
}
  
  return {
    duration: dur,
    start: startClock,
    stop: stopClock,
    set: setClock,
    setBreak: setBreak,
    reset: resetClock
  }
  
})();