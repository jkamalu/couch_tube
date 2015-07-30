/*
 * 'globals' to keep track of
 */
 
var room

 /*
  * DOM elements to use
  */
var searchButton = document.getElementById('query-button')
var searchInput = document.getElementById('query-input')
var joinButton = document.getElementById('room-button')
var joinInput = document.getElementById('room-input')
var statusLabel = document.getElementById('label-status')

/*
 * This code loads the IFrame Player API code asynchronously
 */
var tag = document.createElement('script')
tag.src = "https://www.youtube.com/iframe_api"
var firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

/*
 * This code opens the socket namespace connection to the default namespace
 */
var socket = io.connect()

/*
 * SOCKET EVENT: PLAYER RELOADED
 * prereq should be a leader 
 */
socket.on('reload player with videoId', function(videoId) {
	player.loadVideoById({
		'videoId': videoId,
	})
})

/*
 * SOCKET EVENT: ROOM JOINED
 */
socket.on('room joined with roomName and userRole', function(data) {
	room = data
	statusLabel.className = 'label label-success'
	//statusLabel.innerHTML = 'CONNECTED to ' + data.room_name.toUpperCase() + ' as ' + data.user_role.toUpperCase()
})

/*
 * SOCKET EVENT: USER ROLE RECEIVED
 */

/*
 * JOINING A ROOM
 */
joinButton.addEventListener('click', function(event) {
	roomName = joinInput.value
	joinInput.value = ''
	console.log('joine room from client')
	socket.emit('join room with roomName', roomName)
})

/*
 * RELOADING THE PLAYER
 */
searchButton.addEventListener('click', function(event) {
	videoId = searchInput.value
	searchInput.value = ''
	socket.emit('reload player with videoId', videoId)
})

var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '505px',
		width: '855px',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	})
}

function onPlayerReady(event) {
	
}

var done = false
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {

	}
}

function stopVideo() {
	player.stopVideo()
}
