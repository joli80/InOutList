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

.controller('MeCtrl', function ($scope, People, Adal) {
    $scope.person = {};
    $scope.acquireToken = function () {
        Adal.authenticate(function (result) {
            $scope.person.name = result.userInfo.displayableId;
            $scope.$apply();

            Adal.getUsers(result);

        });
    };
});
