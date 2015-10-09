angular.module('inoutlist.controllers', [])

.controller('PeopleCtrl', function ($scope, People) {
    $scope.people = People;

    $scope.update = function () {
        People.update($scope, null, function (err) {
            $ionicPopup.alert({
                title: 'Error',
                template: JSON.stringify(err)
            });
        });
    };

})

.controller('PeopleDetailCtrl', function ($scope, $stateParams, People) {
    $scope.person = People.get($stateParams.id);
})

.controller('MeCtrl', function ($scope, People, $ionicPopup) {

    $scope.people = People;

    $scope.update = function () {
        People.update($scope, null, function (err) {
            $ionicPopup.alert({
                title: 'Error',
                template: JSON.stringify(err)
            });
        });
    };

});
