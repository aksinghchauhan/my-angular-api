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
			"GET_DB_DATA_URL" : "/sr/api/getPersitedValue"
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
						},
						getDBData : function(type) {
							return $http
								.get(VENDOR_CONSTANTS.GET_DB_DATA_URL + '?type=' + type);
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

					/* testing with hardcoded json >>vendors list to be fetched from backend
					$scope.vendors = vendorService.getVendors().then(
						function(response) {
							$scope.vendors = response.data;
							console.log('vendors list result =' + JSON.stringify($scope.vendors));
						});	 */
					
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

					//data fetching from database
					$scope.vendorList = vendorService.getDBData('vendor').then(
						function(response) {
							$scope.vList = response.data;
							console.log('vendors list from database =' + JSON.stringify($scope.vList));

							$scope.reviewList = vendorService.getDBData('review').then(
								function(response) {
									$scope.rList = response.data;
									//console.log('review list from database =' + JSON.stringify($scope.rList));
									//merge two object 
									var tempObj = [];
									for (var i in $scope.vList) {
										var obj = $scope.vList[i];

										for (var j in $scope.rList) {
											var count = 0;
											var review = [];

											var innerObj = $scope.rList[j];
											tempObj[i] = obj;
											if (obj.id === innerObj.vendor_id) {
												count++;
												review.push(innerObj.review);
												tempObj[i].reviews = review;
												tempObj[i].reviews_count = count;
											} else {
												tempObj[i].reviews = review;
												tempObj[i].reviews_count = 0;
											}

										}
									}
									$scope.vendors = tempObj;
									console.log('tempObj =' + JSON.stringify(tempObj))
								});
						});

				} ])

})(angular);