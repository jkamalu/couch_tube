//get iframe
//get the element that is fluid width center-block
//save aspect ratio for the vidya
//remove heiht and width from iframe

//when window resized
//

var $player = $('#player')
var $centerBlock = $('#left-block')
var aspectRatio = $player.height / $player.width

$(window).resize(function() {
	$player.width = $centerBlock.width
	$player.height = $player.width * aspectRatio
}).resize()