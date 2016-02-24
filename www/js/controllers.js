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

.controller('homeCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
  
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
   
.controller('clockOnOffCtrl', function($scope, AUTH_EVENTS, AuthService, $state, $ionicPopup, $http, API_ENDPOINT, $log) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
  $http.get(API_ENDPOINT.url + '/bundyinfo').then(function(result) {
      $scope.bundyState = result.data.bundyState;
      $scope.bundyJob = result.data.bundyJob;
      $scope.jobList = result.data.jobList;
    $log.info($scope.jobList);  
    });
    
    
    
})
   
.controller('travelLogBookCtrl', function($scope, AUTH_EVENTS, AuthService, $state, $ionicPopup) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
})
   
.controller('clockOffCtrl', function($scope, AUTH_EVENTS, AuthService, $state, $ionicPopup) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
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
      var alertPopup = $ionicPopup.alert({
        title: 'Update Successfull!',
        template: msg
      });
      
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Update failed!',
        template: errMsg
      });
    });
  };
})
   
.controller('reviewAndSubmitCtrl', function($scope, AUTH_EVENTS, AuthService, $state, $ionicPopup) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
})
   
.controller('timesheetCtrl', function($scope, AUTH_EVENTS, AuthService, $state,$ionicPopup) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
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

.controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state, AUTH_EVENTS) {
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
