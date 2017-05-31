app.controller('listCtrl', function($scope, $rootScope, $http, $location) {
	
	$scope.email;
	$scope.userID;

	$http.get('/session').then(function(response) {

		if (response.data.logged_in != true) {
			console.log('Not logged in');
			$location.path('/')
		}

		if (response.data.logged_in == true) {
		
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

			$http.get('/list/' + userIDInit).success(function(response) {
				console.log(response);
				console.log(response.length);
				$scope.fbArrList = [];
				$scope.dispArrList = [];
				$scope.otherArrList = [];

				$scope.fbListPlaceHolder = false;
				$scope.dispListPlaceHolder = false;
				$scope.otherListPlaceHolder = false;

				for (var i = 0; i < response.length; i++) {
					console.log(response[i].category);
					if (response[i].category == "foodandbeverage" && response[i].shopping == 1) {
						$scope.fbArrList.push(response[i]);	
					}

					if (response[i].category == "disposables" && response[i].shopping == 1) {
						$scope.dispArrList.push(response[i]);
					}

					if (response[i].category == "other" && response[i].shopping == 1) {
						$scope.otherArrList.push(response[i]);
					}
				}

				if ($scope.fbArrList.length == 0) {
				 	$scope.fbListPlaceHolder = true;
				}

				if ($scope.dispArrList.length == 0) {
				 	$scope.dispListPlaceHolder = true;
				}

				if ($scope.otherArrList.length == 0) {
				 	$scope.otherListPlaceHolder = true;
				}

				console.log($scope.fbArrList);
				console.log($scope.dispArrList);
				console.log($scope.otherArrList);

			}).error(function(response) {	
				console.log('error: ' + response);
			});

		}
	});

	$scope.buyItem = function(quantity, item) {

		console.log(quantity);
		console.log(item);
		var modItem = item;
		var modQuantity = quantity;
		var userID = $scope.userID;

		$scope.fbListPlaceHolder = false;
		$scope.dispListPlaceHolder = false;
		$scope.otherListPlaceHolder = false;
		$scope.confirmString = '12rABi34cCDh56oEFh';

		$http.post('/buy', {userID: userID, item: modItem, quantity: modQuantity}).success(function(response) {

			console.log(response);

			$http.get('/list/' + userID).success(function(response) {
				console.log(response);
				console.log(response.length);
				$scope.fbArrList = [];
				$scope.dispArrList = [];
				$scope.otherArrList = [];

				for (var i = 0; i < response.length; i++) {
					console.log(response[i].category);
					if (response[i].category == "foodandbeverage" && response[i].shopping == 1) {
						$scope.fbArrList.push(response[i]);	
					}

					if (response[i].category == "disposables" && response[i].shopping == 1) {
						$scope.dispArrList.push(response[i]);
					}

					if (response[i].category == "other" && response[i].shopping == 1) {
						$scope.otherArrList.push(response[i]);
					}
				}

				if ($scope.fbArrList.length == 0) {
			 		$scope.fbListPlaceHolder = true;
				}

				if ($scope.dispArrList.length == 0) {
			 		$scope.dispListPlaceHolder = true;
				}

				if ($scope.otherArrList.length == 0) {
				 	$scope.otherListPlaceHolder = true;
				}

				console.log($scope.fbArrList);
				console.log($scope.dispArrList);
				console.log($scope.otherArrList);

			}).error(function(response) {	
				console.log('error: ' + response);
			});

		}).error(function(response) {
			console.log('error: ' + response);
		})
	}
});