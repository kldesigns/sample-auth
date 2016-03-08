angular.module('app', ['ionic', 'app.constants', 'app.controllers', 'app.routes', 'app.services', 'app.directives','angularMoment', 'ui.bootstrap','ui.bootstrap.datetimepicker', 'ngResource', 'ngTable'])

.filter('customUserDateFilter', function($filter) {
    return function(values, dateString) {
     var filtered = [];
  
      if(typeof values != 'undefined' && typeof dateString != 'undefined') {
        angular.forEach(values, function(value) {
            if($filter('date')(value.Date).indexOf(dateString) >= 0) {
              filtered.push(value);
            }
          });
      }
      
      return filtered;
    };
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS, $stateParams) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('login');
      }
    }
  });
});