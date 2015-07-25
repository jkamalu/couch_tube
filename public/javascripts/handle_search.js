var searchButton = document.getElementById('query-button')
var searchBar = document.getElementById('query-input')
var url;
searchButton.addEventListener('click', function(event) {
	url = searchBar.value
	searchBar.value = ''
	player.loadVideoByUrl({
		'mediaContentUrl': url,
	})
})
