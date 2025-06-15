const app = angular.module('myApp', []);

app.controller('ModelKController', function($scope, $http) {
  $scope.waiting = false;
  const params = new URLSearchParams(window.location.search);
  const subject = params.get("subject");
  const student = params.get("name");
  const grade = params.get("grade");
  if(!subject){
    window.location.href = "/subjectmenu";
  }
  if(!student || !grade){
    window.location.href = "/register?model=2&subject=" + subject;
  }
  $scope.chatInput = "";
  $scope.items = [];
  // const boturl = 'https://bonibot.vibindo.com/api/chat';
  const boturl = 'https://bebonibot.vibindo.com';

  console.log("Hi!");

  $scope.checkEnter = function(event) {
    if (event.which === 13 && $scope.chatInput.trim() !== "") {
      $scope.sendRequest();
    }
  };

  $scope.sendRequest = function() {
    $scope.waiting = true;
    console.log($scope.chatInput);
    $scope.items.push({ sender: 'kamu', text: $scope.chatInput });
    let textinput = $scope.chatInput;
    $scope.chatInput = "";

    $http({
      method: 'POST',
      url: boturl, 
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        client_id: "labira1bonibot88",
        subject: subject,
        question: textinput,
      }
    }).then(function(responded) {
        console.log("Response from server:", responded.data);
      $scope.result = responded.data.output.response;
        console.log("Result:", $scope.result);
      $scope.items.push({ sender: 'bot', text: $scope.result });
      $scope.waiting = false;

      const addData = {
      student: student,
      grade: grade,
      subject: subject,
      question: textinput,
      answer: $scope.result
    }

    $http.post('http://103.75.25.77:8301/addData', addData)
    .then(function(response) {
      console.log('Data added:', response.data);
    })
    .catch(function(error) {
      console.error('Error adding data:', error);
    });

    }, function(error) {
      console.error("Request failed:", error);
      $scope.result = "Terjadi kesalahan";
      $scope.waiting = false;
    });
  };
});
