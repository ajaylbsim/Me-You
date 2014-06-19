
var myApp = angular.module('myApp', []);

myApp.controller('mainCtrl', ["$scope","$timeout",function ($scope,$timeout) {


    $scope.arr = [1, 2, 3, 4, 5, 6, 7, 8, 99, 00, 9];

    $scope.names = ["john", "bill", "charlie", "robert", "alban", "oscar", "marie",
        "celine", "brad", "drew", "rebecca", "michel", "francis", "jean", "paul", "pierre", "nicolas", "alfred",
        "gerard", "louis", "albert", "edouard", "benoit", "guillaume", "nicolas", "joseph"];


    $scope.title = 'Lorem Ipsum';
    $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';



    $scope.name = 'Tobias';
    $scope.hideDialog = function () {
        $scope.dialogIsHidden = true;
        $timeout(function () {
            $scope.dialogIsHidden = false;
        }, 2000);
    };
}]);
myApp.controller('ngDirectiveCtrl', ["$scope",function ($scope) {
    $scope.username="guest";
    $scope.userDate=new Date(2003,12,12);

}]);

myApp.controller('ngRepeatCtrl', ['$scope', function ($scope) {
    console.log('ngRepeatCtrl called   ');

    $scope.arr=[{name:'ajay1',age:23},{name:'ajay2',age:24},{name:'ajay3',age:25}]
   $scope.copy=function()
   {
       console.log('angular copy called ');
       angular.copy($scope.arr[1],$scope.arr[0]);

       angular.element('#view').text("hello changed by jquery  alias ")
       angular.element('#view').css("color","red")
       angular.element('#view').animate({left:'200px',color:'blue'})
       angular.element('#view').text('click me to hide')
       angular.element('#view').click(function(){
           $(this).hide();

       });
   }

$scope.result1=angular.equals($scope.arr[0],$scope.arr[1])
$scope.result2=angular.equals($scope.arr,$scope.arr)
$scope.ext=function(){
console.log("extend called  for this ");
    $scope.obj={};
    angular.extend($scope.obj,$scope.arr[0]);
}

$scope.iterate=function(){
console.log("iterate called  for this ");
    $scope.log=[];
    angular.forEach($scope.arr,function(obj){console.log($scope.log.push(obj))});
}
}])




myApp.directive('myDir', function () {

    return{
        restrict: 'AE',
        replace: 'false',
        template: '<h1 > hello to first directive the element shoud not be replaced as replaced is false</h1>'

    }
})

myApp.directive('myLink', function () {

    return{
        restrict: 'AE',
        scope: {

            ratingValue: '=',
            max: '=',
            name: '@'


        },
        template: '<h1 data-ng-repeat="star in stars"> {{star}}hello to first directive</h1>',

        link: function (scope, elem, attrs) {
            scope.stars = [];
            console.log("hello");

            elem.css('color', 'red');
            elem.bind('mouseover', function () {
                console.log(scope.name);
                elem.css('color', scope.name);


            });
            scope.$watch('max', function (oldVal, newVal) {
                if (newVal) {
                    console.log("max value is here >>>>>>>>>>>>  ");
                    elem.css('color', 'yellow');


                }


            })
            elem.bind('mousemove', function () {
                elem.css('color', 'pink');


            });

            for (var i = 0; i < scope.max; i++) {
                console.log("hello");

                scope.stars.push(i);
            }
        }
    }
})


myApp.directive('autoComplete', function ($timeout, $http) {
    return function (scope, iElement, iAttrs) {

        iElement.autocomplete({
            source: function (request, response) {
                console.log(request);

                $http.get('toget', function (result) {
                    console.log('result is', result);


                });
                var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
                response($.grep(scope[iAttrs.uiItems], function (item) {
                    return matcher.test(item);
                }));

            }

        })
    }

});

// diective transclude example
myApp.directive('pane', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: { title: '@'
        },
        template: '<div style="border: 1px solid black;">' +
            '<div style="background-color: gray">{{title}}</div>' +
            '<div ng-transclude></div>' +
            '<div>above this transcluded  content is added</div>'+
            '</div>',
        link:function(scope,ele,attr){
            //scope.title='ajay';
            console.log("----------------------------------------------------------------");
            console.log(scope);
            console.log(scope.title);
            console.log(ele);
            console.log(attr);
            console.log("----------------------------------------------------------------");
              }

    };
});


//directive transclude example

myApp.directive('myDialog', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            'close': '&onClose'
        },
        template: '<div class="alert">'+
          '  <a href class="close" ng-click="close()">×</a>'+
            '<div ng-transclude></div> '+
       ' </div>'
    };
});