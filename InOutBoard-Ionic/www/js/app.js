angular

.module('inoutlist', ['ionic', 'inoutlist.controllers', 'inoutlist.services', 'gettext', 'ngResource', 'filereader', 'ngSanitize'])

.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    };
})

.run(function ($ionicPlatform, gettextCatalog, Adal) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
        Adal.init();

    });
    gettextCatalog.setCurrentLanguage('sv');
    gettextCatalog.debug = true;
})

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
          url: "/tab",
          abstract: true,
          templateUrl: "templates/tabs.html"
      })

    // Each tab has its own nav history stack:

    .state('tab.people', {
        url: '/people',
        views: {
            'tab-people': {
                templateUrl: 'templates/tab-people.html',
                controller: 'PeopleCtrl'
            }
        }
    })
    .state('tab.people-detail', {
        url: '/people/:id',
        views: {
            'tab-people': {
                templateUrl: 'templates/people-detail.html',
                controller: 'PeopleDetailCtrl'
            }
        }
    })
    .state('tab.me', {
        url: '/me',
        views: {
            'tab-me': {
                templateUrl: 'templates/tab-me.html',
                controller: 'MeCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/people');

});
