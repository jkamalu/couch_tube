var sessionState = {
    roomKey: null,
    userStatus: null
}

tooMuchDog.directive("joinRequest", function() {
    var link = function(scope, element, attrs) {
        var roomButton = element.find("#room-button");
        var roomInput = element.find("#room-input");
        roomButton.on("click", function(event) {
        	if (roomInput[0].value) {
	            socket.emit("join-req", {roomKey: roomInput[0].value});
	        	roomInput[0].value = "";
        	}
        });
    };
    return {
        link: link
    }
});

tooMuchDog.directive("videoRequest", function() {
    var link = function(scope, element, attrs) {
        var videoButton = element.find("#video-button");
        var videoInput = element.find("#video-input");
        videoButton.on("click", function(event) {
            if (sessionState.userStatus && videoInput[0].value) {
                socket.emit("video-req", {roomKey: sessionState.roomKey, videoKey: videoInput[0].value});
                videoInput[0].value = "";
            }
        });
    };
    return {
        link: link
    }
});

socket.on("join-res", function(data) {
    console.log(data)
    if (data.videoKey) {
        player.loadVideoById({
            "videoId": data.videoKey
        }); 
        player.stopVideo();
    }
    sessionState = data
    $("#room-label")[0].innerHTML = sessionState.roomKey;
    $("#status-label")[0].innerHTML = sessionState.userStatus;
});
  
socket.on("video-res", function(data) {
    console.log(data)
    player.loadVideoById({
        "videoId": data.videoKey
    });
    //player.stopVideo();
});