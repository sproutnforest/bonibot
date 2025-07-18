const app = angular.module('myApp', []);

app.controller('RegisterController', function($scope, $http) {
    $scope.waiting = false;
    const params = new URLSearchParams(window.location.search);
    const model = params.get("model");
    if(!model){
        window.location.href="/modelmenu"
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
            if(isNaN($scope.grade)){
                alert("Tolong isi kelas kamu dengan benar yaa, kelas 1-6!")
            }
            else{
                if(model==="2"){
                    window.location.href="/subjectmenu?name=" + $scope.name + "&grade=" + $scope.grade 
                }
                else{
                    window.location.href="/modelj?name=" + $scope.name + "&grade=" + $scope.grade
                }
            }
        }
    }
});
