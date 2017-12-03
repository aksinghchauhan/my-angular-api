(function(angular) {
	'use strict';
	angular
			.module(
					"manageUsersApp",
					[ 'ssueDelegate', 'cgBusy', 'ngSanitize',
							'pascalprecht.translate' ])
			.constant(
					'MANAGEUSER_CONSTANTS',
					{
						"MANAGEUSER_VERIFY" : "/smartcaressue/rest/verifySCUser",
						"MANAGEUSER_ADDURL" : "/smartcaressue/rest/addSCUser",
						"MANAGEUSER_GETDETIALURL" : "/smartcaressue/rest/getUserDetails",
						"MANAGEUSER_EDIT" : "/smartcaressue/rest/editSCUser",
						"MANAGEUSER_DELETE" : "/smartcaressue/rest/deleteSCUsers"
					})
			.factory(
					'manageUserService',
					[
							'$http',
							'MANAGEUSER_CONSTANTS',
							function($http, MANAGEUSER_CONSTANTS) {
								return {
									onAdd : function(addUser) {
										return $http
												.post(
														location.protocol
																+ '//'
																+ location.host
																+ MANAGEUSER_CONSTANTS.MANAGEUSER_ADDURL,
														addUser);
									},
									onVerify : function(config) {
										var verifyUrl = location.protocol
												+ '//'
												+ location.host
												+ MANAGEUSER_CONSTANTS.MANAGEUSER_VERIFY;

										return $http.post(verifyUrl, config);
									},
									onEdit : function(config) {
										return $http
												.post(
														MANAGEUSER_CONSTANTS.MANAGEUSER_EDIT,
														config);
									},
									getUserDetail : function(input) {
										return $http
												.post(
														MANAGEUSER_CONSTANTS.MANAGEUSER_GETDETIALURL,
														input);
									},
									onDelete : function(input) {
										return $http
												.post(
														MANAGEUSER_CONSTANTS.MANAGEUSER_DELETE,
														input);
									}
								};
							} ])
			.controller(
					'ManageUserViewCtrl',
					[
							'$scope',
							'$http',
							'manageUserService',
							'$window',
							function($scope, $http, manageUserService, $window) {

								$scope.userinput = {};
								$scope.iserrorMsg = false;
								$scope.isinputNullMsg = false;
								$scope.isEditUser = false;
								$scope.isAddUser = false;
								$scope.isDeletUser = false;
								$scope.isCcoidNull = false;
								$scope.isValidValue = true;
								$scope.isVerified = false;
								$scope.accessLeveldefault = '--';
								$scope.isCustomerUser = false;
								$scope.isSelfEditing = false;
								var vm = this;
								$scope.rolesValue = {
									"PARTNER_ADMIN" : "Partner Admin",
									"PARTNER_USER" : "Partner User"
								}
								$scope.roles = [
										$scope.rolesValue.PARTNER_USER,
										$scope.rolesValue.PARTNER_ADMIN ];

								var input = {
									params : {
										operation : getUrlParameter('operation')

									}
								};

								function cleanse(value, nullValue) {
									return value == null || value.length == 0
											|| value === undefined
											|| value === "undefined" ? nullValue
											: value;
								}

								for ( var i in input['params']) {
									if ("invalid" == cleanse(
											input['params'][i], "invalid")) {
										$scope.invalidInput = true;
										break;
									}
								}

								if (input.params.operation == 'add') {
									$scope.isAddUser = true;

								}
								if (input.params.operation == 'edit') {
									$scope.isEditUser = true;
									if (getUrlParameter('rolename') == 'Customer User') {
										$scope.isCustomerUser = true;
									}

									$scope.manageUserpromise = manageUserService
											.getUserDetail(
													getUrlParameter('ccoid'))
											.then(
													function(response) {

														if (response != null) {
															onEditDetail(response.data);
														}
													});

								}
								if (input.params.operation == 'delete') {

									$scope.isDeletUser = true;
									var arrayValue = getUrlParameter('ccoid')
											.split('|');
									for (i = 0; i < arrayValue.length; i++) {
										if ("invalid" != cleanse(arrayValue[i],
												"invalid")) {
											$scope.seletedUsers += arrayValue[i];

											$scope.seletedUsers = $scope.seletedUsers
													.replace('undefined', '');
											if (i != arrayValue.length - 1)
												$scope.seletedUsers += ", ";
										}
									}

								}
								$scope.rolename = $scope.rolesValue.PARTNER_USER;
								$scope.linkAddress = '';
								$scope.isValidCheck = true;
								$scope.verifyUser = function(ccoid) {
									// if (isValid) {
									if ("invalid" == cleanse(ccoid, "invalid")) {
										$scope.isCcoidNull = true;
									} else {
										$scope.isCcoidNull = false;
										var userInput = ccoid;

										$scope.ccoidvalue = ccoid;
										$scope.manageUserpromise = manageUserService
												.onVerify(userInput)
												.then(
														function(response) {
															var json = response.data;
															var obj = json.userInfo;
															var result = json.result;
															var message = json.message;
															var urlLink = json.url;

															if (result != null
																	&& result == 'SUCCESS') {
																// enabling
																// confirm on
																// adding
																// another user
																$scope.isSuccessMsg = false;
																$scope.isFailedMsg = false;

																$scope.isPartnerAdmin = false;
																$scope.isPartnerUser = true;
																$scope.isDetailShown = true;
																$scope.iserrorMsg = false;
																$scope.isVerified = true;
																$scope.isLevelEmpty = false;
																$scope.fullName = obj.fullName;

																if ("invalid" == cleanse(
																		$scope.fullName,
																		"invalid")) {
																	$scope.isfullNameEmpty = true;
																} else {
																	$scope.isfullNameEmpty = false;
																}
																$scope.mail = obj.mail;

																if ("invalid" == cleanse(
																		$scope.mail,
																		"invalid")) {
																	$scope.isMailEmpty = true;
																} else {
																	$scope.isMailEmpty = false;
																}

																$scope.phoneNumber = obj.phoneNumber;
																if ("invalid" == cleanse(
																		$scope.phoneNumber,
																		"invalid")) {
																	$scope.isPhoneEmpty = true;
																} else {
																	$scope.isPhoneEmpty = false;
																}

																$scope.fax = obj.fax;
																$scope.street = obj.street;

																if ("invalid" == cleanse(
																		$scope.street,
																		"invalid")) {
																	$scope.isStreetEmpty = true;
																} else {
																	$scope.isStreetEmpty = false;
																}
																console
																		.log(
																				"$scope.street2",
																				$scope.street2);
																if ("invalid" == cleanse(
																		obj.street2,
																		"invalid")
																		|| (JSON
																				.stringify(obj.street2) == "0")
																		|| (obj.street2 == '0')) {
																	$scope.street2 = '';
																} else {
																	$scope.street2 = obj.street2;
																}

																$scope.state = obj.state;
																if ("invalid" == cleanse(
																		$scope.state,
																		"invalid")) {
																	$scope.isStateEmpty = true;
																} else {
																	$scope.isStateEmpty = false;
																}

																$scope.city = obj.city;
																if ("invalid" == cleanse(
																		$scope.city,
																		"invalid")) {
																	$scope.isCityEmpty = true;
																} else {
																	$scope.isCityEmpty = false;
																}
																$scope.postalCode = obj.postalCode;

																if ("invalid" == cleanse(
																		$scope.postalCode,
																		"invalid")) {
																	$scope.isPostalEmpty = true;
																} else {
																	$scope.isPostalEmpty = false;
																}

																$scope.country = obj.country;
																if ("invalid" == cleanse(
																		$scope.country,
																		"invalid")) {
																	$scope.isCountryEmpty = true;
																} else {
																	$scope.isCountryEmpty = false;
																}

																$scope.accessLevel = obj.accessLevel;
																if ("invalid" == cleanse(
																		$scope.accessLevel,
																		"invalid")) {
																	$scope.isLevelEmpty = true;
																} else {
																	$scope.isLevelEmpty = false;
																}

																$scope.companyName = obj.companyName;
																if ("invalid" == cleanse(
																		$scope.companyName,
																		"invalid")) {
																	$scope.isCompNameEmpty = true;
																} else {
																	$scope.isCompNameEmpty = false;
																}
															} else {
																$scope.isDetailShown = false;
																$scope.iserrorMsg = true;
																$scope.linkAddress = urlLink;
																if ("invalid" == cleanse(
																		$scope.linkAddress,
																		"invalid")) {
																	$scope.isUrlPresent = false;
																} else {
																	$scope.isUrlPresent = true;
																	message = message
																			.replace(
																					"Self Service Tool",
																					" ");
																}
																$scope.errorMsg = message;
															}

														});

									}// else closed

									/*
									 * }// is valid check else {
									 * $scope.isValidCheck = false; }
									 */
								};

								$scope.changeRole = function(selectedName) {

									if (selectedName == $scope.rolesValue.PARTNER_ADMIN) {
										$scope.isPartnerAdmin = true;
										$scope.isPartnerUser = false;
										$scope.rolename = $scope.rolesValue.PARTNER_ADMIN;
									} else if (selectedName == $scope.rolesValue.PARTNER_USER) {
										$scope.isPartnerAdmin = false;
										$scope.isPartnerUser = true;
										$scope.rolename = $scope.rolesValue.PARTNER_USER;
									} else {
										$scope.isPartnerAdmin = false;
										$scope.isPartnerUser = false;
									}
								};
								$scope.onConfirm = function(formValid) {

									$scope.submitted = true;
									$scope.isErrorFlag = false;
									if (formValid) {
										var params = {};
										params = $scope.copyValues();

										// var value =
										// $scope.paramsValidate(params);
										// console.log('>>> value=' + value);
										var addInputJson = {};
										addInputJson = params;
										$scope.manageUserpromise = manageUserService
												.onAdd(addInputJson)
												.then(
														function(response) {
															// var result =
															// JSON.parse(response.data).RESULT;
															var result = response.data.result;

															if (result == 'SUCCESS') {
																$scope.isSuccessMsg = true;
																$scope.ccoid = "";
															}
															if (result == 'FAILURE') {
																$scope.isFailedMsg = true;

															}
														});

										// setInterval($scope.onDestroyModalEvent(),20000);
										$scope.isErrorFlag = false;
									} else {
										$scope.isErrorFlag = true;

									}
								};

								$scope.hasError = function() {
									var fields = [ "fullName", "mail",
											"companyName", "street",
											"phoneNumber", "city", "zip",
											"country" ];
									var flag = false;
									for (var i = 0; i < fields.length; i++) {

										if ("invalid" != cleanse(
												$scope.form[fields[i]],
												"invalid")) {

											flag = ($scope.form[fields[i]].$dirty && $scope.form[fields[i]].$invalid)
													|| ($scope.submitted && $scope.form[fields[i]].$invalid);

										}
									}

								};
								$scope.copyValues = function() {
									var addUser = {};
									addUser.userName = $scope.ccoidvalue;

									if ("invalid" == cleanse($scope.fullName,
											"invalid")) {
										addUser.fullName = $scope.userinput.fullName;
									} else {
										addUser.fullName = $scope.fullName;
									}
									if ("invalid" == cleanse($scope.mail,
											"invalid")) {
										addUser.mail = $scope.userinput.mail;
									} else {
										addUser.mail = $scope.mail;
									}

									if ("invalid" == cleanse(
											$scope.phoneNumber, "invalid")) {
										addUser.phoneNumber = $scope.userinput.phoneNumber;
									} else {
										addUser.phoneNumber = $scope.phoneNumber;
									}
									if ("invalid" == cleanse($scope.street,
											"invalid")) {
										addUser.street = $scope.userinput.street;
									} else {
										addUser.street = $scope.street;
									}
									if ("invalid" == cleanse($scope.state,
											"invalid")) {
										addUser.state = $scope.userinput.state;
									} else {
										addUser.state = $scope.state;
									}
									if ("invalid" == cleanse($scope.city,
											"invalid")) {
										addUser.city = $scope.userinput.city;
									} else {
										addUser.city = $scope.city;
									}
									if ("invalid" == cleanse($scope.postalCode,
											"invalid")) {
										addUser.postalCode = $scope.userinput.postalCode;
									} else {
										addUser.postalCode = $scope.postalCode;
									}
									addUser.fax = $scope.fax;
									addUser.accessLevel = $scope.accessLevel;
									addUser.role = $scope.rolename;

									return addUser;

								}
								$scope.redirectToLink = function() {
									$window.open($scope.linkAddress, '_blank');
								};

								function onEditDetail(obj) {
									$scope.userid = obj.CCO_ID;
									$scope.fullName = obj.firstName + ' '
											+ obj.lastName;
									$scope.mail = obj.mail;
									$scope.phoneNumber = obj.phoneNumber;
									$scope.street = obj.street;
									$scope.state = obj.state;
									$scope.city = obj.city;
									$scope.zip = obj.postalCode;
									$scope.country = obj.country;
									$scope.accessLevel = obj.accessLevel;
									$scope.companyName = obj.companyName;
									$scope.userid = getUrlParameter('ccoid');
									$scope.isPartnerUser = true;
								}
								;

								$scope.onEditClick = function() {
									var addUser = {};
									addUser.role = $scope.rolename;
									addUser.userName = $scope.userid;

									$scope.manageUserpromise = manageUserService
											.onEdit(addUser)
											.then(
													function(response) {
														var result = response.data.result;
														var isSelfEdit = response.data.selfActionTried;

														isSelfEdit = JSON
																.stringify(isSelfEdit);

														if (isSelfEdit == 'true') {
															$scope.isSelfEditing = true;

														} else {
															$scope.isSelfEditing = false;

															if (result == 'SUCCESS') {
																$scope.isSuccessMsg = true;
															}

															if (result == 'FAILURE') {
																$scope.isFailedMsg = true;
															}
														}

													});
								};

								$scope.deleteConfirm = function() {
									var ccoidArray = $scope.seletedUsers
											.split(', ');

									$scope.manageUserpromise = manageUserService
											.onDelete(ccoidArray)
											.then(
													function(response) {
														$scope.confirmed = true;

														if (response != null) {

															var result = response.data.result;
															var deleted = response.data.deletedCCOIds;
															var failed = response.data.failedToGetDeleteCCOIds;
															var isSelfDelete = response.data.selfActionTried;

															if (JSON
																	.stringify(isSelfDelete) == 'true') {
																$scope.isSelfDeletion = true;
															} else {
																$scope.isSelfDeletion = false;
															}

															if (("invalid" != cleanse(
																	deleted,
																	"invalid"))
																	&& (JSON
																			.stringify(deleted) != "null")) {
																$scope.deletedCCOIds = deleted
																		.join(", ");
																$scope.isSuccessMsg = true;
															} else {
																$scope.deletedCCOIds = "";
																$scope.isSuccessMsg = false;
															}
															if (("invalid" != cleanse(
																	failed,
																	"invalid"))
																	&& (JSON
																			.stringify(failed) != "null")) {
																if (failed.length == 1
																		&& $scope.isSelfDeletion == true) {
																	$scope.isSelfDeletionOnly = true;
																} else {
																	$scope.isSelfDeletionOnly = false;
																}
																$scope.failedToGetDeleteCCOIds = failed
																		.join(", ");
																$scope.isFailedMsg = true;
															} else {
																$scope.confirmed = false;
																$scope.failedToGetDeleteCCOIds = "";
																$scope.isFailedMsg = false;
															}

														}
													});

								}

								function getUrlParameter(sParam) {
									var sPageURL = decodeURIComponent(window.location.search
											.substring(1)), sURLVariables = sPageURL
											.split('&'), sParameterName, i;

									for (i = 0; i < sURLVariables.length; i++) {
										sParameterName = sURLVariables[i]
												.split('=');

										if (sParameterName[0] === sParam) {
											return sParameterName[1] === undefined ? true
													: sParameterName[1];
										}
									}
								}

							} ])
			.config(
					[
							'$translateProvider',
							function($translateProvider) {
								var enBundle = {
									"USER_INFO" : "User Info :",
									"USER_ID" : "User ID :",
									"NAME" : "Name :",
									"COMPANY" : "Company/ Organization :",
									"PHONENUMBER" : "Phone Number :",
									"EMAIL" : "Email :",
									"BUIS_ADDRESS" : "Business Address :",
									"CITY" : "City :",
									"ZIP" : "Postal Code :",
									"COUNTRY" : "Country :",
									"STREET" : "Street :",
									"STATE" : "State :",
									"ACCESS_LEVEL" : "Access Level :",
									"SEL_ROLE" : "Select a Role :",
									"EDIT" : "Edit",
									"CANCEL" : "Cancel",
									"ENTER_CCOID" : "Enter CCO ID :",
									"CONFIRM" : "Confirm",
									"VERIFY" : "Verify User",
									"OK" : "OK",
									"LEVEL" : "Level",
									"PARTNER" : "(Partner)",
									"DEF_CCOID_CONTENT" : "Enter CCO ID of the User and click Verify User to view the user info for verification.",
									"USER_NOTE" : "Partner Admin has access to all customers on the contracts and Partner User can be restricted.",
									"VALIDATE_CCOID" : "Please enter CCO ID.",
									"PREVLG_PART_ADMIN" : "Partner admin can access all the LNP.",
									"PREVLG_PART_USER" : "Partner users can only view reports, services and access all inventories.",
									"PREVLG_CUST_USER" : "Customer user does not have the privileges to Add/Delete/Edit user.",
									"LINK" : "Link",
									"ADDED_SUCC_MSG" : "New User added successfully.",
									"ADDED_FAILED_MSG" : "Adding user failed.Please open a support case.",
									"DELETION_SUCC_MSG" : "Deletion(s) successful",
									"DELETION_FAIL_MSG" : "Deletion(s) failed.Please open a support case.",
									"SELF_DELETION_FAIL_MSG" : "Deletion(s) failed.",
									"VALIDATE_FORMFIELD" : "* indicates mandatory fields",
									"NOT_VALID_ZIP" : "Invalid Postal Code.",
									"NOT_VALID_PHNO" : "Invalid Phone Number.",
									"NOT_VALID_EMAIL" : "Invalid Email id.",
									"NOT_VALID_USERID" : "Invalid CCO ID.",
									"NOT_VALID_NAME" : "Invalid Name.",
									"SELF_SRVC_TOOL" : "Self Service Tool",
									"DELETE_USER_CONFIRMATION" : "Click Confirm to delete the selected user(s).",
									"EDIT_SUCC_MSG" : "User role updated successfully.",
									"EDIT_UNPRIVILAGED_MSG" : "Customer User role cannot be edited.",
									"EDIT_FAILED_MSG" : "Updating User failed.Please open a support case.",
									"SELF_DELETION_MSG" : "Note: Logged in user, cannot be deleted.",
									"SELF_EDIT_MSG" : "Edit User failed. User is currently logged in."

								};

								$translateProvider.translations('en', enBundle);
								$translateProvider.preferredLanguage('en');
								$translateProvider.fallbackLanguage('en');
								// this is not working currently, may be it
								// will be fixed soon
								// $translateProvider.translationNotFoundIndicator('X');
								$translateProvider
										.useSanitizeValueStrategy('sanitize');
							} ]);
})(angular);