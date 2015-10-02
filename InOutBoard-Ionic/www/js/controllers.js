angular.module('inoutlist.controllers', [])

.controller('PeopleCtrl', function ($scope, People) {
    $scope.people = People.all();
    //$scope.remove = function(chat) {
    //    People.remove(chat);
    //}
})

.controller('PeopleDetailCtrl', function ($scope, $stateParams, People) {
    $scope.person = People.get($stateParams.id);
})

.controller('MeCtrl', function ($scope, People, Adal) {
    $scope.person = {};
    $scope.acquireToken = function () {
        Adal.acquireTokenSilent(function (result) {
            $scope.person.name = result.userInfo.displayableId;
            $scope.$apply();
        });
    };
});
