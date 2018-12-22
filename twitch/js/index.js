var NAMES = ["imaqtpie", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "HSdogdog", "nightblue3"]

$(document).ready(function (){
  var users = {};
  NAMES.forEach(name => {
    getUser(name)
      .done(userResp => {
        users[name] = {'user': userResp};
        getStream(userResp)
          .done(streamResp => {
            users[name].stream = streamResp; 
            insertStreamTag(users[name]); 
        });  
    });
  });
  //console.log(users); 
});  
 
function updateStream(stream){
  
}

function insertStreamTag(user){
  var clone = $("#template").clone();
  var streamStatus = getStreamStatus(user.stream);
  clone.attr('id', user.user.name);
  clone.removeAttr('hidden');
  clone.find('img').attr('src', user.user.logo);
  clone.find('.name').text(user.user.display_name);
  if (streamStatus === 'LIVE'){
    var streamTag = '<a href="' + user.stream.stream.channel.url + '">' + streamStatus + '</a>';
    clone.find('.game').text(user.stream.stream.game); 
    clone.find('.game').removeAttr('hidden');
  } 
  else {
    streamTag = streamStatus;
  }
  
  clone.find('.stream').html(streamTag);
  
  $('#listStreams').append(clone); 
}

function getStreamStatus(stream){
  var result;
  if (stream.stream){
    result = stream.stream.stream_type.toUpperCase();
  } else { result = 'OFFLINE'; } 
  return result;
}

function getUser(name){
  return $.ajax({
    url: 'https://wind-bow.gomix.me/twitch-api/users/' + name,
    dataType: 'jsonp'
  });
}

function getChannel(user){
  return $.ajax({
    url: 'https://wind-bow.gomix.me/twitch-api/channels/' + user._id,
    dataType: 'jsonp'
  });
}  

function getStream(user){
  return $.ajax({
    url: 'https://wind-bow.gomix.me/twitch-api/streams/' + user.name,
    dataType: 'jsonp'
  });
}