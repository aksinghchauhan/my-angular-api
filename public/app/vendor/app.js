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
			"GET_DB_DATA_URL" : "/sr/api/getPersitedValue",
			"POST_VENDOR_DATA_URL" : "/app/vendor/registerVendor"
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
						},
						registerVendor : function(inputData) {
							return $http
								.post(VENDOR_CONSTANTS.POST_VENDOR_DATA_URL, inputData);
						}
					};
				} ])

		.controller(
			'jobpCtrl',
			[
				'$http',
				'$scope',
				'$routeParams',
				'vendorService',
				function($http, $scope, $routeParams, vendorService) {

					//This is main entry inside controller

					// by default list page will be displayed
					$scope.isListPage = false;
					$scope.isRegisterHotel = true;

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
						});*/

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

					/*data fetching from database */
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



					function cleanse(value, nullValue) {
						return value == null || value.length == 0
						|| value === undefined
						|| value === "undefined" ? nullValue
							: value;
					}

					$scope.submitted = false;

					$scope.registerVendor = function(flag, vendor) {
						console.log('In registerVendor .. ');
						if (!flag) {
							console.log('---Form is not valid Please check-----------');
						} else {
							var input = getInputToAdd(vendor);

							//console.log('---getInputToAdd---='+JSON.stringify(input));

							$scope.vendorResponse = vendorService
								.registerVendor(input)
								.then(
									function(response) {
										var result = response.data;
										console.log('result =' + result)
										if (result == 'SUCCESS') {
											$scope.isSuccessMsg = true;
											//$scope.addForm.$setPristine();
											$scope.vendor ={};
											$scope.vendor.image1.value ='';
										}
										if (result == 'FAILURE') {
											$scope.isFailedMsg = true;
										}										
									});
						}

					}
					function getInputToAdd(vendor) {
						var imgBlob = {};

						var main_imagevalue;
						switch (vendor.main_image) {
						case 1:
							main_imagevalue = vendor.image1;
							break;
						case 2:
							main_imagevalue = vendor.image2;
							break;
						case 3:
							main_imagevalue = vendor.image3;
							break;
						case 4:
							main_imagevalue = vendor.image4;
							break;
						case 5:
							main_imagevalue = vendor.image5;
							break;
						case 6:
							main_imagevalue = vendor.image6;
							break;
						case 7:
							main_imagevalue = vendor.image7;
							break;
						case 8:
							main_imagevalue = vendor.image8;
							break;
						case 9:
							main_imagevalue = vendor.image9;
							break;
						case 10:
							main_imagevalue = vendor.image10;
							break;
						default:
							console.log('default');
							//in case no radio button checked
							main_imagevalue = vendor.image1;
							break;
						}

						//in case image is not uploaded
						if (undefined != main_imagevalue || main_imagevalue == null) {
							if (undefined != vendor.image1) {
								main_imagevalue = vendor.image1;
							} else {
								main_imagevalue = null;
							}
						}
						var imgBlob1 ,
							imgBlob2,
							imgBlob3,
							imgBlob4,
							imgBlob5;
						if (undefined != vendor.image1) {
							imgBlob1 = vendor.image1;
							imgBlob.blob1 = imgBlob1;
						}

						if (undefined != vendor.image2) {
							imgBlob2 = vendor.image2; //dataURItoBlob
							imgBlob.blob2 = imgBlob2;
						}

						if (undefined != vendor.image3) {
							imgBlob3 = vendor.image3;
							imgBlob.blob3 = imgBlob3;
						}

						if (undefined != vendor.image4) {
							imgBlob4 = vendor.image4;
							imgBlob.blob4 = imgBlob4;
						}

						if (undefined != vendor.image5) {
							imgBlob5 = vendor.image5;
							imgBlob.blob5 = imgBlob5;
						}
						var input = {};
						input.vendor = vendor;
						input.imgBlobs = imgBlob;
						input.main_imagev = main_imagevalue;

						console.log('input.main_imagev ==>' + input.main_imagev);
						return input;
					}
				} ]).directive("fileread", [
		function() {
			return {
				scope : {
					fileread : "="
				},
				link : function(scope, element, attributes) {
					element.bind("change", function(changeEvent) {
						var reader = new FileReader();
						reader.onload = function(loadEvent) {
							scope.$apply(function() {
								scope.fileread = loadEvent.target.result;
							});
						}
						reader.readAsDataURL(changeEvent.target.files[0]);
					});
				}
			}
		} ]);

})(angular);