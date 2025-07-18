const app = angular.module('myApp', []);

app.controller('RegisterController', function($scope, $http) {
    const { createClient } = supabase;

    const SUPABASE_URL = 'https://jcniptzztdbcgdbngbzy.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjbmlwdHp6dGRiY2dkYm5nYnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjIwNjAsImV4cCI6MjA2Nzc5ODA2MH0.a0l_6vRFyNsINPiYFV28f0pzoj_KUOSsWMV0mt5YsAg';

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

    $scope.email = "";
    $scope.password = "";

    $scope.continue = async function() {
        const bcrypt = window.dcodeIO && window.dcodeIO.bcrypt;

        if ($scope.email === "" || $scope.password === "") {
            alert("Tolong isi email dan password kamu dulu yaa");
            return;
        }

        try {
            const { data, error } = await supabaseClient
                .from('teachers')
                .select('*')
                .eq('email', $scope.email)
                .single();

            if (error) {
                console.error(error);
                alert("Email tidak ditemukan.");
                return;
            }

            if (bcrypt && bcrypt.compareSync($scope.password, data.password)) {
                localStorage.setItem('bonibotTeacherName', data.name);
                window.location.href = '/teachermenu';
            } else {
                alert("Password salah!");
            }
        } catch (err) {
            alert("Unexpected error:" + err);
        }
    };

});