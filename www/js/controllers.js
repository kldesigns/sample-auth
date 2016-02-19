angular.module('app.controllers', [])

.controller('loginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: '',
    email: ''
  };

  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $state.go('tabsController.home');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})

.controller('homeCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
  $scope.destroySession = function() {
    AuthService.logout();
  };

  $scope.getInfo = function() {
    $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
    });
  };

  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
})
   
.controller('clockOnOffCtrl', function($scope) {

})
   
.controller('travelLogBookCtrl', function($scope) {

})
   
.controller('clockOffCtrl', function($scope) {

})
   
.controller('changePasswordCtrl', function($scope, AuthService, AUTH_EVENTS, API_ENDPOINT, $http, $state, $ionicPopup) {
    $scope.user = {
      password:  '',
      currpassword:  ''
    };
    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
  
    $scope.updatepass = function() {
    AuthService.updatepass($scope.user).then(function(msg) {
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Update failed!',
        template: errMsg
      });
    });
  };
})
   
.controller('reviewAndSubmitCtrl', function($scope) {

})
   
.controller('timesheetCtrl', function($scope) {

})


.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: '',
    email:''
  };

  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})

.controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
  $scope.destroySession = function() {
    AuthService.logout();
  };

  $scope.getInfo = function() {
    $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
    });
  };

  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
})

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
});
