var nav = $(".navbar");
var header = $(".header");
var navlist = $("#navbar-main");


$(window).scroll(function() {
	if ( $(this).scrollTop() > 150 ) {
		nav.addClass("navbar-scrolled");
		header.addClass("header-hidden");
		navlist.addClass("navbar-list-scrolled");
	} else {
		nav.removeClass("navbar-scrolled");
		header.removeClass("header-hidden");
		navlist.removeClass("navbar-list-scrolled");
	}
});

//https://teamtreehouse.com/community/forum-tip-create-a-sticky-navigation-with-css-and-jquery-2