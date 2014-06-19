var myApp=angular.module("myApp",[]);
myApp.controller("mainCtrl",["$scope",function($scope){

   $scope.list=[1,2,3,4,54]

}]);

myApp.directive("master",function(){

    return{
        restrict:'E',
        scope:{
            cool:'=getList'
        },
        controller:function($scope){
           $scope.container=["cool"]
            this.addStrength=function(){
                $scope.container.push("strength added");
            }
            this.addWeakness=function(){
                $scope.container.push("weakness added ");
            }


        },
        link:function(scope,ele,attr,controller)
        {
            ele.bind('mouseover',function(){
            scope.$apply(scope.cool=scope.container
            )
            console.log("on you ",scope.cool)
            ele.css({color:'red'})

            })
            ele.bind('mouseout',function(){
                scope.cool=[]
                scope.$apply(scope.cool)
            ele.css({color:'green'})

            })
        }



    }
})
//creating sub directory
myApp.directive("sub1",function(){
    return{
        require:'master',
        link:function(scope,element,attr,masterController){
            masterController.addStrength();
            console.log("inside sub1");


        }

    }
})

myApp.directive("sub2",function(){
    return{
        require:'master',
        link:function(scope,element,attr,masterController){
            masterController.addWeakness();
            console.log("inside sub2");


        }

    }
})




