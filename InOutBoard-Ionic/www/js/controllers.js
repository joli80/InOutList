angular.module('inoutlist.controllers', [])

.controller('PeopleCtrl', function ($scope, People) {
    $scope.people = People;


    $scope.update = function () {
        People.update($scope, function () {
            $scope.$broadcast('scroll.refreshComplete');
        }, function (err) {
            $scope.$broadcast('scroll.refreshComplete');
            $ionicPopup.alert({
                title: 'Error',
                template: JSON.stringify(err)
            });
        });
    };

    //$http.get('/new-items')
    // .success(function (newItems) {
    //     $scope.items = newItems;
    // })
    // .finally(function () {
    //     // Stop the ion-refresher from spinning
    //     $scope.$broadcast('scroll.refreshComplete');
    // });
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
