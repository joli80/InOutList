angular.module('inoutlist.controllers', [])

.controller('PeopleCtrl', function ($scope, People) {

    People.register(function (event, people) {
        $scope.people = people;
        $scope.$apply();
    }, 'PeopleCtrl');

    $scope.people = People.getAll();

    //$scope.remove = function(chat) {
    //    People.remove(chat);
    //}
})

.controller('PeopleDetailCtrl', function ($scope, $stateParams, People) {
    $scope.person = People.get($stateParams.id);
})

.controller('MeCtrl', function ($scope, People) {

    $scope.person = People.getMe();

    People.register(function () {
        $scope.person = People.getMe();
        $scope.$apply();
    }, 'PeopleDetailCtrl');

});
