var myApp = angular.module('myApp', []);
myApp.controller('mainCtrl', ['$scope', function ($scope) {
    console.log('maincontroller called   ');
    $scope.names = ["ajay1", "ajay2", "ajay3"];
    $scope.empName = 'eployee1'
    $scope.myobject = {name: 'AJAY KUMAR ', age: '24'}
    $scope.display = function () {
        $scope.myobject.age += 1;
    }
}])
/*
 1.this  direcive behaves both as attribute and class
 2. this is using the scope of parent
 3.

 */

myApp.directive('myDir', function () {

    return {
        restrict: 'AE',
        template: '<div style="background-color: red"> <p  data-ng-repeat="name in names"> cool!!</p> </div>',
        link: function (scope, ele, attr) {

            console.log("element is   ", ele)

        }
    }
});
/*
 1.this  direcive behaves both as attribute and class
 2. this is using its own new scope
 3.

 */
myApp.directive('myDir2', function () {
    return {
        restrict: 'AE',
        scope: {},
        template: '<div style="background-color: red"> <p  data-ng-repeat="name in names"> {{name}}</p> </div>',
        link: function (scope, ele, attr) {
            scope.names = ["ajay4", "ajay5", "ajay6"];
            console.log("element is   ", scope);
        }
    }
});
/*
 1.this  direcive behaves both as attribute and class
 2. this is using its own new scope
 3. this is also binding with parent scope

 */
myApp.directive('myDir3', function () {
    return {
        restrict: 'AE',
        scope: {
            empName: '@myName'
        },
        template: '<div style="background-color: red"> <p  data-ng-repeat="name in names">{{empName}} {{name}}</p> </div>',
        link: function (scope, ele, attr) {
            scope.names = ["ajay4", "ajay5", "ajay6"];
            console.log("attr  is   ", attr);
        }
    }
});

/*
 1.this  direcive behaves both as attribute and class
 2. this is using its own new scope
 3. this is also binding with parent scope
 4. this is one way binding using &
 */
myApp.directive('myDir4', function () {
    return {
        restrict: 'AE',
        scope: {
            empName: '@myName',
            myval: '&myObj'
        },
        template: '<div style="background-color: red"> <p  data-ng-repeat="name in names">{{myval}} {{name}}</p> </div>',
        link: function (scope, ele, attr) {
            console.log("attr  is   ", scope.myval());
            var obj = scope.myval();
            console.log("name is ", obj.name, obj.age);

            scope.names = [obj.name, obj.age];
            scope.names[0] = obj.name;

        }
    }
});
/*
 1.this  direcive behaves both as attribute and class
 2. this is using its own new scope
 3. this is also binding with parent scope
 4. this is two  way binding using =
 */
myApp.directive('myDir5', function () {
    return {
        restrict: 'AE',
        scope: {
            empName: '@myName',
            myval: '&myObj',
            mydata: '=myData'

        },
        template: '<div style="background-color: red"> <p >{{mydata.name}} {{mydata.age}}</p> </div>',
        link: function (scope, ele, attr) {

            console.log('cheking using == ', scope.mydata);
            console.log('cheking using == ', scope.mydata.name);
            console.log('cheking using == ', scope.mydata.age);
            scope.mydata.age = 25;
        }
    }
});


/*
 1.this  direcive behaves both as attribute and class
 2. this is using its own new scope
 3.this is using a function defined in pparent scope
 */
myApp.directive('myDir6', function () {
    return {
        restrict: 'AE',
        scope: {
            empName: '@myName',
            mydata: '=myData',
            click: '&onClick'

        },
        template: '<div style="background-color: red" > <p >{{mydata.name}} {{mydata.age}}<button data-ng-click="click()">clickMe to change Age</button></p> </div>',
        link: function (scope, ele, attr) {

            console.log('cheking using == ', scope.mydata);
            console.log('cheking using == ', scope.mydata.name);
            console.log('cheking using == ', scope.mydata.age);
            scope.mydata.age = 25;
        }
    }
});

/*
 1.this  is an example of transclude true
 */

myApp.directive('myDir7',function(){

    return{
        restrict:'AE',
        transclude:true,
        template:'<div style="background-color: green"> <p> some transcluded part will be  added below</p> <div data-ng-transclude></div>   </div>'
    }
});

/*
 1.this  is an example of transclude element
 */

myApp.directive('myDir8',function(){

    return{
        restrict:'AE',
        transclude:'element',
        template:'<div style="background-color: green"> <p> some transcluded part will be  added below</p> <div data-ng-transclude></div>   </div>'
    }
});

