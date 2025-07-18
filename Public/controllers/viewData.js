const app = angular.module('myApp', []);

app.controller('ViewDataController', function($scope, $http) {
  const teacherName = localStorage.getItem('bonibotTeacherName');
  if(!teacherName){
    window.location.href = '/teacherlogin';
  }
  const { createClient } = supabase;

  const SUPABASE_URL = 'https://jcniptzztdbcgdbngbzy.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjbmlwdHp6dGRiY2dkYm5nYnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjIwNjAsImV4cCI6MjA2Nzc5ODA2MH0.a0l_6vRFyNsINPiYFV28f0pzoj_KUOSsWMV0mt5YsAg';

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

  $scope.waiting = true;

  $scope.getData = async function() {
    const { data, error } = await supabaseClient
      .from('questions_student')
      .select('*');
      console.log("Data fetched:", data);

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      const cleanedData = data.map(item => {
        return {
          student: item.student,
          grade: item.grade,
          subject: item.subject,
          question: item.question,
          answer: item.answer
        };
      });
      $scope.$apply(() => {
        $scope.items = cleanedData;
        $scope.waiting = false;
    });
    }
  };

  $scope.getData();

  $scope.exportToExcel = function() {
  try {
    if (!$scope.items || $scope.items.length === 0) {
      throw new Error("Data kosong atau belum dimuat.");
    }

    const raw = JSON.parse(JSON.stringify($scope.items));

    const cleanedData = raw.map(item => {
      const { student, grade, subject, question, answer } = item;
      return { student, grade, subject, question, answer };
    });

    const worksheet = XLSX.utils.json_to_sheet(cleanedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    XLSX.writeFile(workbook, "bonibot-chat-data.xlsx");
  } catch (error) {
    console.log("Export error:", error.message);
    alert("Gagal ekspor data: " + error.message);
  }
};

$scope.logout = function() {
    localStorage.removeItem('bonibotTeacherName');
    window.location.href = '/teacherlogin';
};

});
