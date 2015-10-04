angular.module('inoutlist.controllers', [])

.controller('PeopleCtrl', function ($scope, People) {

    People.update(function (people) {
        $scope.people = people;
        $scope.$apply();
    });

    //$scope.remove = function(chat) {
    //    People.remove(chat);
    //}
})

.controller('PeopleDetailCtrl', function ($scope, $stateParams, People) {
    $scope.person = People.get($stateParams.id);
})

.controller('MeCtrl', function ($scope, People) {

    People.update(function (people) {
        $scope.person = People.getMe();
        $scope.$apply();
    });

});
