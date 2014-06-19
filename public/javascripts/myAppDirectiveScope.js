/**
 * Created by ajay on 21/5/14.
 */

var myApp = angular.module('myApp', [])
myApp.controller('mainCtrl', ["$scope", function ($scope) {

    $scope.name = "    enjoy it !!";

}])

myApp.directive('parentScope', function () {
    return {
        restrict: 'A',
        link: function (scope) {
            scope.name = 'ajay kumar'
        }
    }
})


