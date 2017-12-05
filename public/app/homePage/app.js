(function(angular) {
	'use strict';
	angular
		.module(
			"homePage",
			[ 'ngRoute', 'ngResource', 'ngSanitize', 'ngAnimate',
				'ui.bootstrap', 'pascalprecht.translate' ])
		/* This place we can have constant to give web service URL*/
		.constant('VENDOR_CONSTANTS', {
			"CityNames" : "/sr/api/getCityNames",
		})
		/*  created factory to handle method */
		.factory(
			'vendorService',
			[
				'$http',
				'$interpolate',
				'VENDOR_CONSTANTS',
				function($http, $interpolate, VENDOR_CONSTANTS) {
					return {
						getCities : function() {
							return $http
								.get(VENDOR_CONSTANTS.CityNames);
						}
					};
				} ])

		.controller(
			'selectFunction',
			[
				'$scope',
				'$routeParams',
				'vendorService',
				function($scope, $routeParams, vendorService) {


					/* vendors list to be fetched from backend*/
					$scope.cities = vendorService.getCities().then(
						function(response) {
							console.log('response.data ='+JSON.stringify(response.data));
							$scope.cities = response.data;
							console.log('Cities list result =' + JSON.stringify($scope.cities));
						});

					/* get details on click of each vendor */
					$scope.getVendorDtl = function(id) {
						$scope.isListPage = false;
						$scope.isDetailpage = true;
						console.log('id in controller =' + id);
						$scope.thisAlbum = id;

					}
					/*getting review for individual listing */
					$scope.getReview = function(reviews) {
						console.log('In getReview ');
						$scope.isReviewpage = true;
						$scope.isListPage = false;
						$scope.reviews = reviews;
					}

					/* getting back to listing page */
					$scope.goback = function() {
						console.log('In goback ');
						$scope.isListPage = true;
						$scope.isReviewpage = false;
						$scope.isDetailpage = false;
					}
				} ])

})(angular);