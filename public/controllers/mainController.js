app.controller('mainCtrl', function($scope, $http, $sce, $location) {

	$scope.email;
	$scope.pass;
	$scope.test = 'Testing';

	$scope.signup = function() {

		var email = $scope.email;
		var pass = $scope.pass;

		if ($scope.pass != $scope.confirm) {
			$scope.mismatch = true;
		}

		if ($scope.pass == $scope.confirm) {

			 $http.post('/create', {email: email, pass: pass}).success(function(response){
			 	console.log('response: ' + response);
			 	console.log('hi');
			 	
			 	if (response == 'User created') {
			 		$location.path("/usercreated");
			 	}
			 	if (response == 'User already exists') {
			 		$location.path("/userexists");
			 	}
			 }).error(function(response) {
			 	console.log('error: ' + response);
			 });

		}
	}

	$scope.login = function() {

		var userEmail = $scope.userEmail;
		var userPass = $scope.userPass;

		$http.post('/login', {email: userEmail, pass: userPass}).success(function(response) {

			if (response == 'User not found') {
				$location.path("/nouser");
			}

			if (response == 'Password incorrect') {
				$location.path("/nouser");
			}

			if (response == 'Login successful') {
				$location.path("/home");
			}

		}).error(function(response) {
			console.log('error: ' + response);
		});
	}

	$scope.guestLogin = function() {

		var guestEmail = "guest@user.com";
		var guestPass = "1234";

		$http.post('/login', {email: guestEmail, pass: guestPass}).success(function(response) {

			if (response == 'User not found') {
				$location.path("/nouser");
			}

			if (response == 'Login successful') {
				$location.path("/home");
			}

		}).error(function(response) {
			console.log('error: ' + response);
		});
	}

});