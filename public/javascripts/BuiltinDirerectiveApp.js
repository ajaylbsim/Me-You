var myApp=angular.module('myApp',[]);

myApp.controller('mainCtrl',["$scope",function($scope){

   $scope.select="cool"
   $scope.list=['cool','myway','yourway']

}])