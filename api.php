<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Verifica se o parâmetro phone existe
if (!isset($_GET['phone']) || empty($_GET['phone'])) {
    echo json_encode([
        "success" => false,
        "error" => "Parâmetro 'phone' não informado."
    ]);
    exit;
}

$phone = $_GET['phone'];
$url = "https://whatsapp-data1.p.rapidapi.com/number/$phone";

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTPHEADER => [
        "X-RapidAPI-Key: 3dc526328fmsh7055714035c812bp1b3352jsn12f0e2215593",
        "X-RapidAPI-Host: whatsapp-data1.p.rapidapi.com"
    ]
]);

$response = curl_exec($curl);
$error = curl_error($curl);
curl_close($curl);

if ($error) {
    echo json_encode([
        "success" => false,
        "error" => $error
    ]);
    exit;
}

echo $response;
?>
