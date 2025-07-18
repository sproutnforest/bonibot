const app = angular.module('myApp', []);

app.controller('RegisterController', function($scope, $http) {
    const { createClient } = supabase;

    const SUPABASE_URL = 'https://jcniptzztdbcgdbngbzy.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjbmlwdHp6dGRiY2dkYm5nYnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjIwNjAsImV4cCI6MjA2Nzc5ODA2MH0.a0l_6vRFyNsINPiYFV28f0pzoj_KUOSsWMV0mt5YsAg';

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

    $scope.name = "";
    $scope.email = "";
    $scope.password = "";

    // Try both possible globals
    const bcrypt = window.dcodeIO && window.dcodeIO.bcrypt;

    $scope.continue = async function() {
    if ($scope.name === "" || $scope.email === "" || $scope.password === "") {
        alert("Tolong isi nama, email, dan password kamu dulu yaa");
    } else {   
         const { data, error } = await supabaseClient
                .from('teachers')
                .select('*')
                .eq('email', $scope.email)
                .single();

            if (error) {
                try {

            const salt = bcrypt.genSaltSync(10);  
            const hashedPassword = bcrypt.hashSync($scope.password, salt);

            const addData = {
                name: $scope.name,
                email: $scope.email,
                password: hashedPassword, 
            };

            const { data, error } = await supabaseClient
                .from('teachers')
                .insert([addData]);

            if (error) {
                alert('Gagal daftar, mohon coba lagi nanti: ' + error.message);
            } else {
                window.location.href = '/teacherlogin';
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("Terjadi error teknis: " + err.message);
        }
            }
        else{
            alert("Email sudah terdaftar, silakan gunakan email lain.");
        }
        
    }
};
});