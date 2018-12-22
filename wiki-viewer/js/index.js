$(document).ready(function (){
  $("#btnRandom").on("click", getRandom);
  $("#btnSearch").on('click', search);
});

function getRandom(){
  window.location.href = 'https://en.wikipedia.org/wiki/Special:Random';
}

function search(){
  $.ajax({
    url: 'https://en.wikipedia.org/w/api.php?origin=*',
    data: {
      action: 'query',
      list: 'search',
      srsearch: $('#inputSearch').val(),
      format: 'json'
    },
    dataType: 'json'
    //success: parseSearchResult
  }).done(parseSearchResult)
}

function parseSearchResult(data){
  $('#divResult').html('');
  if(data.query){
    for (var i=0; i<data.query.search.length; i++){
      $('#divResult').append(makeResultCard(data.query.search[i]));
    }
    
  }
}

function makeResultCard(data){
  return '<div class="resCard"><div class="title">' + data.title + '</div><div>' + data.snippet + '</div></div>';
}