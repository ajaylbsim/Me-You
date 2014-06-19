/**
 * Created by ajay on 20/5/14.
 */2
var myApp = angular.module('myApp', []);

myApp.controller('mainCtrl', ["$scope", "cool", "fetch", function ($scope, cool, fetch) {
        $scope.arr = [1, 2, 3];
        $scope.fill = function (message) {
            console.log('hello jee !!!', message);
            cool(message);
            fetch.getUser();


        }
    }]).factory('cool', function ($window) {


        var Myarr = [];

        return function (message) {

            Myarr.push(message);

            if (Myarr.length == 2) {
                console.log("hello cool  guys!!!");
                Myarr = []

                var str = message + "has been clicked";
                $window.alert(str)
            }

        }
    });


myApp.service('fetch', function ($q) {

    var deffered = $q.defer();
    this.getUser = function () {

        setTimeout(function () {


            this.user = [

                {name: 'A', age: 12},
                {name: 'b', age: 11},
                {name: 'c', age: 13}

            ]
            console.log(deffered.promise)

            deffered.resolve(user);


        }, 2000);

        return deffered.promise;

    }

})




