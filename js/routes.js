angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('tabsController.items', {
      url: "/items/:startDate/:finishDate",
      views: {
        'tab3': {
          templateUrl: "templates/items.view.html",
          controller: "itemsController as itemsCtrl"
          }
        },
        cache: false,
      })

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
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
          controller: 'clockOnOffCtrl'
        }
      }
    })
  
    .state('tabsController.travelLogBook', {
      url: '/travelLogBook',
      views: {
        'tab5': {
      templateUrl: 'templates/travelLogBook.html',
      controller: 'travelLogBookCtrl'
        }
      }
    })
    
     .state('tabsController.travelreview', {
      url: '/travelreview/:startDate/:finishDate',
      views: {
        'tab5': {
      templateUrl: 'templates/travelreview.html',
      controller: 'travelreviewCtrl as itemsCtrl'
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
        

    .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
  })
  .state('outside.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});