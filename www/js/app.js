angular.module('starter', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
  })
  .state('outside.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('outside.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })

  .state('tabsController', {
      url: '/tabs',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })

    .state('tabsController.home', {
      url: '/home',
      views: {
        'tab4': {
          templateUrl: 'templates/home.html',
          controller: 'homeCtrl'
        }
      }
    })

    .state('tabsController.clockOnOff', {
      url: '/bundy',
      views: {
        'tab1': {
          templateUrl: 'templates/clockOnOff.html',
          controller: 'clockOn/OffCtrl'
        }
      }
    })

    .state('tabsController.clockOff', {
      url: '/clocked_on',
      views: {
        'tab1': {
          templateUrl: 'templates/clockOff.html',
          controller: 'clockOffCtrl'
        }
      }
    })

    .state('tabsController.changePassword', {
      url: '/ch_pword',
      views: {
        'tab2': {
          templateUrl: 'templates/changePassword.html',
          controller: 'changePasswordCtrl'
        }
      }
    })

    .state('tabsController.reviewAndSubmit', {
      url: '/time_home',
      views: {
        'tab3': {
          templateUrl: 'templates/reviewAndSubmit.html',
          controller: 'reviewAndSubmitCtrl'
        }
      }
    })
        
    .state('tabsController.timesheet', {
      url: '/timesheet',
      views: {
        'tab3': {
          templateUrl: 'templates/timesheet.html',
          controller: 'timesheetCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/outside/login');
})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
});
