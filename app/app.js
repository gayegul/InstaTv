$(document).ready(function() {

  // url for a SoundCloud playlist ajax call
  var SC_clientID1 = "a453e1bd2658";
  var SC_clientID2 = "fff4e0b83f";
  var SC_clientID3 = "f2ab3829bc";
  var SC_URL = "http://api.soundcloud.com/playlists/151936626?client_id=" + SC_clientID1 + SC_clientID2 + SC_clientID3;
  // 1 song list for testing DELETE after tests pass
  // var SC_URL = "http://api.soundcloud.com/playlists/152086334?client_id=" + SC_clientID1 + SC_clientID2 + SC_clientID3;

  // makes an ajax call and provides an array of song urls
  function getPlayList(url, callback) {
    $.ajax({
      type: "GET",
      dataType: "json",
      cache: false,
      url: url,
      success: function(data) {
        var songList = [];
        var song;
        for(var i = 0; i < data.track_count; i++) {
          song = data.tracks[i].stream_url + "?client_id=" + SC_clientID1 + SC_clientID2 + SC_clientID3;
          songList.push(song);
        }
        callback(songList);
      },
      error: function() {
        console.log(arguments);
      }
    });
  }

  var arrayOfSongs = [];
  var song;

  // gets the playlist as an array of urls invokes playSong()
  getPlayList(SC_URL, function(songList) {
    console.log(songList);
    for(var i = 0; i < songList.length; i++) {
      arrayOfSongs.push(songList[i]);
    }
    getSong();
  });

  var songNumber = -1;

  // gets the song in queue from the playlist
  function getSongNumber() {
    if(songNumber < arrayOfSongs.length) {
      songNumber++;
    } else {
      songNumber = 0;
    }
  }

  // gets the first song from playlist and removes it from the array
  function getSong() {
    getSongNumber();
    song = arrayOfSongs[songNumber];
    $('#song').attr("src", song).attr("preload", "auto");
  }

  // adds an eventhandler to play the song
  $('#song').click('play', getSong);

  // plays the song
  function playSong() {
    getSongNumber();
    song = arrayOfSongs[songNumber];
    $('#song').attr("src", song).attr("preload", "auto").get(0).play();
    console.log('playing ' + song);
  }

  // adds a eventhandler for when the song is over
  $('#song').on('ended', playSong);

  // url for an ajax call for the first set of Instagram videos
  var KEY1 = "1b04a24609";
  var KEY2 = "a04cecbef8";
  var KEY3 = "dc4aac619e96";
  var URL = "https://api.instagram.com/v1/tags/hyperlapse/media/recent?client_id=" + KEY1 + KEY2 + KEY3;

  // makes an ajax call to get video urls and uploader's info and provides the url list and usernames as an array
  function getVideoUrls(url, callback) {
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: url,
      success: function(data) {
        var videoUrls = [];
        var usernames = [];
        for(var i = 0; i < data.data.length; i++) {
          if(data.data[i].videos) {
            videoUrls.push(data.data[i].videos.standard_resolution.url);
            usernames.push(data.data[i].caption.from.username);
          }
        }
        callback(videoUrls, data.pagination.next_url, usernames);
      },
      error: function() {
        console.log(arguments);
      }
    });
  }

  var videos = [];
  var usernames = [];
  var video;

  // gets the video and uploader's Instagram username in line to display and play
  function enqueueVideoAndInfo() {
    video = videos.shift();
    username = usernames.shift();
    $('video').attr("src", video).attr("controls", true).prop("muted", true).get(0).play();
    $('#username').html('<a href="' + "https://instagram.com/" + username + '" target="_blank">Uploaded by: <br />@' + username + '<a/>');
  }

  // gets more video urls along with uploader's info when video url list is less then 2
  function getMoreVideos() {
    getVideoUrls(URL, function(videoUrls, nextUrl, usernameInfo) {
      for(var i = 0; i < videoUrls.length; i++) {
        videos.push(videoUrls[i]);
        usernames.push(usernameInfo[i]);
      }
      URL = nextUrl;
      enqueueVideoAndInfo();
    });
  }

  // plays video, if video urls running low makes a call to 'get more videos'
  function playVideo() {
    if(videos.length < 2) {
      getMoreVideos();
    }
    enqueueVideoAndInfo();
  }

  // ensures a new video to play after one ends
  $('video').on('ended', playVideo);
  playVideo();

  //TO DO
  //Refactor ajax call
  //Design a piece to invite to play music
  //Design play/pause buttons
  //Fix single double quatation situation
  //Add a click handler for pausing the video
  //Create an object that holds all the user and video info
  //Display user instagram name in a better way
});
