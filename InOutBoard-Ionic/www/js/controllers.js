angular.module('inoutlist.controllers', [])

.controller('PeopleCtrl', function ($scope, People) {
    $scope.People = People;
    $scope.update = function () {
        People.update($scope);
    };
})

.controller('PeopleDetailCtrl', function ($scope, $stateParams, People) {
    $scope.person = People.get($stateParams.id);
    $scope.People = People;

    $scope.update = function () {
        People.update();
    };
})

.controller('MeCtrl', function ($scope, People, $ionicPopup) {

    $scope.People = People;

    $scope.getMe = function () {
        $scope.me = People.get(People.me.id);
        return $scope.me;
    };

    $scope.update = function () {
        People.update();
    };

    $scope.submit = function () {
        People.put($scope.me);
    };

    $scope.submitStatus = function (status) {
        $scope.me.person.Status = status;
        updateStatus();
        $scope.submit();
    }

    $scope.onSelectChange = function () {
        updateStatus();
    };

    function updateStatus() {
        var status = $scope.me.person.Status;
        switch (status) {
            case 0:
                $scope.me.person.StatusMessage = '';
                $scope.me.person.BackAgainMessage = '';
                break;
            case 3:
                $scope.me.person.BackAgainMessage = ''
            default:
                var option = angular.element(document.querySelector('option[value="' + status + '"]'));
                $scope.me.person.StatusMessage = option[0].label;
                break;
        };
    }
});
