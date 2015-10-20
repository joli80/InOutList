/* global angular */
angular.module('inoutlist.controllers', [])

.controller('PeopleCtrl', function ($scope, People, $ionicModal) {
    $scope.People = People;
    $scope.update = function () {
        People.update($scope);
    };

    $ionicModal.fromTemplateUrl('templates/people-detail.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function (person) {
        $scope.person = person;
        person.getFace();
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
})

.controller('PeopleDetailCtrl', function ($scope, People) {
    $scope.close = function () {
        $scope.modal.hide();
    }
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
            case 1:
            case 3:
                $scope.me.person.BackAgainMessage = ''
            default:
                var option = angular.element(document.querySelector('option[value="' + status + '"]'));
                $scope.me.person.StatusMessage = option[0].label;
                break;
        };
    }
});
