angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope) { })

.controller('PeopleCtrl', function ($scope, People) {
    $scope.people = People.all();
    //$scope.remove = function(chat) {
    //    People.remove(chat);
    //}
})

.controller('PeopleDetailCtrl', function ($scope, $stateParams, People) {
    $scope.person = People.get($stateParams.id);
})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
