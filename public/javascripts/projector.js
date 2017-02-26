var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player("player", {
		height: "480px",
		width: "854px",
		videoId: "76PHzENMQ04",
		events: {
			"onReady": onPlayerReady,
			"onStateChange": onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {	
	player.stopVideo();
}

function onPlayerStateChange(event) {
	var playerState = event.data;
	//0 end, 1 play, 2 pause, 3 buffer
	if (room && (playerState == 1 || playerState == 2 || playerState == 3)) {
		socket.emit("stream-req", {roomKey: sessionState.roomKey, playerState: playerState, playerTime: player.getCurrentTime()});
	} else {}
}

socket.on("stream-res", function(data) {
    console.log("stream-res")
	player.seekTo(data.playerTime, true);
	if (data.playerState == 1) {
		player.playVideo();
	} else if (data.playerState == 2) {
		player.pauseVideo();
	} else {}
});