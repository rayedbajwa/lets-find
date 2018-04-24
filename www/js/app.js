// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

.config(function($ionicConfigProvider) {
if (!ionic.Platform.isIOS()) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }
})

.run(function($ionicPlatform,$ionicPopup,$cordovaSQLite) {

  $ionicPlatform.ready(function() {
       db = $cordovaSQLite.openDB("my.db");
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS contacts (id integer primary key, name text, number text,type text)");

      if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.confirm({
                        title: "Internet Disconnected",
                        content: "The internet is disconnected on your device."
                    })
                    .then(function(result) {
                        if(!result) {
                            ionic.Platform.exitApp();
                        }
                    }
                        );}}
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',

  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller:'contactsCtrl'
        }
      }
    })
  .state('app.searchbylocation', {
      url: '/searchbylocation',
      views: {
        'menuContent': {
          templateUrl: 'templates/searchbylocation.html',
          controller:'contactsCtrl'
        }
      }
    })
  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller:'settingCtrl'
        }
      }
    })
  .state('app.kontakter', {
      url: '/kontakter',
      views: {
        'menuContent': {
          templateUrl: 'templates/kontakter.html',
          controller:'kontaktCtrl'
        }
      }
    })
  .state('app.rights', {
      url: '/rights',
      views: {
        'menuContent': {
          templateUrl: 'templates/rights.html',
          controller:'rightsCtrl'
        }
      }
    })
  .state('app.services', {
      url: '/service',
      views: {
        'menuContent': {
          templateUrl: 'templates/service.html',
          controller:'contactsCtrl'
        }
      }
    })
  .state('app.display-page', {
      url: '/display-page/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/display-page.html', controller: 'display',

          resolve:{
              getId: function($stateParams,contactInfo){

                return $stateParams.id;
              }

          }
        }
      }
    })
  .state('app.map', {
      url:'/map',
      views: {
          'menuContent': {
              templateUrl: 'templates/map.html',
              controller: 'MapCtrl'

          }
      }
  })
  .state('app.sub-service', {
      url: '/sub-service/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/sub-service.html', controller: 'subserviceCtrl',

          resolve:{
              getServiceId: function($stateParams,subservice){

                return $stateParams.id;
              }

          }
        }
      }
    })

  .state('app.email', {
      url: '/email',
      views: {
        'menuContent': {
          templateUrl: 'templates/email.html'
        }
      }
    })
    .state('app.help', {
        url: '/help',
        views: {
          'menuContent': {
            templateUrl: 'templates/help-list.html',
              controller: 'HelpCtrl'
          }
        }
      })
    .state('app.searchby', {
      url: '/searchby',
      views: {
        'menuContent': {
          templateUrl: 'templates/searchby.html',
          controller: 'SearchByCtrl'
        }
      }
    })

    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    });
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/searchby');

}).config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
.controller('contactsCtrl',function($scope,$ionicLoading,$http,contactService){
     $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });


    var id=contactService.contactId;

  if(!(id)){
id='all';

  }
    $http({
  method: 'POST',
  url: 'http://www.wedevz.com/delfi/api/contacts.php?id='+id
}).then(function successCallback(response) {
     $scope.data=response.data;    $ionicLoading.hide();
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
  $http({
method: 'POST',
url: 'http://www.wedevz.com/delfi/api/getservicebyid/services.php?id='+id
}).then(function successCallback(response) {
   $scope.title=response.data[0].name;    $ionicLoading.hide();
}, function errorCallback(response) {
  // called asynchronously if an error occurs
  $scope.title="All";    $ionicLoading.hide();
  // or server returns response with an error status.
});


} )

.controller('PlaylistsCtrl',function($scope,$ionicLoading,$cordovaSQLite,$http,$location,contactService,$ionicPopup){
       $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });



      $http({
  method: 'POST',
  url: 'http://www.wedevz.com/delfi/api/services.php'
}).then(function successCallback(response) {
     $scope.data=response.data;
          $ionicLoading.hide();
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
$scope.openContacts=function(id){contactService.contactId=id;

                                $location.path('/app/browse');

                                }

    $scope.callEmerg= function(){
         var query = "SELECT * FROM contacts where type='help'";
        $cordovaSQLite.execute(db, query).then(function(res) {
          if(res.rows.length>0){
            var call = "tel:" + res.rows.item(0).number;
    alert('Calling ' + res.rows.item(0).name ); //Alert notification is displayed on mobile, so function is triggered correctly!
    document.location.href = call;
  }

        else {
          $ionicPopup.confirm({
              title: "No Emergency Contact Found.",
              content: "Please add contacts from settings."
          })
          .then(function(result) {
              if(!result) {
                //  ionic.Platform.exitApp();
              }
          }
              );
        }});
    }
})

.controller('SearchByCtrl',function($scope,$ionicLoading,$ionicPopup){
   $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
   $ionicLoading.hide();
})

.controller('SearchByLocation',function($scope,$ionicLoading,$ionicPopup){
   $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
   $ionicLoading.hide();
})


.controller('display',function($scope,$http,$location,getId){
    var id=getId;
   // alert(id);
    if(!id){
        id='none';

    }

      $http({
  method: 'POST',
  url: 'http://www.wedevz.com/delfi/api/getcontactinfo/'+id
}).then(function successCallback(response) {
     $scope.data=response.data[0];

  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });

})
.service('contactService',function(){
    this.contactId;

}).service('contactInfo',function(){
    this.id;

})
.service('subservice',function(){
  this.serviceId;
}).controller('subserviceCtrl',function($scope,$http,$ionicLoading,getServiceId){

  $ionicLoading.show({
 content: 'Loading',
 animation: 'fade-in',
 showBackdrop: true,
 maxWidth: 200,
 showDelay: 0
 });


 var id=getServiceId;

 if(!(id)){
 id='all';
$scope.title="All";
 }
 //http://www.wedevz.com/delfi/api/getsubservicebyid/subservices.php?id=
 $http({
 method: 'POST',
 url: 'http://www.wedevz.com/delfi/api/getcontactsbyid/'+id
 }).then(function successCallback(response) {

  $scope.data=response.data;    $ionicLoading.hide();
  //$scope.title=response.data.name;
 }, function errorCallback(response) {
 // called asynchronously if an error occurs
 // or server returns response with an error status.
 });

 $http({
 method: 'POST',
 url: 'http://www.wedevz.com/delfi/api/getsubservicebyid/subservices.php?id='+id
 }).then(function successCallback(response) {

  $scope.title=response.data[0].service_name;    $ionicLoading.hide();
  //$scope.title=response.data.name;
 }, function errorCallback(response) {
 // called asynchronously if an error occurs
 // or server returns response with an error status.
 });
})


.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
   var options = {timeout: 10000, enableHighAccuracy: true};
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
  }, function(error){
    console.log("Could not get location");
  });
});
;

