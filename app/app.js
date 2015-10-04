// SC.initialize({
//   client_id: "a453e1bd2658fff4e0b83ff2ab3829bc"
// });
//
// SC.stream("/tracks/293", function(sound) {
//   sound.play();
//   sound.pause();
// });
//
// (function(){
//   var widgetIframe = document.getElementById('sc-widget'),
//       widget = SC.Widget(widgetIframe);
//
//   widget.bind(SC.Widget.Events.READY, function() {
//     widget.bind(SC.Widget.Events.PLAY, function() {
//       // get information about currently playing sound
//       widget.getCurrentSound(function(currentSound) {
//         // console.log('sound ' + currentSound.get('') + 'began to play');
//       });
//     });
//     // get current level of volume
//     widget.getVolume(function(volume) {
//       console.log('current volume value is ' + volume);
//     });
//     // set new volume level
//     widget.setVolume(50);
//     // get the value of the current position
//   });
// }());

$(document).ready(function() {
  var SC_clientID1 = "a453e1bd2658";
  var SC_clientID2 = "fff4e0b83f";
  var SC_clientID3 = "f2ab3829bc";
  var SC_URL = "http://api.soundcloud.com/playlists/104226047?client_id=a453e1bd2658fff4e0b83ff2ab3829bc";

  function getPlayList(url, callback) {
    $.ajax({
      type: "GET",
      dataType: "json",
      cache: false,
      url: url,
      success: function(data) {
        console.log(data);
        console.log(data.track_count);
        var songList = [];
        var song;
        for(var i = 0; i < data.track_count; i++) {
          song = data.tracks[i].stream_url + "?client_id=" + SC_clientID1 + SC_clientID2 + SC_clientID3;
          songList.push(song);
        }
        console.log(song);
        console.log(songList);
        callback(songList);
      },
      error: function() {
        console.log(arguments);
      }
    });
  }

  var arrayOfSongs = [];
  var song;

  getPlayList(SC_URL, function(songList) {
    for(var i = 0; i < songList.length; i++) {
      arrayOfSongs.push(songList[i])
    }
    getNextSong();
    console.log('got play list');
  });

  function getNextSong() {
    song = arrayOfSongs.shift();
    $('#song').attr("src", song).attr("preload", "auto").get(0).play();
  }

  $('#song').on('ended', getNextSong);


  // var songPlaying;
  // function getNextSong() {
  //   // if(arrayOfSongs.length < 2) {
  //     getPlayList(SC_URL, function(songList) {
  //       for(var i = 0; i < songList.length; i++) {
  //         arrayOfSongs.push(songList[i])
  //       }
  //       songPlaying = arrayOfSongs.shift();
  //       $('#song').attr("src", songPlaying).attr("preload", "auto");
  //     });
  //   // }
  //
  //   // $('#song')[0].play();
  //   // .get(0).play()
  // }
  //
  // function playSong() {
  //   console.log(arrayOfSongs);
  //   if(arrayOfSongs.length < 2) {
  //     getNextSong();
  //     console.log(arrayOfSongs);
  //   }
  //   console.log(arrayOfSongs);
  //   songPlaying = arrayOfSongs.shift();
  //   $('#song').attr("src", songPlaying).attr("preload", "auto");
  // }
  //
  // playSong();
  // getNextSong();

  // makes an ajax call to get video urls and provides the url list as an array
  function getVideoUrls(url, callback) {
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: url,
      success: function(data) {
        var videoUrls = [];
        for(var i = 0; i < data.data.length; i++) {
          if(data.data[i].videos) {
            videoUrls.push(data.data[i].videos.standard_resolution.url);
          }
        }
        callback(videoUrls, data.pagination.next_url);
      }
    });
  }

  var KEY1 = "1b04a24609";
  var KEY2 = "a04cecbef8";
  var KEY3 = "dc4aac619e96";
  var URL = "https://api.instagram.com/v1/tags/hyperlapse/media/recent?client_id=" + KEY1 + KEY2 + KEY3;
  var videos = [];
  var video;

  // gets more video urls when video url list is less then 2
  function getMoreVideos() {
    getVideoUrls(URL, function(videoUrls, nextUrl) {
      for(var i = 0; i < videoUrls.length; i++) {
        videos.push(videoUrls[i]);
      }
      URL = nextUrl;
      video = videos.shift();
      $('video').attr("src", video).attr("controls", true).prop("muted", true).get(0).play();
    });
  }

  // plays video, if video urls running low makes a call to 'get more videos'
  function playVideo() {
    if(videos.length < 2) {
      getMoreVideos();
    }
    video = videos.shift();
    $('video').attr("src", video).attr("controls", true).prop("muted", true).get(0).play();
  }

  // ensures a new video to play after one ends
  $('video').on('ended', playVideo);
  playVideo();

});
