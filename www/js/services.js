angular.module('app.services', [])

/*.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])*/

.service('AuthService', function($q, $http, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var isAuthenticated = false;
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;

    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var register = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {
        if (result.data.succes) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };

  var login = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/authenticate', user).then(function(result) {
        if (result.data.success) {
          storeUserCredentials(result.data.token);
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };
  
  var updatepass = function(user) {
  return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/updatepass', user).then(function(result) {
        if (result.data.success) {
          storeUserCredentials(result.data.token);
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };

  var logout = function() {
    destroyUserCredentials();
  };

  loadUserCredentials();

  return {
    login: login,
    register: register,
    updatepass: updatepass,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated;},
  };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.factory("itemsFactory", function itemsFactory(ajaxServiceFactory) {
    return ajaxServiceFactory.getService('/Items');
})

.factory("reactiveFactory", function reactiveFactory() {
        return {
            // Execute an action after a period of time without calls
            getThrottle: _createThrottle
        };

        function _createThrottle(delay) {
            var throttleTimer = null;
            var throttleDelay = delay;

            if (!throttleDelay) {
                // use default value 250ms
                throttleDelay = 250;
            }

            return {
                run: function(action) {
                    return function() {
                        clearTimeout(throttleTimer);

                        throttleTimer = setTimeout(function() {
                            // execute action
                            action.apply();

                            // dispose timer
                            throttleTimer = null;
                        }, throttleDelay);
                    }();
                }
            };
        }

    })
    
.factory('modalWindowFactory', function ($uibModal) {

    var modalWindowController = _modalWindowController;

    return {

        // Show a modal window with the specified title and msg
        show: function (title, msg, confirmCallback, cancelCallback) {

            // Show window
            var modalInstance = $uibModal.open({
                templateUrl: 'templates/modal-window.view.html',
                controller: modalWindowController,
                size: 'sm',
                resolve: {
                    title: function () {
                        return title;
                    },
                    body: function () {
                        return msg;
                    }
                }
            });

            // Register confirm and cancel callbacks
            modalInstance.result.then(
                // if any, execute confirm callback
                function() {
                    if (confirmCallback != undefined) {
                        confirmCallback();
                    }
                },
                // if any, execute cancel callback
                function () {
                    if (cancelCallback != undefined) {
                        cancelCallback();
                    }
                });
        }
    };


    // Internal controller used by the modal window
    function _modalWindowController($scope, $uibModalInstance, title, body) {
        $scope.title = "";
        $scope.body = "";

        // If specified, fill window title and message with parameters
        if (title) {
            $scope.title = title;
        }
        if (body) {
            $scope.body = body;
        }

        $scope.confirm = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }

})
.factory('notificationsFactory', function () {
    toastr.options = {
        "showDuration": "100",
        "hideDuration": "100",
        "timeOut": "2000",
        "positionClass": "toast-bottom-right",
        "extendedTimeOut": "5000",
    };

    return {
        success: function (text) {
            if (text === undefined) {
                text = '';
            }
            toastr.success("Success. " + text);
        },
        info: function (text) {
            if (text === undefined) {
                text = '';
            }
            toastr.info("Info. " + text);
        },
        error: function (text) {
            if (text === undefined) {
                text = '';
            }
            toastr.error("Error. " + text);
        },
    };
})

.service("ajaxServiceFactory", function ajaxServiceFactory($resource) {
    'use strict';

    //// PUBLIC METHODS - Definition

    this.getService = _getService;

    //// PUBLIC METHODS - Implementation

    function _getService(endPoint) {
        if (endPoint === '') {
            throw "Invalid end point";
        }
        // create resource to make AJAX calls
        return $resource(endPoint + '/:id',
        {
            id: '@Id' // default URL params, '@' Indicates that the value should be obtained from a data property 
        },
        {
            'update': { method: 'PUT' } // add update to actions (is not defined by default)
        });
        
    }
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
