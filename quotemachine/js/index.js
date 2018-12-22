$(document).ready(function(){
  getQuote();
  $('#btnNewQuote').on('click', getQuote);
});


function getQuote(){
  var url = 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?';
  $.getJSON(url).done(parseR);
};

function parseR(data){
  var hrefTweet = 'https://twitter.com/intent/tweet'
  $('#quoteText').html('<p>"' + data.quoteText + '"</p>');
  $('#quoteAuthor').html('<p><em> - ' + data.quoteAuthor + ' - </em></p>');
  $('#btnTwitter').attr("href", hrefTweet + '/?text=' + encodeURIComponent(data.quoteText));
};