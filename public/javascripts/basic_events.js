var nav = $(".navbar");
$(window).scroll(function() {
	if ( $(this).scrollTop() > 150 ) {
		nav.addClass("navbar-scrolled");
	} else {
		nav.removeClass("navbar-scrolled");
	}
});

var togglers = $(".toggler");
for (var i = 0; i < togglers.length; i++) {
    $(togglers[i]).one("click", toggleOff);
}

function toggleOn(event) {
    var toggler = $(event.target);
    toggler.next().slideDown(500);
    toggler.one("click", toggleOff);
}

function toggleOff(event) {
    var toggler = $(event.target);
    toggler.next().slideUp(500);
    toggler.one("click", toggleOn);    
}

//https://teamtreehouse.com/community/forum-tip-create-a-sticky-navigation-with-css-and-jquery-2