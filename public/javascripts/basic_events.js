var nav = $(".navbar");
var header = $("section.header");

$(window).scroll(function() {
	if ( $(this).scrollTop() > 150 ) {
		nav.addClass("navbar-scrolled");
		header.addClass("header-hidden");
	} else {
		nav.removeClass("navbar-scrolled");
		header.removeClass("header-hidden");
	}
});