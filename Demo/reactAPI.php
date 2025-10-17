<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

function testupload() {
    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    if (isset($_FILES['files'])) {  
        if (!is_array($_FILES['files']['name'])) {
            if ($_FILES['files']['error'] === UPLOAD_ERR_OK) {
                $fileName = $_FILES['files']['name'];
                $fileTmpName = $_FILES['files']['tmp_name'];
                $newFileName = uniqid() . '_' . $fileName;
                $uploadPath = $uploadDir . $newFileName;
                
                move_uploaded_file($fileTmpName, $uploadPath);
            }
        }
        else {
            $fileCount = count($_FILES['files']['name']);
            for ($i = 0; $i < $fileCount; $i++) {
                if ($_FILES['files']['error'][$i] === UPLOAD_ERR_OK) {
                    $fileName = $_FILES['files']['name'][$i];
                    $fileTmpName = $_FILES['files']['tmp_name'][$i];
                    $newFileName = uniqid() . '_' . $fileName;
                    $uploadPath = $uploadDir . $newFileName;
                    
                    move_uploaded_file($fileTmpName, $uploadPath);
                }
            }
        }
    }
    
}

$feedBack = ['status' => 400];
$requestData = $_REQUEST;
$actionIndex = (!empty($requestData['action_index']))?$requestData['action_index']:'';
switch (strtolower($actionIndex)) {
    case 'login':
        $username = (!empty($requestData['username']))?$requestData['username']:'';
        $password = (!empty($requestData['password']))?$requestData['password']:'';
        $remember_me = (!empty($requestData['remember_me']))?$requestData['remember_me']:0;
        if(strtolower($username) == 'admin' && $password == 'Abc123') {
            $feedBack['status'] = 200;
            $feedBack['access_token'] = md5(uniqid(rand()));
        }
        else {
            $feedBack['message'] = 'UserID & Password Not Match.';
        }
        break;
    case 'getprofile':
        $feedBack['status'] = 200;
        $feedBack['user'] = 
        [
            'id' => 1,
            'username' => 'Admin',
            'display_name' => '陳大文',
            'telephone' => '12345678',
            'email' => 'admin@demo.com'
        ];
        break;
    case 'update_profile':
        testupload();
        $feedBack['status'] = 200;
        $feedBack['message'] = '項目資料成功更新。';
        $feedBack['user'] = 
        [
            'id' => 1,
            'username' => 'Admin',
            'display_name' => ((!empty($requestData['display_name']))?$requestData['display_name']:''),
            'telephone' => ((!empty($requestData['telephone']))?$requestData['telephone']:''),
            'email' => ((!empty($requestData['email']))?$requestData['email']:''),
        ];
        break;
    default:
        $feedBack['message'] = 'Bad Request 錯誤請求。'; 
}

echo json_encode($feedBack);
exit();
