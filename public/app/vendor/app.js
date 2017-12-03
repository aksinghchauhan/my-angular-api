(function(angular) {
	'use strict';
	angular
		.module(
			"jobpApp",
			[ 'ngRoute', 'ngResource', 'ngSanitize', 'ngAnimate',
				'ui.bootstrap', 'pascalprecht.translate' ])
		.constant('VENDOR_CONSTANTS', {
			"VENDORS_URL" : "/sr/api/getvendorlist",
		})

		.factory(
			'fooService',
			[
				'$http',
				'$interpolate',
				'VENDOR_CONSTANTS',
				function($http, $interpolate, VENDOR_CONSTANTS) {
					return {
						getVendors : function() {
							return $http
								.get(VENDOR_CONSTANTS.VENDORS_URL);
						},
						getVendorDtl : function(input) {
							return $http
								.get(VENDOR_CONSTANTS.VENDORS_DTL_URL);
						}
					};
				} ])

		.controller(
			'jobpCtrl',
			[
				'$scope',
				'$routeParams',
				'fooService',
				function($scope, $routeParams, fooService) {
					$scope.submitted = false;
					$scope.userinput = {};
					var input;
					$scope.iserrorMsg = false;
					$scope.isLogin = true;
					$scope.ishome = false;
					$scope.ifPaypal = false;

					$scope.isFileupload = false;
					$scope.strLimit = 50;
					$scope.showMore = function(val) {
						$scope.strLimit = val.length;
					};

					// Event trigger on click on the Show less button.
					$scope.showLess = function() {
						$scope.strLimit = 50;
					};

					$scope.vendors = fooService.getVendors().then(
						function(response) {
							$scope.vendors = response.data;
							console.log('vendors list result =' + JSON.stringify($scope.vendors));
						});

					$scope.isListPage = true;
					$scope.getVendorDtl = function(id) {
						$scope.isListPage = false;
						$scope.isDetailpage = true;
						console.log('id in controller =' + id);
						$scope.thisAlbum = id;
						/*fooService.getVendorDtl(id).then(
							function(response) {
								$scope.details = response.data;
								console.log('vendors details =' + JSON.stringify($scope.details));
							});*/

					}

					$scope.getReview = function(reviews) {
						console.log('In getReview ');
						$scope.isReviewpage = true;
						$scope.isListPage = false;

						$scope.reviews = reviews;
					}

					$scope.goback = function() {
						console.log('In goback ');
						$scope.isListPage = true;
						$scope.isReviewpage = false;
						$scope.isDetailpage = false;
					}
					$scope.getStarted = function(isValid) {
						if (isValid) {
						} else {
							$scope.isErrorFlag = true;
						}
					}


				} ])
		.config([ '$routeProvider', function($routeProvider) {
			$routeProvider.when('/jobp', {
				templateUrl : 'index.html',
				controller : 'fooViewCtrl'
			}).when('/sr/api/login', {
				templateUrl : 'payment.html',
				controller : 'fooViewCtrl'
			}) /*
					 * .otherwise({ redirectTo : '/foo' });
					 */
		} ])
		.config(
			[
				'$translateProvider',
				function($translateProvider) {
					var enBundle = {
						"CLEAR" : "Clear"
						
					};

					$translateProvider.translations('en', enBundle);
					$translateProvider.preferredLanguage('en');
					$translateProvider.fallbackLanguage('en');
					$translateProvider
						.useSanitizeValueStrategy('sanitize');
				} ]);
})(angular);