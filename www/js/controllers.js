angular.module('starter.controllers', [])

.controller('settingCtrl',function($scope,$http,$cordovaContacts,ContactsService,ContactsStore,$cordovaSQLite,$ionicLoading,$ionicPopup){
    $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
});
$scope.buttontitle="Add Contact";
$scope.Otherbuttontitle="Add Contact";
$scope.delete_contact= function(id){
  var query = "delete FROM contacts where id="+id;
  $cordovaSQLite.execute(db, query).then(function(res) {
  console.log(res.rows.length);
  refresh();
  });
};

console.log( ContactsStore.all);
  $scope.data={
      help: [],
      others:[]
  };
refresh();

function refresh(){
var query = "SELECT * FROM contacts";
$scope.data.others=new Array();$scope.data.help=new Array();
$cordovaSQLite.execute(db, query).then(function(res) {
  if(res.rows.length > 0) {
    var i=0;
    while(i<res.rows.length){
      if(res.rows.item(i).type=='help'){
        $scope.data.help.push(res.rows.item(i));
      }
      else{

        $scope.data.others.push(res.rows.item(i));
      }
      i++;
    }
  }else {

  }
  $ionicLoading.hide();
  });
}

$scope.addContact = function() {  
  ContactsService.pickContact().then(
    function(contact) {
      $scope.help=(contact);
      var query = "INSERT INTO contacts (name, number,type) VALUES (?,?,?)";
      var contact=[contact.displayName, contact.phones[0].value,'help'];
      $cordovaSQLite.execute(db, query, contact).then(function(res) {
        console.log("INSERT ID -> " + res.insertId);
        refresh();
      }, function (err) {
        console.error(err);
      });
    },
    function(failure) {
      console.log("Bummer.  Failed to pick a contact");
    }
  );
}

$scope.addOtherContacts = function(){
  ContactsService.pickContact().then(
    function(contact) {
      $scope.help=(contact);

      $scope.buttontitle="Change Contact";
      var query = "INSERT INTO contacts (name, number,type) VALUES (?,?,?)";
      var contact=[contact.displayName, contact.phones[0].value,'other'];
      $cordovaSQLite.execute(db, query, contact).then(function(res) {
        console.log("INSERT ID -> " + res.insertId);
        refresh();
      }, function (err) {
        console.error(err);
      });

    },
    function(failure) {
      console.log("Bummer.  Failed to pick a contact");
    }
  );
}
})

 .service("ContactsService", ['$q', function($q) {

        var formatContact = function(contact) {

            return {
                "displayName"   : contact.name.formatted || contact.name.givenName + " " + contact.name.familyName || "Anonymous",
                "emails"        : contact.emails || [],
                "phones"        : contact.phoneNumbers || [],
                "photos"        : contact.photos || []
            };

        };

        var pickContact = function() {

            var deferred = $q.defer();

            if(navigator && navigator.contacts) {

                navigator.contacts.pickContact(function(contact){

                    deferred.resolve( formatContact(contact) );
                });

            } else {
                deferred.reject("Bummer.  No contacts in desktop browser");
            }

            return deferred.promise;
        };

        return {
            pickContact : pickContact
        };
    }]).factory('ContactsStore',function(){
    return{
        all: function() {
      var contactString = window.localStorage['contacts'];
      if(contactString) {
        return angular.fromJson(contactString);
      }
      return [];
        },
        save: function(contacts) {
      window.localStorage['contacts'] = angular.toJson(contacts);
    },
     newContact: function(contact,type) {
      // Add a new contact
      return {

        name: contact.displayName,
        number: contact.phones[0].value,
          contact_type: type
      };
    }
    }

}).controller('kontaktCtrl',function($scope,$cordovaSQLite,$ionicLoading,$ionicPopup){
     $scope.data={

          others:[]

      };
    $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
     var query = "SELECT * FROM contacts where type = 'other'";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {
              var i=0;
                while(i<res.rows.length){
console.log(res.rows.item(i));
                $scope.data.others.push(res.rows.item(i));


              i++;
                }



        }  else {
          $ionicPopup.confirm({
              title: "No Contacts Found.",
              content: "Please add contacts from settings."
          })
          .then(function(result) {
              if(!result) {

              }

          }
              );
                console.log("No results found");
            }  $ionicLoading.hide();
            });

}).controller('rightsCtrl',function($scope,$http){
          $http({
  method: 'POST',
  url: 'http://www.wedevz.com/delfi/api/getmyrightsbyid/rights.php'
}).then(function successCallback(response) {
     $scope.data=response.data;

  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });

})
.controller('HelpCtrl',function($scope,$http,$ionicLoading, $ionicPopup,$cordovaSQLite){
  $scope.data={

       others:[]

   };
  $ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in',
  showBackdrop: true,
  maxWidth: 200,
  showDelay: 0
  });
  var query = "SELECT * FROM contacts where type='help'";
     $cordovaSQLite.execute(db, query).then(function(res) {
         if(res.rows.length > 0) {
           var i=0;
             while(i<res.rows.length){


                   $scope.data.others.push(res.rows.item(i));

           i++;
             }



     }  else {
       $ionicPopup.confirm({
           title: "No Contacts Found.",
           content: "Please add contacts from settings."
       })
       .then(function(result) {
           if(!result) {

           }

       }
           );
             console.log("No results found");
         }  $ionicLoading.hide();
         });

});

