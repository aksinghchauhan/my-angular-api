(function(angular) {
	'use strict';
	angular
		.module(
			"vendorApp",
			[ 'ngRoute', 'ngResource', 'ngSanitize', 'ngAnimate',
				'ui.bootstrap', 'pascalprecht.translate' ])
		/* This place we can have constant to give web service URL*/
		.constant('VENDOR_CONSTANTS', {
			"VENDORS_URL" : "/sr/api/getvendorlist",
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
						getVendors : function() {
							return $http
								.get(VENDOR_CONSTANTS.VENDORS_URL);
						}
					};
				} ])

		.controller(
			'jobpCtrl',
			[
				'$scope',
				'$routeParams',
				'vendorService',
				function($scope, $routeParams, vendorService) {

					//This is main entry inside controller

					// by default list page will be displayed
					$scope.isListPage = true;

					$scope.strLimit = 50; /*show more/less count */
					$scope.showMore = function(val) {
						$scope.strLimit = val.length;
					};

					// Event trigger on click on the Show less button.
					$scope.showLess = function() {
						$scope.strLimit = 50;
					};

					/* vendors list to be fetched from backend*/
					$scope.vendors = vendorService.getVendors().then(
						function(response) {
							$scope.vendors = response.data;
							console.log('vendors list result =' + JSON.stringify($scope.vendors));
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