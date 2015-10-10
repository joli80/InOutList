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
})

.controller('MeCtrl', function ($scope, People, $ionicPopup) {

    $scope.person = function () {
        return People.get(People.me.id, $scope);
        //return People.me;
    };

    //$scope.people = People;

    $scope.update = function () {
        People.update($scope, null, function (err) {
            //$ionicPopup.alert({
            //    title: 'Error',
            //    template: JSON.stringify(err)
            //});
        });
    };

});
