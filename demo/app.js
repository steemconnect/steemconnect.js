sc2.init({
  baseURL: 'http://localhost:3000',
  app: 'busy.app',
  callbackURL: 'http://localhost:8000/demo',
  scope: ['vote', 'comment']
});

angular.module('app', [])
  .config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true);
  }])
  .controller('Main', function($scope, $location, $http) {
    $scope.accessToken = $location.search().access_token;
    $scope.expiresIn = $location.search().expires_in;
    $scope.loginURL = sc2.getLoginURL();

    if ($scope.accessToken) {
      sc2.setAccessToken($scope.accessToken);
      sc2.me(function (err, result) {
        console.log('/me', err, result);
        if (!err) {
          $scope.user = result.account;
          $scope.$apply();
        }
      });
    }

    this.vote = function() {
      sc2.vote($scope.user.name, 'siol', 'test', 100, function (err, result) {
        console.log('You successfully vote for @siol/test', err, result);
      });
    };

    this.logout = function() {
      sc2.revokeToken(function (err, result) {
        console.log('You successfully logged out', err, result);
        delete $scope.user;
        delete $scope.accessToken;
        $scope.$apply();
      });
    };
  });
