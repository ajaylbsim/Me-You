'use strict';

/* Controllers */

var photoAlbumControllers = angular.module('photoAlbumControllers', []);

photoAlbumControllers.controller('photoUploadCtrl', ['$scope', '$rootScope', '$routeParams', '$location',"$http",
  function($scope, $rootScope, $routeParams, $location,$http) {
    
    $scope.updateTitle = function(){
      var uploadParams = $scope.widget.fileupload('option', 'formData');
      uploadParams["context"] = "photo=" + $scope.title;
      $scope.widget.fileupload('option', 'formData', uploadParams);
    };
    
    $scope.widget = $(".cloudinary_fileupload")
      .unsigned_cloudinary_upload($.cloudinary.config().upload_preset, {tags: 'myphotoalbum',context:'photo='}, {
        // Uncomment the following lines to enable client side image resizing and valiation.
        // Make sure cloudinary/processing is included the js file
        //disableImageResize: false,
        //imageMaxWidth: 800,
        //imageMaxHeight: 600,
        //acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i,
        //maxFileSize: 20000000, // 20MB
        dropZone: "#direct_upload",
        start: function (e) {
          $scope.status = "Starting upload...";
          $scope.$apply();
        },
        fail: function (e, data) {
          $scope.status = "Upload failed";
          $scope.$apply();
        }
      })
      .on("cloudinaryprogressall", function (e, data) {
        $scope.progress = Math.round((data.loaded * 100.0) / data.total);
            console.log('---------------------------------c--------',data.total)

            $scope.status = "Uploading... " + $scope.progress + "%";
        $scope.$apply();
      })
      .on("cloudinarydone", function (e, data) {
            $('.preview').html(
                $.cloudinary.image(data.result.public_id,
                    { format: data.result.format, version: data.result.version,
                        crop: 'fill', width: 150, height: 100 })
            );
            $('.image_public_id').val(data.result.public_id);
            //return true;
        $rootScope.photos = $rootScope.photos || [];

            var imgURL= 'http://res.cloudinary.com/mewithyou/image/upload/fl_progressive,f_auto,w_188,h_188,g_faces,c_fill,e_improve,r_max/' +data.result.public_id+".png"
            $rootScope.photos.push(imgURL);
            data.result.context = {custom: {photo: $scope.title}};
        $scope.result = data.result;
            if(!e.target.multiple)
            {
                console.log('----------------------------received from cloudniry;-------------',data.result.public_id)
                var imgURL= 'http://res.cloudinary.com/mewithyou/image/upload/fl_progressive,f_auto,w_188,h_188,g_faces,c_fill,e_improve,r_max/' +data.result.public_id+".png"
                $rootScope.user.profilePic=imgURL;
                $http.post('saveMyProfileImgId',{ImgId:data.result.public_id})
                    .success(function(result){
                     console.log('successfullly saved !!!!!!!!!!!',result)

                })
                $rootScope.photos=[]
                $location.path('profile');

            }
            $scope.result = data.result;
            $scope.changeImg=function(url){
            console.log('change url callled !!!');
                var arr=url.split('/');
                var str=arr[arr.length-1];
                str=str.slice(0,str.indexOf('.'));
                if(arr.length)
                {
                    console.log('----------------------------received from cloudniry;-------------',str,arr.length,arr)
                    $rootScope.user.profilePic ='http://res.cloudinary.com/mewithyou/image/upload/fl_progressive,f_auto,w_188,h_188,g_faces,c_fill,e_improve,r_max/' +str+".png";
                    $http.post('saveMyProfileImgId',{ImgId:str})
                        .success(function(result){
                            console.log('successfullly saved !!!!!!!!!!!',result)
                            $location.path('profile');

                        })
                    $rootScope.photos=[]
                    $location.path('profile');

                }        }
            $scope.$apply();
      });
  }]);