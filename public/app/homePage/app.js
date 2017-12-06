(function(angular) {
	'use strict';
	angular.module("homePage", [])
	/* This place we can have constant to give web service URL */
	.constant('VENDOR_CONSTANTS', {
		"CityNames" : "/sr/api/getCityNames",
		"GET_DB_DATA_URL" : "/sr/api/getPersitedValue",
		"SET_DB_DATA_URL" : "/sr/api/setPersitedValue"
	})
	/* created factory to handle method */
	.factory(
			'vendorService',
			[
					'$http',
					'VENDOR_CONSTANTS',
					function($http, VENDOR_CONSTANTS) {
						return {
							getCities : function() {
								return $http.get(VENDOR_CONSTANTS.CityNames);
							},
							getDBData : function(type) {
								return $http
										.get(VENDOR_CONSTANTS.GET_DB_DATA_URL
												+ '?type=' + type);
							}
							,
							setDBData : function(input) {
								return $http
										.post(VENDOR_CONSTANTS.SET_DB_DATA_URL,input);
							}
						};
					} ])

	.controller(
			'selectFunction',
			[
					'$scope',
					'vendorService',
					function($scope, vendorService) {



						$scope.onConfirm = function(formValid) {
							if (formValid) {
								/*var params = {};
								params.email = $scope.userinput.email;
								params.name = $scope.userinput.name;
								params.password = $scope.userinput.password;*/
								}
							console.log('SignUp Data is to database ='
									+ JSON.stringify($scope.userinput.email));
							
							var input = {};
							input.data =$scope.userinput;
							vendorService.setDBData($scope.userinput);
							
						};
						$scope.cities = vendorService.getDBData('city').then(
								function(response) {
									$scope.cities = response.data;
									console.log('Cities list from database ='
											+ JSON.stringify($scope.vList));
								});
						$scope.events = vendorService.getDBData('event').then(
								function(response) {
									$scope.event = response.data;
									console.log('Event list from database ='
											+ JSON.stringify($scope.event));

								});
					} ])

})(angular);