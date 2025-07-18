const app = angular.module('myApp', []);

app.controller('EvaluationController', function($scope, $http) {
  const teacherName = localStorage.getItem('bonibotTeacherName');
  if(!teacherName){
    window.location.href = '/teacherlogin';
  }
  const { createClient } = supabase;

  const SUPABASE_URL = 'https://jcniptzztdbcgdbngbzy.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjbmlwdHp6dGRiY2dkYm5nYnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjIwNjAsImV4cCI6MjA2Nzc5ODA2MH0.a0l_6vRFyNsINPiYFV28f0pzoj_KUOSsWMV0mt5YsAg';

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

  $scope.waiting = false;
  $scope.chatInput = "";
  $scope.items = [];
  $scope.chosen = true;
  const boturl = 'https://grub-robust-positively.ngrok-free.app/webhook/499cb62d-c3a0-4d83-87a1-f3467f7197a3';

  console.log("Hi!");

  $scope.checkEnter = function(event) {
    if (event.which === 13 && $scope.chatInput.trim() !== "") {
      $scope.sendRequest();
    }
  };

  $scope.sendRequest = function() {
  $scope.waiting = true;
  $scope.chosen = false;
  console.log($scope.chatInput);
  $scope.items.push({ sender: 'kamu', text: $scope.chatInput });
  $scope.textinput = $scope.chatInput;
  $scope.chatInput = "";
  
  $http({
  method: 'POST',
  url: boturl,
  headers: {
    'Content-Type': 'application/json',
      'Authorization': 'LabiraRiset'
  },
  data: {
    chatInput: $scope.textinput
  }
})
.then(async function(response) {
  const output = response.data;
  console.log("Response from server:", output);
  $scope.waiting = false;

  const botResponses = [
    { 
      label: 'FINE TUNED',
      text: output.output.fine_tuned,
    },
    { 
      label: 'RAG',
      text: output.output.rag,
    },
    {        
      label: 'RAG WITH FINE TUNED',
      text: output.output.rag_with_fine_tuned,
    }
  ];

  console.log("Bot responses:", botResponses);

  $scope.items.push({ 
    sender: 'bot', 
    text: botResponses 
  });

  $scope.waiting = false;
})
.catch(function(error) {
        $scope.waiting = false;
        $scope.chosen = true;
        console.error("Error from server:", error);
        $scope.items.push({
            sender: 'botFinal',
            text: 'Maaf, terjadi kesalahan saat menghubungi server. Coba lagi nanti, ya!'
        });
        $scope.$apply(); // Force UI update if needed
    });
  };

$scope.$lastItem = function(index) {
  return index === $scope.items.length - 1;
};

$scope.evalChoose = async function(bubble) {
const addData = {
    teacher: teacherName,
    question: $scope.textinput,
    chosen_answer: bubble.text,
    chosen_label: bubble.label
}

  const { data, error } = await supabaseClient
          .from('questions_teacher') 
          .insert([addData]);

        if (error) {
          alert('Insert error:' + error);
        } else {
            $scope.chosen = true;
            $scope.$apply();
        }
  $scope.chosen = true;
  $scope.$apply();
};

$scope.logout = function() {
    localStorage.removeItem('bonibotTeacherName');
    window.location.href = '/teacherlogin';
};

});
