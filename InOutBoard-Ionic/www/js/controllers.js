angular.module('inoutlist.controllers', [])

.controller('PeopleCtrl', function ($scope, People) {
    $scope.people = People;
    $scope.update = function () {
        People.update($scope);
    };
})

.controller('PeopleDetailCtrl', function ($scope, $stateParams, People) {
    $scope.person = function () {
        return People.get($stateParams.id, $scope);
    };

    $scope.update = function () {
        People.update($scope);
    };

    $scope.isMe = $stateParams.id == People.me.id;
})

.controller('MeCtrl', function ($scope, People, $ionicPopup) {

    $scope.person = function () {
        var me = People.get(People.me.id, $scope);
        $scope.isMe = me != null;
        return me;
    };

    $scope.update = function () {
        People.update($scope);
    };

});
