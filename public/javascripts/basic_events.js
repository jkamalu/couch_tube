$('.right-tab').click(onTabClick)

function onTabClick(event) {
	$('.panel-right').hide()
	$('#' + $(this).attr('id') + '-panel').show()
}