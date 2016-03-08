angular.module('app.directives', [])

.directive("jobListing", function() {
   return {
       templateUrl: 'templates/joblist.html',
       replace: true
       };
})

.directive('crudGrid', function () {
    return {
        //	'A' - only matches attribute name
		//	'E' - only matches element name
		//	'C' - only matches class name
        restrict: 'A',
        // Don't replace the element that contains the attribute
        replace: false,
        // scope = false, parent scope
        // scope = true, get new scope
        // scope = {..}, isolated scope
        scope: {
            columnButtonClick: "&",    // method binding
            initialized: "&", // method binding
            serverUrl: "@serverUrl",  // one way binding
            searchdates:"@searchDate"
        },
        // view
        templateUrl: 'templates/crud.grid.view.html',
        // controller
        controller: "crudgridController as itemsCtrl"
    };
})

.directive('cellEditor', function () {
    return {
        //	'A' - only matches attribute name
        //	'E' - only matches element name
        //	'C' - only matches class name
        restrict: 'A',
        // Replace the element that contains the attribute
        replace: true,
        // scope = false, parent scope
        // scope = true, get new scope
        // scope = {...}, isolated scope>
        //		1. "@"   ( Text binding / one-way )
        //      2. "="   ( Model binding / two-way  )
        //      3. "&"   ( Method binding  )
        scope: {
            column: "=",        // object binding
            item: "=",          // object binding
            keyUpEvent: "&",    // method binding
        },
        // view
        templateUrl: 'templates/cell.editor.view.html',
        // controller
        controller: "cellEditorController as cellEditorCtrl"
    };
})

.directive('blankDirective', [function(){

}]);

