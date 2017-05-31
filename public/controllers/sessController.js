app.controller('sessCtrl', function($scope, $rootScope, $http, $sce, $location) {

	$scope.email;
	$scope.userID;

	$http.get('/session').then(function(response) {

		console.log(response.data);

		if (response.data.logged_in != true) {
			console.log('Not logged in');
			$location.path('/')
		}

		console.log('Session email: ' + response.data.user_email);
		console.log('Session id: ' + response.data.user_id);

		$rootScope.userEmail = response.data.user_email;
		$rootScope.userInfo = true;
		$rootScope.logMenu = true;
		$rootScope.defBrand = false;
		$rootScope.loginBrand = true;
		$rootScope.resBtn = true;

		$scope.email = response.data.user_email;
		$scope.userID = response.data.user_id;

		var userIDInit = response.data.user_id;

		$http.get('/inventory/' + userIDInit).success(function(response) {
			console.log(response);
			console.log(response.length);
			$scope.fbArr = [];
			$scope.dispArr = [];
			$scope.otherArr = [];
			
			$scope.FBplaceHolder = false;
			$scope.dispPlaceHolder = false;
			$scope.otherPlaceHolder = false;

			for (var i = 0; i < response.length; i++) {
				console.log(response[i].category);
				if (response[i].category == "foodandbeverage" && response[i].shopping == 0) {
					$scope.fbArr.push(response[i]);	
				}

				if (response[i].category == "disposables" && response[i].shopping == 0) {
					$scope.dispArr.push(response[i]);
				}

				if (response[i].category == "other" && response[i].shopping == 0) {
					$scope.otherArr.push(response[i]);
				}
			}

			if ($scope.fbArr.length == 0) {
			 	$scope.FBplaceHolder = true;
			}

			if ($scope.dispArr.length == 0) {
			 	$scope.dispPlaceHolder = true;
			}

			if ($scope.otherArr.length == 0) {
			 	$scope.otherPlaceHolder = true;
			}

		}).error(function(response) {	
			console.log('error: ' + response);
		});
	
	});

	$scope.submitItem = function() {

		var userID = $scope.userID;
		var email = $scope.email;
		var item = $scope.item;
		var category = $scope.category;
		var quantity = $scope.quantity;

		$scope.FBplaceHolder = false;
		$scope.dispPlaceHolder = false;
		$scope.otherPlaceHolder = false;

		$http.post('/itemcreate', {userID: userID, email: email, item: item, category: category, quantity: quantity}).success(function(response) {

			console.log(response);
			$scope.item = "";
			$scope.category = "";
			$scope.quantity = "";

		}).error(function(response) {
			console.log('error: ' + response);
		})

		$http.get('/inventory/' + userID).success(function(response) {
			console.log(response);
			console.log(response.length);
			$scope.fbArr = [];
			$scope.dispArr = [];
			$scope.otherArr = [];

			for (var i = 0; i < response.length; i++) {
				console.log(response[i].category);
				if (response[i].category == "foodandbeverage" && response[i].shopping == 0) {
					$scope.fbArr.push(response[i]);	
				}

				if (response[i].category == "disposables" && response[i].shopping == 0) {
					$scope.dispArr.push(response[i]);
				}

				if (response[i].category == "other" && response[i].shopping == 0) {
					$scope.otherArr.push(response[i]);
				}
			}

			if ($scope.fbArr.length == 0) {
			 	$scope.FBplaceHolder = true;
			}

			if ($scope.dispArr.length == 0) {
			 	$scope.dispPlaceHolder = true;
			}

			if ($scope.otherArr.length == 0) {
			 	$scope.otherPlaceHolder = true;
			}

		}).error(function(response) {	
			console.log('error: ' + response);
		});


	}

	$scope.delete = function(itemID) {

		console.log('click');
		var userID = $scope.userID;

		$scope.FBplaceHolder = false;
		$scope.dispPlaceHolder = false;
		$scope.otherPlaceHolder = false;
		$scope.confirmString = '12rABi34cCDh56oEFh';

		$http.post('/delete/' + itemID).success(function(response){
			console.log(response);

			$http.get('/inventory/' + userID).success(function(response) {
			console.log(response);
			console.log(response.length);
			$scope.fbArr = [];
			$scope.dispArr = [];
			$scope.otherArr = [];

			for (var i = 0; i < response.length; i++) {
				console.log(response[i].category);
				if (response[i].category == "foodandbeverage" && response[i].shopping == 0) {
					$scope.fbArr.push(response[i]);	
				}

				if (response[i].category == "disposables" && response[i].shopping == 0) {
					$scope.dispArr.push(response[i]);
				}

				if (response[i].category == "other" && response[i].shopping == 0) {
					$scope.otherArr.push(response[i]);
				}
			}

			if ($scope.fbArr.length == 0) {
			 	$scope.FBplaceHolder = true;
			}

			if ($scope.dispArr.length == 0) {
			 	$scope.dispPlaceHolder = true;
			}

			if ($scope.otherArr.length == 0) {
			 	$scope.otherPlaceHolder = true;
			}

			}).error(function(response) {	
				console.log('error: ' + response);
			});
		
		}).error(function(response){
			console.log('error' + response);
		});

		
	}

	$scope.incItem = function(item, quantity) {

		console.log(item);
		console.log(quantity);
		var modItem = item;
		var modQuantity = quantity;
		var userID = $scope.userID;

		$http.post('/itemamt', {userID: userID, item: modItem, quantity: modQuantity}).success(function(response) {

			console.log(response)
		
		}).error(function(response) {
			console.log('error: ' + response);
		})
	}

	$scope.decItem = function(item, quantity) {

		console.log(item);
		console.log(quantity);
		var modItem = item;
		var modQuantity = quantity;
		var userID = $scope.userID;

		$scope.FBplaceHolder = false;
		$scope.dispPlaceHolder = false;
		$scope.otherPlaceHolder = false;

		$http.post('/itemamtdec', {userID: userID, item: modItem, quantity: modQuantity}).success(function(response) {

			console.log(response)

			$http.get('/inventory/' + userID).success(function(response) {
				console.log(response);
				console.log(response.length);
				$scope.fbArr = [];
				$scope.dispArr = [];
				$scope.otherArr = [];

				for (var i = 0; i < response.length; i++) {
					console.log(response[i].category);
					if (response[i].category == "foodandbeverage" && response[i].shopping == 0) {
						$scope.fbArr.push(response[i]);	
					}

					if (response[i].category == "disposables" && response[i].shopping == 0) {
						$scope.dispArr.push(response[i]);
					}

					if (response[i].category == "other" && response[i].shopping == 0) {
						$scope.otherArr.push(response[i]);
					}
				}

				if ($scope.fbArr.length == 0) {
				 	$scope.FBplaceHolder = true;
				}

				if ($scope.dispArr.length == 0) {
				 	$scope.dispPlaceHolder = true;
				}

				if ($scope.otherArr.length == 0) {
				 	$scope.otherPlaceHolder = true;
				}

			}).error(function(response) {	
				console.log('error: ' + response);
			});
		
		}).error(function(response) {
			console.log('error: ' + response);
		})
	}

	$scope.sortABC = function() {

		var userID = $scope.userID;
		console.log('Sort user ID ' + userID);
		$scope.FBplaceHolder = false;
		$scope.dispPlaceHolder = false;
		$scope.otherPlaceHolder = false;

		$http.get('/sortAlpha/' + userID).success(function(response) {
			console.log(response);
			console.log(response.length);
				$scope.fbArr = [];
				$scope.dispArr = [];
				$scope.otherArr = [];

				for (var i = 0; i < response.length; i++) {
					console.log(response[i].category);
					if (response[i].category == "foodandbeverage" && response[i].shopping == 0) {
						$scope.fbArr.push(response[i]);	
					}

					if (response[i].category == "disposables" && response[i].shopping == 0) {
						$scope.dispArr.push(response[i]);
					}

					if (response[i].category == "other" && response[i].shopping == 0) {
						$scope.otherArr.push(response[i]);
					}
				}

				if ($scope.fbArr.length == 0) {
				 	$scope.FBplaceHolder = true;
				}

				if ($scope.dispArr.length == 0) {
				 	$scope.dispPlaceHolder = true;
				}

				if ($scope.otherArr.length == 0) {
				 	$scope.otherPlaceHolder = true;
				}

			}).error(function(response) {	
				console.log('error: ' + response);
			});
		}

	$scope.sortNumA = function() {

		var userID = $scope.userID;
		console.log('Sort user ID ' + userID);
		$scope.FBplaceHolder = false;
		$scope.dispPlaceHolder = false;
		$scope.otherPlaceHolder = false;

		$http.get('/sortQuantA/FB/' + userID).success(function(response) {
			console.log(response);
			console.log(response.length);
				$scope.fbArr = [];

			for (var i = 0; i < response.length; i++) {	
				$scope.fbArr.push(response[i]);
			}	

			if ($scope.fbArr.length == 0) {
				 $scope.FBplaceHolder = true;
			}

			}).error(function(response) {	
				console.log('error: ' + response);
			});

		$http.get('/sortQuantA/Disp/' + userID).success(function(response) {
			console.log(response);
			console.log(response.length);
				$scope.dispArr = [];

			for (var i = 0; i < response.length; i++) {	
				$scope.dispArr.push(response[i]);	
			}

			if ($scope.dispArr.length == 0) {
				 $scope.dispPlaceHolder = true;
			}

			}).error(function(response) {	
				console.log('error: ' + response);
			});

		$http.get('/sortQuantA/Other/' + userID).success(function(response) {
			console.log(response);
			console.log(response.length);
				$scope.otherArr = [];

			for (var i = 0; i < response.length; i++) {	
				$scope.otherArr.push(response[i]);	
			}

			if ($scope.otherArr.length == 0) {
				 $scope.otherPlaceHolder = true;
			}

			}).error(function(response) {	
				console.log('error: ' + response);
			});	

		}

	$scope.sortNumD = function() {

		var userID = $scope.userID;
		console.log('Sort user ID ' + userID);
		$scope.FBplaceHolder = false;
		$scope.dispPlaceHolder = false;
		$scope.otherPlaceHolder = false;

		$http.get('/sortQuantD/FB/' + userID).success(function(response) {
			console.log(response);
			console.log(response.length);
				$scope.fbArr = [];
			
			for (var i = 0; i < response.length; i++) {	
				$scope.fbArr.push(response[i]);	
			}

			}).error(function(response) {	
				console.log('error: ' + response);
			});

		$http.get('/sortQuantD/Disp/' + userID).success(function(response) {
			console.log(response);
			console.log(response.length);
				$scope.dispArr = [];

			for (var i = 0; i < response.length; i++) {	
				$scope.dispArr.push(response[i]);	
			}

			}).error(function(response) {	
				console.log('error: ' + response);
			});

		$http.get('/sortQuantD/Other/' + userID).success(function(response) {
			console.log(response);
			console.log(response.length);
				$scope.otherArr = [];

			for (var i = 0; i < response.length; i++) {

				$scope.otherArr.push(response[i]);	
			}

			}).error(function(response) {	
				console.log('error: ' + response);
			});	
		
		}

});