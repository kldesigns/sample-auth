angular.module('app.controllers', ['angularMoment', 'ngTable'])

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

 /* $scope.getInfo = function() {
    $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
    });
  };*/

  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
})
   
.controller('clockOnOffCtrl', function($scope, AUTH_EVENTS, AuthService, $state, $ionicPopup, $http, API_ENDPOINT, $log) {
  $scope.message = {
   time: new Date()
  };
  $scope.bundyopts = {
    onoff: '',
    selectedJob: '',
    locationcoord:'437',
    dateon:'',
    dateoff:''
  };
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
   var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      var lat  = position.coords.latitude;
      var long = position.coords.longitude;
      $scope.bundyopts.locationcoord = lat + "," + long;
    }, function(err) {
      throw(err);
    });
    
  $http.get(API_ENDPOINT.url + '/bundyinfo').then(function(result) {
      $scope.bundyState = result.data.bundyState;
      $scope.bundyJob = result.data.bundyJob;
      $scope.jobList = result.data.jobList;
      $scope.bundyopts.dateon = result.data.dateon.dateon;
      if (result.data.bundyState == "off"){
        $scope.bundyopts.onoff = "on";
        } else {
        $scope.bundyopts.onoff = "off";
        }
    });

   $scope.bundy = function (bundyopts) {
      if (bundyopts.onoff == "on"){
        bundyopts.dateon = new Date();
      } else {
        bundyopts.dateoff = new Date();
      }
      $http.post(API_ENDPOINT.url + '/bundy', bundyopts).then(function(result) {
        var msg = result.data.msg;
        if (result.data.success) {
          var alertPopup = $ionicPopup.alert({
          title: 'Success!',
          template: msg
          }).then(function(){
          
          if (bundyopts.onoff == "on"){
            $scope.bundyJob = bundyopts.selectedJob;
          } else {
            $scope.bundyJob = "0";
          }
          
          $scope.bundyState = bundyopts.onoff;
          bundyopts.onoff = result.data.bundyupdate;
          });
        } else {
          var alertPopuperr = $ionicPopup.alert({
          title: 'Something went wrong!',
          template: msg
          });
        }
        
      });
      
   };
    
    
})
   
.controller('travelLogBookCtrl', function($scope, AUTH_EVENTS, AuthService, $http, $state, $ionicPopup, notificationsFactory, API_ENDPOINT) {
  var today = moment().format("DD/MM/YYYY HH:mm");
  $scope.travelopts = {
    startodo:'',
    finishodo:'',
    tollscheck:false,
    tollstotal:'',
    logdate:today
  };
  
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
 
 $scope.logentry = function (travelopts){
   $http.post(API_ENDPOINT.url + '/travellog', travelopts).then(function(result) {
        var msg = result.data.msg;
        if (result.data.success) {
         notificationsFactory.success(msg);
        } else {
          notificationsFactory.error(msg);
          }
        });
 };
  
})

