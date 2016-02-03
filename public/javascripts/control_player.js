/*
 * 'globals' to keep track of
 */
var room;
var status = 'Slave';

 /*
  * DOM elements to use
  */
var searchButton = document.getElementById('video-button');
var searchInput = document.getElementById('video-input');
var joinButton = document.getElementById('room-button');
var joinInput = document.getElementById('room-input');
var roomLabel = document.getElementById('room-label');
var statusLabel = document.getElementById('status-label');

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
		height: '480px',
		width: '854px',
		videoId: '_hyE2NO7HnU',
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

/**
 * EVENT:     The join room button is clicked
 *
 * ACTIVITY:  Communicate event to server
 *
 * OUTPUT:    roomNameClient
 *
 * TODO:      
 */
joinButton.addEventListener('click', function(event) {
	socket.emit('JOIN', {roomNameClient: joinInput.value});
	joinInput.value = '';
});

/**
 * INPUT:     userStatusServer, room JSON (in the DB form room_element)
 *
 * ACTIVITY:  Assign room variable, load and stop video, update user status, misc.
 *
 * TODO:      Synch times and state for slaves on join
 */
socket.on('JOIN', function(data) {
	room = data;
	status = data.userStatusServer;
	if (data.room_video) {
		player.loadVideoById({
			'videoId': data.room_video,
		});	
		player.stopVideo();
	}
	roomLabel.innerHTML = data.room_name;
	statusLabel.innerHTML = status;
});

/**
 * EVENT:     The load video button is clicked
 *
 * ACTIVITY:  Communicate event to server
 *
 * OUTPUT:    roomNameClient
 *
 * TODO:      
 */
searchButton.addEventListener('click', function(event) {
	if (status === 'Leader') {
		socket.emit('RELOAD', {roomNameClient: room.room_name, videoKeyClient: searchInput.value});
	}
	searchInput.value = '';
});
  
/**
 * INPUT:     videoKeyServer
 *
 * ACTIVITY:  Load and pause video from server
 *
 * TODO:      
 */
socket.on('RELOAD', function(data) {
	player.loadVideoById({
		'videoId': data.roomVideoServer,
	});
	player.stopVideo();
});

/**
 * EVENT:     The load video button is clicked
 *
 * ACTIVITY:  Communicate event to server
 *
 * OUTPUT:    roomNameClient, playerStateClient, currentTimeClient
 *
 * TODO: 	  Buffering and else   
 */
function onPlayerStateChange(event) {
	var playerState = event.data;
	//0 end, 1 play, 2 pause, 3 buffer
	if (room && (playerState == 1 || playerState == 2 || playerState == 3)) {
		socket.emit('PLAYERSTATE', {roomNameClient: room.room_name, playerStateClient: playerState, currentTimeClient: player.getCurrentTime()});
	} else {}
}

/**
 * INPUT:     playerStateServer, currentTimeServer
 *
 * ACTIVITY:  Load and pause video from server
 *
 * TODO:      
 */
socket.on('PLAYERSTATE', function(data) {
	player.seekTo(data.currentTimeServer, true);
	if (data.playerStateServer == 1) {
		player.playVideo();
	} else if (data.playerStateServer == 2) {
		player.pauseVideo();
	} else {}
});