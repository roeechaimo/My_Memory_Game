app.directive('modal', function() {
    return {
        restrict: 'E',
        scope: {
            show: '=',          
        },
        transclude: true,
        link: function(scope) {
            scope.hideModal = function() {
                scope.show = false;
            };
        },
        templateUrl: '../js/views/modal.html'
    };
});
