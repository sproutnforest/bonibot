const app = angular.module('myApp', []);

app.controller('SubjectMenuController', function($scope, $http) {
    $scope.waiting = false;
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const grade = params.get("grade");
    $scope.selectedSubject = "PAI";
    if(!name || !grade){
        window.location.href="/register"
    }
    $scope.continue = function() {
        const selected = $scope.selectedSubject;
        window.location.href="/modelj?name=" + name + "&grade=" + grade + "&subject=" + selected
    }
});
