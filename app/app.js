$(document).ready(function() {
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