.controller('travelreviewCtrl', function($scope, AUTH_EVENTS, AuthService, $state, $stateParams, $ionicPopup, modalWindowFactory, API_ENDPOINT, $resource) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
  
        var self = this;

        //// ---------------- PUBLIC ----------------
        //// PUBLIC fields
        self.gridController = {};

        //// PUBLIC Methods
        // Method executed when a button inside the grid is clicked
        self.gridOnButtonClick = _gridOnButtonClick;

        // Method executed when the grid is initialized
        self.gridOnInitialized = _gridOnInitialized;

        $scope.searchDate = $stateParams;

        self.fireKeyUpEvent = _fireKeyUpEvent;
        $scope.searchDate.startDateF = moment($scope.searchDate.startDate, "DD/MM/YYYY").format('x');
        $scope.searchDate.finishDateF = moment($scope.searchDate.finishDate, "DD/MM/YYYY").format('x');
    

        // API URL  
        self.serverUrl = API_ENDPOINT.url + "/travellog/range/"+$scope.searchDate.startDateF+"/"+$scope.searchDate.finishDateF+"/";
        //// ---------------- CODE TO RUN -----------
      


        //// ---------------- PRIVATE ---------------
        //// PRIVATE fields

        //// PRIVATE Functions - Public Methods Implementation	
        function _gridOnInitialized(controller) {
            self.gridController = controller;
        }
        
        $scope.rerun = function () {
          $stateParams = {startDate: $scope.searchDate.startDate, finishDate: $scope.searchDate.finishDate};
          $state.transitionTo($state.current, $stateParams, { reload: true, inherit: true, notify: true });//reload

        };

        function _gridOnButtonClick(sender, args) {
            console.log("button click" + args.button + " " + args.item.id);

            if (args.button == 'plus') {
                modalWindowFactory.show(args.item.name, "Custom button click = +");
            }
            else if (args.button == 'minus') {
                modalWindowFactory.show(args.item.name, "Custom button click = -");
            }
        }
         function _fireKeyUpEvent(args, item) {
        // call method with parameters
        self.keyUpEvent()(args, item);
    }

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
  var currentDate = new Date();
  $scope.currentdate = moment().format('DD/MM/YYYY');
  $scope.thisweekstart = moment().startOf('week').format('DD/MM/YYYY');
  $scope.lastweekstart = moment(currentDate).weekday(-6).format('DD/MM/YYYY');
  $scope.lastweekend = moment(currentDate).weekday(-0).format('DD/MM/YYYY');
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

.controller("itemsController", function ($scope, $stateParams, modalWindowFactory, AUTH_EVENTS, AuthService, $ionicPopup, API_ENDPOINT, $resource, $state ) {
       $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
       
        var self = this;

        //// ---------------- PUBLIC ----------------
        //// PUBLIC fields
        self.gridController = {};

        //// PUBLIC Methods
        // Method executed when a button inside the grid is clicked
        self.gridOnButtonClick = _gridOnButtonClick;

        // Method executed when the grid is initialized
        self.gridOnInitialized = _gridOnInitialized;

        
        $scope.searchDate = $stateParams;
          self.datePickersearchOpen = false;
    self.openDatesearchPicker = _openDatesearchPicker;
    
    self.fireKeyUpEvent = _fireKeyUpEvent;
    $scope.searchDate.startDateF = moment($scope.searchDate.startDate, "DD/MM/YYYY").format('x');
    $scope.searchDate.finishDateF = moment($scope.searchDate.finishDate, "DD/MM/YYYY").format('x');
    

        // API URL  
        self.serverUrl = API_ENDPOINT.url + "/timesheet/range/"+$scope.searchDate.startDateF+"/"+$scope.searchDate.finishDateF+"/";
        //// ---------------- CODE TO RUN -----------
      


        //// ---------------- PRIVATE ---------------
        //// PRIVATE fields

        //// PRIVATE Functions - Public Methods Implementation	
        function _gridOnInitialized(controller) {
            self.gridController = controller;
        }
        
        $scope.rerun = function () {
          $stateParams = {startDate: $scope.searchDate.startDate, finishDate: $scope.searchDate.finishDate};
          $state.transitionTo($state.current, $stateParams, { reload: true, inherit: true, notify: true });//reload

        };

        function _gridOnButtonClick(sender, args) {
            console.log("button click" + args.button + " " + args.item.id);

            if (args.button == 'plus') {
                modalWindowFactory.show(args.item.name, "Custom button click = +");
            }
            else if (args.button == 'minus') {
                modalWindowFactory.show(args.item.name, "Custom button click = -");
            }
        }
         function _fireKeyUpEvent(args, item) {
        // call method with parameters
        self.keyUpEvent()(args, item);
    }

    function _openDatesearchPicker($event) {
        $event.preventDefault();
        $event.stopPropagation();

        self.datePickersearchOpen = true;
    }

})

.controller("crudgridController", function crudgridController($scope, $element, $attrs, ajaxServiceFactory, notificationsFactory, modalWindowFactory, reactiveFactory) {
    var self = this;

    //// ---------------- PUBLIC -----------------

    //// PUBLIC fields

    // Columns he grid should display
    self.columnsDefinition = [];

    // All items
    self.allItems = [];

    // The item being added
    self.newItem = {};

    // Indicates if the view is being loaded
    self.loading = false;

    // Indicates if the view is in add mode
    self.addMode = false;

    // The column used for ordering
    self.orderByColumn = '';

    // Indicates if the ordering is reversed or not
    self.orderByReverse = false;

    // Filter
    self.filter = "";

    // Written filter text, this is not the applied one (performance tunning)
    self.filterText = "";

    //// PUBLIC Methods

    // Initialize module
    self.initialize = _initialize;

    // Toggle the grid between add and normal mode
    self.toggleAddMode = _toggleAddMode;

    // Toggle an item between normal and edit mode
    self.toggleEditMode = _toggleEditMode;

    // Creates the 'newItem' on the server
    self.createItem = _createItem;

    // Gets an item from the server using the id
    self.readItem = _readItem;

    // Updates an item
    self.updateItem = _updateItem;

    // Deletes an item
    self.deleteItemWithConfirmation = _deleteItemWithConfirmation;
    self.deleteItem = _deleteItem;

    // Get all items from the server
    self.getAllItems = _getAllItems;
    
    //self.postAllItems = _postAllItems($scope.searchDate);

    // In edit mode, if user press ENTER, update item
    self.updateModeKeyUp = _updateModeKeyUp;

    // In add mode, if user press ENTER, add item
    self.createModeKeyUp = _createModeKeyUp;

    // Set the order by column and order
    self.setOrderByColumn = _setOrderByColumn;

    // Notify custom button click
    self.notifyColumnClick = _notifyColumnClick;

    // Adds the item to the collection (no server communication)
    self.itemDeleted = _itemDeleted;

    // Removes an item from the collection (no server communication)
    self.itemCreated = _itemCreated;

    // Apply filter with throttle
    self.filterChanged = _filterChanged;

    // Clear current filter
    self.clearFilter = _clearFilter;

    //// ---------------- CODE TO RUN ------------

    self.initialize();

    //// ---------------- PRIVATE ----------------

    //// PRIVATE fields
    var _itemsService;
    var _createItemThrottle = reactiveFactory.getThrottle(500);
    var _updateItemThrottle = reactiveFactory.getThrottle(500);
    var _filterThrottle = reactiveFactory.getThrottle(500);

    //// PRIVATE Functions - Public Methods Implementation

    function _initialize() {
        // create a service to do the communication with the server
 
        _itemsService = ajaxServiceFactory.getService($scope.serverUrl, $scope.searchDate);
        
        // configured columns
        self.columnsDefinition = angular.fromJson($attrs.columnsDefinition);
        
        // Initialize
        self.getAllItems();

    }

    function _toggleAddMode() {
        self.addMode = !self.addMode;

        // Empty new item
        self.newItem = {};

        // Set a default id or the validation will crash
        self.newItem.id = 0;
        self.newItem.hasErrors = !_isValid(self.newItem);
    }

    function _toggleEditMode(item) {
        // Toggle
        item.editMode = !item.editMode;

        // if item is not in edit mode anymore
        if (!item.editMode) {
            // Undo changes
            _restoreServerValues(item);
        } else {
            // save server name to restore it if the user cancel edition
            item.serverValues = angular.toJson(item);

            // Set edit mode = false and restore the name for the rest of items in edit mode 
            // (there should be only one)
            self.allItems.forEach(function (i) {
                // item is not the item being edited now and it is in edit mode
                if (item.id != i.id && i.editMode) {
                    // Save current editing values 
                    self.updateItem(i);
                }
            });
        }
    }

    function _createItem(item) {
        if (_isValid(item)) {
            _itemsService.save(item,
                // success response
                function (createdItem) {
                    // Add at the first position
                    self.allItems.unshift(createdItem);
                    self.addMode = false;

                    _requestSuccess(createdItem);
                },
                // error callback
                function (error) {
                    _requestError(error.data);
                });
        }
    }

    function _readItem(itemId) {
        _itemsService.get({ id: itemId }, _requestSuccess, _requestError);
    }

    function _updateItem(item) {
        if (_isValid(item)) {
            item.editMode = false;

            // Only update if there are changes
            if (_isDirty(item)) {
                _itemsService.update({ id: item.id }, item, function (response) {
                    // Refresh item with server values
                    _copyItem(response, item);
                    _requestSuccess();
                }, function (error) {
                    _requestError(error.data);
                    _restoreServerValues(item);
                    item.editMode = true;
                });
            }
        }
    }

    function _deleteItemWithConfirmation(item) {

        var serverDelete = function () {
            return _itemsService.delete(
                // id
                { id: item.id },
                // item 
                item,
                // success callback
                function () {

                    _requestSuccess();

                    // Remove from scope
                    var index = self.allItems.indexOf(item);
                    self.allItems.splice(index, 1);
                },
                // error callback
                function (error) {
                    _requestError(error.data);
                });
        };

        var title = "Delete '" + item.name + "'";
        var msg = "Are you sure you want to remove this item?";
        modalWindowFactory.show(title, msg, serverDelete);

    }

    function _deleteItem(item) {
        _itemsService.delete({ id: item.id }, item,
            // success callback
            function () {
                // Remove from scope
                var index = self.allItems.indexOf(item);
                self.allItems.splice(index, 1);
            });
    }

    function _getAllItems(searchdates) {
        self.loading = true;
        self.allItems = _itemsService.query(
          // success callback
            function () {
                self.loading = false;

                // Notify initialization if there is a listener
                if ($scope.initialized()) {
                    // Make controller available from outside
                    $scope.initialized()(self);
                }
            },
            // error callback
            function () {
                _requestError("Error loading items.");
            });
    }
    

    function _updateModeKeyUp(args, item) {
        // if key is enter
        if (args.keyCode == 13) {
            // update
            self.updateItem(item);
            // remove focus
            args.target.blur();
        } else {
            _updateItemThrottle.run(function () {
                // refresh validation
                $scope.$apply(function () {
                    item.hasErrors = !_isValid(item);
                });
            });
        }
    }

    function _createModeKeyUp(args, item) {
        // if key is enter
        if (args.keyCode == 13) {
            // create
            self.createItem(item);
            // remove focus
            args.target.blur();
        } else {
            _createItemThrottle.run(function () {
                // refresh validation
                $scope.$apply(function() {
                    item.hasErrors = !_isValid(item);
                });
            });
        }
    }

    function _setOrderByColumn(column) {
        if (self.orderByColumn == column) {
            // change order
            self.orderByReverse = !self.orderByReverse;
        } else {
            // order using new column
            self.orderByColumn = column;
            self.orderByReverse = false;
        }

        _applyOrder();
    }

    function _notifyColumnClick(id, clickedItem) {
        if ($scope.columnButtonClick()) {
            $scope.columnButtonClick()(this, { button: id, item: clickedItem });
        }
    }

    function _itemDeleted(item) {
        var index = self.allItems.indexOf(item);
        self.allItems.splice(index, 1);
    }

    function _itemCreated(item) {
        // add to the list of items
        self.allItems.unshift(item);
    }

    function _filterChanged() {
        _filterThrottle.run(function () {
            // update filter
            $scope.$apply(function () {
                self.filter = self.filterText;
            });
        });
    }

    function _clearFilter() {
        self.filterText = "";
        self.filter = "";
    }

    //// PRIVATE Functions

    function _requestSuccess() {
        notificationsFactory.success();
    }

    function _requestError(error) {
        notificationsFactory.error(error);
    }

    function _isValid(item) {
        var isValid = true;

        // validate all columns
        self.columnsDefinition.forEach(function (column) {
            if (isValid) {

                // required validation
                if (column.required == 'true') {
                    isValid = item[column.binding] != undefined;
                }
            }

        });

        return isValid;
    }

    function _isDirty(item) {
        var serverItem = angular.fromJson(item.serverValues);

        var isDirty = false;

        self.columnsDefinition.forEach(function (column) {
            if (!isDirty && // short circuit if item is dirty
                (item[column.binding] != serverItem[column.binding])) {
                isDirty = true;
            }
        });

        return isDirty;
    }

    function _restoreServerValues(item) {

        var serverItem = angular.fromJson(item.serverValues);

        _copyItem(serverItem, item);
        self.columnsDefinition.forEach(function (column) {
            item[column.binding] = serverItem[column.binding];
        });
    }

    function _copyItem(itemSource, itemTarget) {
        self.columnsDefinition.forEach(function (column) {
            itemTarget[column.binding] = itemSource[column.binding];
        });
    }

    function _applyOrder() {
        self.allItems.sort(function (a, b) {
            var comparisonResult = 0;

            var aField = a[self.orderByColumn];
            var bField = b[self.orderByColumn];

            if (aField === null) aField = "";
            if (bField === null) bField = "";


            if (aField < bField) comparisonResult = -1;
            if (aField > bField) comparisonResult = 1;

            if (self.orderByReverse) {
                comparisonResult = comparisonResult * (-1);
            }

            return comparisonResult;
        });
    }

   
})

.controller("cellEditorController", function cellEditorController($scope) {

    'use strict';
    var self = this;

    //// ---------------- PUBLIC -----------------
    //// PUBLIC fields

    self.keyUpEvent = $scope.keyUpEvent;
    self.column = $scope.column;
    self.item = $scope.item;
    self.today = new Date();

    self.datePickerOpen = false;
    self.openDatePicker = _openDatePicker;
    
    self.fireKeyUpEvent = _fireKeyUpEvent;

    //// PUBLIC Methods


    //// ---------------- CODE TO RUN ------------


    //// ---------------- PRIVATE ----------------

    //// PRIVATE fields

    //// PRIVATE Functions - Public Methods Implementation
    function _fireKeyUpEvent(args, item) {
        // call method with parameters
        self.keyUpEvent()(args, item);
    }

    function _openDatePicker($event) {
        $event.preventDefault();
        $event.stopPropagation();

        self.datePickerOpen = true;
    }

    //// PRIVATE Functions

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
