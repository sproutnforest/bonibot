const app = angular.module('myApp', []);

app.controller('ModelKController', function($scope, $http) {
  const { createClient } = supabase;

  const SUPABASE_URL = 'https://jcniptzztdbcgdbngbzy.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjbmlwdHp6dGRiY2dkYm5nYnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjIwNjAsImV4cCI6MjA2Nzc5ODA2MH0.a0l_6vRFyNsINPiYFV28f0pzoj_KUOSsWMV0mt5YsAg';

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

  $scope.waiting = false;
  const params = new URLSearchParams(window.location.search);
  $scope.subject = params.get("subject");
  const student = params.get("name");
  const grade = params.get("grade");
  if(!$scope.subject){
    window.location.href = "/subjectmenu";
  }
  if(!student || !grade){
    window.location.href = "/register?model=2&subject=" + $scope.subject;
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

  $scope.sendRequest = async function() {
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
        subject: $scope.subject,
        question: textinput,
      }
    }).then(async function(responded) {
        console.log("Response from server:", responded.data);
      $scope.result = responded.data.output.response;
        console.log("Result:", $scope.result);
      $scope.items.push({ sender: 'bot', text: $scope.result });
      $scope.waiting = false;

       const addData = {
          student: student,
          grade: Number(grade),
          subject: $scope.subject,
          question: textinput,
          answer: $scope.result
        };

        const { data, error } = await supabaseClient
        .from('questions_student') 
        .insert([addData]);

      if (error) {
        console.error('Insert error:', error);
      } else {
        console.log('Insert success:', data);
      }

      $scope.$apply(() => {
        $scope.waiting = false;
      });
    });
  };
});
