/*
 * 'globals' to keep track of
 */
var room;
var status = 'slave';

 /*
  * DOM elements to use
  */
var searchButton = document.getElementById('query-button');
var searchInput = document.getElementById('query-input');
var joinButton = document.getElementById('room-button');
var joinInput = document.getElementById('room-input');
var statusLabel = document.getElementById('label-status');
var searchContainer = document.getElementById('video-select-container');

/*
 * This code loads the IFrame Player API code asynchronously
 */
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '505px',
		width: '855px',
		videoId: 'sng_CdAAw8M',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {	
	player.stopVideo();
}

/*
 * This code opens the socket namespace connection to the default namespace
 */
var socket = io.connect();

/*
 * ROOM JOIN - CLIENT
 */
joinButton.addEventListener('click', function(event) {
	roomName = joinInput.value;
	joinInput.value = '';
	socket.emit('JOIN FROM CLIENT', {roomName: roomName});
});

/*
 * ROOM JOIN - SERVER
 * INPUT DATA: the entire room JSON plus the user role
 * TODO: synch with times and state
 */
socket.on('JOIN FROM SERVER', function(data) {
	room = data;
	statusLabel.className = 'label label-success';
	statusLabel.innerHTML = 'CONNECTED to ' + room.room_name.toUpperCase() + ' as ' + room.join_as.toUpperCase();
	status = room.join_as;
	if (room.room_video) {
		player.loadVideoById({
			'videoId': data.room_video,
		});	
		player.stopVideo();
	}
});

/* 
 * RELOAD PLAYER - CLIENT
 */
searchButton.addEventListener('click', function(event) {
	videoId = searchInput.value;
	searchInput.value = '';
	if (!room) {
		player.loadVideoById({
			'videoId': data.room_video,
		});	
	} else if (status === 'leader') {
		socket.emit('RELOAD FROM CLIENT', {roomName: room.room_name, videoId: videoId});
	}
});
  
/*
 * RELOAD PLAYER - SERVER
 * INPUT DATA: video id
 * TODO:
 */
socket.on('RELOAD FROM SERVER', function(data) {
	player.loadVideoById({
		'videoId': data.room_video,
	});
	player.stopVideo();
});

/*
 * PLAYER STATE CHANGE - CLIENT 
 * TODO: improve case when buffering -- pay attentiont to the else
 */
function onPlayerStateChange(event) {
	var playerState = event.data;
	//0 end, 1 play, 2 pause, 3 buffer
	if (playerState == 1 || playerState == 2 || playerState == 3) {
		socket.emit('PLAYER STATE CHANGE FROM CLIENT', {roomName: room.room_name, playerState: playerState, currentTime: player.getCurrentTime()});
	} else {}
}

/*
 * PLAYER STATE CHANGE - SERVER
 * INPUT DATA: state
 * TODO:
 */
socket.on('PLAYER STATE CHANGE FROM SERVER', function(data) {
	player.seekTo(data.current_time, true)
	if (data.player_state == 1) {
		player.playVideo();
	} else if (data.player_state == 2) {
		player.pauseVideo();
	} else {}
});