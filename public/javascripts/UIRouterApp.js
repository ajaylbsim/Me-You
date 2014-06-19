/**
 * Created by ajay on 21/5/14.
 */
var myApp = angular.module('myApp', ["ui.router"]);
myApp.controller('mainCtrl', ["$scope", function ($scope) {

    $scope.name = "   ajay kumar mishra ";

}]);


myApp.config(function ($stateProvider, $urlRouterProvider) {

    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/")

    $stateProvider
        .state('route1', {
            url: "/route1",
            templateUrl: "route1.html"
        })

        .state('route1.cool', {
            url: '/showItems1',
            views: {
                "listview": {templateUrl: "route1.list.html",

                    controller: function ($scope) {
                        $scope.list = ["route2Items1", "route2Items2", "route2Items3", "route2Items4"];

                    }


                },
                "itemview": {templateUrl: "route1.showItems.html",
                    controller: function ($scope) {

                        $scope.data = ['helooWorld1-list2', 'helooWorld2-list2', 'helooWorld3-list2', 'helooWorld4-list2']
                    }
                }

            }

        })
        .state("route2", {
            url: "/route2",
            templateUrl: "route2.html",
            controller: function ($scope) {
                $scope.list = ["route2Items1", "route2Items2", "route2Items3", "route2Items4"];

            }
        })

        .state('route2.list2', {
            url: "/list",
            templateUrl: "route2.list.html",
            controller: function ($scope) {
                $scope.list = ["A-list2", "List-list2", "Of-list2", "Items-list2"];
            }

        })
        .state('route2.cool2', {
            url: '/showItems',
            templateUrl: "route1.showItems.html",
            controller: function ($scope) {
                $scope.data = ['helooWorld1-list2', 'helooWorld2-list2', 'helooWorld3-list2', 'helooWorld4-list2'];
            }
        })
        .state('passParam', {

            url: '/user/{id:[0-9a-fA-F]{1}}',
            template: '<div><strong>type /user:1 in  address bar to get the user1 </strong><br>UserID--{{user.id}}  UserName--{{user.name}}</div>',
            controller: function ($scope, $stateParams) {
                $scope.user = {}
                $scope.arr = [
                    {id: 0, name: 'ajay km '},
                    {id: 1, name: 'ajay kumar mishra'},
                    {id: '2', name: 'dheeraj'}
                ]
                console.log($stateParams.id, " is the id of user", !isNaN($stateParams.id))
                if (!(isNaN($stateParams.id)) && ($stateParams.id < $scope.arr.length)) {
                    if ($stateParams.id == null) {
                        $scope.user = $scope.arr[0];


                    }
                    else {
                        $scope.user = $scope.arr[$stateParams.id];


                    }
                }
                else{
                    console.log('else part is executed !!');
                    $scope.user={id:0,name:"id not found !!"}

                }

            }

        })
        .state('understandingResolve',{
            url:'/resolve',
            template:'<div> <strong>id of user - {{id()}}</strong></div>',
            resolve:{



                id:function(){
                  var id;

                    setTimeout(function(){
                        id=1;
                        console.log("set 1 to id by settimeout ")
                    },1000)

                    return id;

                }
                },
             controller:function($scope,$q,id){

                 var deffered= $q.defer();

                  setTimeout(function(){
                      deffered.resolve(id);

                      //$scope.id=id;

                      console.log("resolved data ",id);
                      $scope.$apply(id)


                  },2000)

               return deffered.promise;

             }


        })


})