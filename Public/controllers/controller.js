const app = angular.module('myApp', []);

app.controller('MyController', function($scope, $http) {
  $scope.chatInput = "";
  $scope.items = []; // ✅ Tambahkan inisialisasi ini!

  console.log("Hi!");

  $scope.checkEnter = function(event) {
    if (event.which === 13 && $scope.chatInput.trim() !== "") {
      $scope.sendRequest();
    }
  };


  $scope.sendRequest = function() {
    console.log($scope.chatInput);
    $scope.items.push({ sender: 'kamu', text: $scope.chatInput });
    let textinput = $scope.chatInput;
    $scope.chatInput = "";
    $http({
      method: 'POST',
      url: 'https://grub-robust-positively.ngrok-free.app/webhook/463f793b-84f0-4290-b6bf-cf25963ac597',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'LabiraRiset'
      },
      data: {
        chatInput: textinput
      }
    }).then(function(response) {
      $scope.result = response.data.final_output;

      $scope.items.push({ sender: 'bot', text: $scope.result });

    }, function(error) {
      console.error("Request failed:", error);
      $scope.result = "Terjadi kesalahan";
    });
  };
});
