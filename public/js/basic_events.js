$('#chat-panel').hide()
$('#room-panel').hide()

$('#welcome-tab').click(function(event) {
	$('#welcome-panel').show()
	$('#chat-panel').hide()
	$('#room-panel').hide()
})

$('#room-tab').click(function(event) {
	$('#welcome-panel').hide()
	$('#chat-panel').hide()
	$('#room-panel').show()
})

$('#chat-tab').click(function(event) {
	$('#welcome-panel').hide()
	$('#chat-panel').show()
	$('#room-panel').hide()
})