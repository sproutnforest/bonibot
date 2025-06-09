const app = angular.module('myApp', []);

app.controller('RegisterController', function($scope, $http) {
    $scope.waiting = false;
    const params = new URLSearchParams(window.location.search);
    const model = params.get("model");
    const subject = params.get("subject");
    if(!model){
        window.location.href="/modelmenu"
    }
    if(model==="2" && !subject){
        window.location.href="/subjectmenu"
    }
    $scope.name = "";
    $scope.grade = "";
    $scope.continue = function() {
        console.log($scope.grade);
        console.log(Number($scope.grade));
        if($scope.name==="" || $scope.grade===""){
            alert("Tolong isi nama dan kelas kamu dulu yaa");
        }
        else{
            if(Number($scope.grade)>6 || Number($scope.grade)<1){
                alert("Tolong isi kelas kamu dengan benar yaa, kelas 1-6!")
            }
            else{
                if(model==="2"){
                    window.location.href="/modelk?name=" + $scope.name + "&grade=" + $scope.grade + "&subject=" + subject
                }
                else{
                    window.location.href="/modelj?name=" + $scope.name + "&grade=" + $scope.grade
                }
            }
        }
    }
});
