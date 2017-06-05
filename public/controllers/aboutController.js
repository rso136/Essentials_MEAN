app.controller('aboutCtrl', function($scope, $rootScope, $http, $location) {

$http.get('/session').then(function(response) {

		if (response.data.logged_in != true) {
			console.log('Not logged in');
			$location.path('/')
		}
});

});