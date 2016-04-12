$(document).ready(function() {

  // url for a SoundCloud playlist ajax call
  var SC_clientID1 = "a453e1bd2658";
  var SC_clientID2 = "fff4e0b83f";
  var SC_clientID3 = "f2ab3829bc";
  var SC_URL = "http://api.soundcloud.com/playlists/151936626?client_id=" + SC_clientID1 + SC_clientID2 + SC_clientID3;

  // makes an ajax call and provides an array of song urls
  function getPlayList(url, callback) {
    $.ajax({
      type: "GET",
      dataType: "json",
      cache: false,
      url: url,
      success: function(data) {
        var songList = [];
        var titleList = [];
        var song;
        for(var i = 0; i < data.tracks.length; i++) {
          song = data.tracks[i].stream_url + "?client_id=" + SC_clientID1 + SC_clientID2 + SC_clientID3;
          songList.push(song);
          titleList.push(data.tracks[i].title);
        }
        callback(songList, titleList);
      },
      error: function() {
        console.log(arguments);
      }
    });
  }

  var arrayOfSongs = [];
  var arrayOfSongTitles = [];
  var song;
  var title;

  // get the playlist as an array of urls and get the next song ready
  getPlayList(SC_URL, function(songList, titleList) {
    for(var i = 0; i < songList.length; i++) {
      arrayOfSongs.push(songList[i]);
      arrayOfSongTitles.push(titleList[i]);
    }
    enqueueNextSong();
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
  function enqueueNextSong() {
    getSongNumber();
    song = arrayOfSongs[songNumber];
    title = arrayOfSongTitles[songNumber];
    $('#songTitle').html(title);
    $('#song').attr('controls', false).attr('src', song).attr('preload', 'auto');
  }

  // plays the song
  function playSong() {
    enqueueNextSong();
    $('#song').get(0).play();
  }

  // add an eventhandler for when the song is over
  $('#song').on('ended', playSong);

  // hide the pause button makin the play button show up on load
  $('.pause').hide();

  // add an eventhandler to the play/pause button
  $('#playPauseButton').on('click', function() {
      if($('#song').get(0).paused) {
          $('#song').get(0).play();
          $(this).removeClass('.pause');
          $('.play').hide();
          $('.pause').show();
      } else {
          $('#song').get(0).pause();
          $(this).removeClass('.play');
          $('.pause').hide();
          $('.play').show();
      }
  });

  // add a click eventhandler to play the next song
  $('#nextSongButton').on('click', playSong);

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
    $('video').attr('src', video).attr('controls', false).prop('muted', true).get(0).play();
    $('#username').html('<a href="' + "https://instagram.com/" + username + '" target="_blank"> @' + username + '<a/>');
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

  // ensure a new video to play after one ends
  $('video').on('ended', playVideo);

  // give video the ability to play and pause
  $('video').on('click', function() {
    $(this).each(function() {
      $(this).get(0).paused ? $(this).get(0).play() : $(this).get(0).pause();
    });
  });

  playVideo();

  // TODO
  // refactor
  // rewrite ajax calls - merge into one
  // create an object that holds all the user and video info
  // check if the songs are streamable before putting them in list
  // put song and title list into one array as an object
});
