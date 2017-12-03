(function(angular) {
    'use strict';
    angular.module("fooApp", ['ngRoute', 'ngResource', 'ngSanitize', 'ngAnimate',
            'ui.bootstrap', 'pascalprecht.translate'])
        .constant('FOO_CONSTANTS', {
            "FOOS_URL": "/sr/api/foo"
        })
        .factory('fooService', ['$http', '$interpolate', 'FOO_CONSTANTS',
            function($http, $interpolate, FOO_CONSTANTS) {
                return {
                    getFoos: function() {
                        return $http.get(FOO_CONSTANTS.FOOS_URL);
                    }
                };
            }
        ])
        .controller('fooViewCtrl', ['$scope', '$routeParams', 'fooService',
            function($scope, $routeParams, fooService) {
                fooService.getFoos()
                    .success(function(response/*, status, headers, config*/) {
                        $scope.foos = response;
                    })
                    .error(function(response, status/*, headers, config*/) {
                        $scope.foos = [];
                        console.log("failure status = %s", status);
                    });
            }
        ])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .when('/foo', {
                    templateUrl: 'partials/fooView.html',
                    controller: 'fooViewCtrl'
                })
                .otherwise({
                    redirectTo: '/foo'
                });
        }])
        .config(['$translateProvider', function($translateProvider) {
            $translateProvider.useStaticFilesLoader({
                prefix: 'i18n/locale-',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('en');
            $translateProvider.fallbackLanguage('en');
            //this is not working currently, may be it will be fixed soon
            //$translateProvider.translationNotFoundIndicator('X');
            $translateProvider.useSanitizeValueStrategy('sanitize');
        }
        ]);
})(angular);
