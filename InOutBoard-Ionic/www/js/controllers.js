angular.module('starter.controllers', [])

.controller('PeopleCtrl', function ($scope, People) {
    $scope.people = People.all();
    //$scope.remove = function(chat) {
    //    People.remove(chat);
    //}
})

.controller('PeopleDetailCtrl', function ($scope, $stateParams, People) {
    $scope.person = People.get($stateParams.id);
})

.controller('MeCtrl', function ($scope, People) {
    $scope.person = People.get(0);
});
