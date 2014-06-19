/**
 * Created by ajay on 22/5/14.
 */
var myApp=angular.module('myApp',[])
myApp.controller('myCtrl',["$scope","$q",function($scope,$q){
   $scope.user="ajay kumar mishra "
    $scope.cool=function(name){
        console.log("cool called !!")
        function asyncGreet(name) {
            var deferred = $q.defer();

            setTimeout(function() {
                // since this fn executes async in a future turn of the event loop, we need to wrap
                // our code into an $apply call so that the model changes are properly observed.
                $scope.$apply(function() {
                    deferred.notify('About to greet ' + name + '.');

                    if (name=="Robin Hood") {
                        deferred.resolve('Hello, ' + name + '!');
                    } else {
                        deferred.reject('Greeting ' + name + ' is not allowed.');
                    }
                });
            }, 1000);

            return deferred.promise;
        }

        var promise = asyncGreet('Robin Hood');
        promise.then(function(greeting) {
            alert('Success: ' + greeting);
        }, function(reason) {
            alert('Failed: ' + reason);
        }, function(update) {
            alert('Got notification: ' + update);
        });

            }
    $scope.callToMyPromise=function(){
 console.log("hello  function  callToMyPromise is called ");
function pro(name){
    var deffered=$q.defer();
    setTimeout(function(){
        $scope.$apply(function(){

            deffered.notify(" this is a general notification -- cool")
            if(name=="ajay")
            {   $scope.user="successfully updated -- "+$scope.user+"--success"
                deffered.resolve($scope.user)
            }
            else{

                $scope.user="failed to update -- "+$scope.user+"failed"
                deffered.reject("rejected "+$scope.user)


            }});

    },5000)
    return  deffered.promise;
}
    var promise=pro("ajay");
     promise.then(function(user){
         console.log("user found is ",user)
     },function(err){
             console.log("error occured  is ",err)
        },
         function(update){

             console.log("user notification  is ",update)

         }
     );

    }

 }])