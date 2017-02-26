var tooMuchDog = angular.module("tooMuchDog", ["ngAnimate", "ngMaterial"]);

tooMuchDog.controller("navbarController", function($scope, $mdDialog, $rootScope) {
    $scope.showSettings = function(event) {
        $mdDialog.show({
            parent: angular.element(document.body),
            controller: modalController,
            targetEvent: event,
            hasBackdrop: false,
            templateUrl: "templates/settings-dialog.tmpl.html",
            clickOutsideToClose: true,
        });
    };
});

var modalController = function($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
};

tooMuchDog.directive("navbarStick", function() {
    var link = function(scope, element, attrs) {
        var stuck = { "position": "fixed", "top": "0" };
        var unstuck = { "position": "", "top": "" };
        var windowScroll = function() {
            if ($(this).scrollTop() > 150) {
                element.css(stuck);
            } else if ($("body").css("position").toLowerCase() != "fixed") {
                element.css(unstuck);
            }            
        }
        $(window).scroll(windowScroll);
    };
    return {
        link: link
    };
});

tooMuchDog.directive("sectionToggle", function() {
    var link = function(scope, element, attrs) {
        var sectionBar = element.find(".section-bar");
        sectionBar.on("click", function(event) {
            var state = $(this).data("state");
            state = !state;
            if (!state) {
                sectionBar.next().slideDown(500);
            } else {
                sectionBar.next().slideUp(500);
            }
            $(this).data("state", state);
            event.preventDefault();
        });
    };
    return {
        link: link
    }
});