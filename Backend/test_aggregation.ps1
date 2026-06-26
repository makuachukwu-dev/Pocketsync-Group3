$ErrorActionPreference = "Stop"

Write-Host "1. Registering user 'Chinedu'..."
$reg = Invoke-RestMethod -Uri "http://localhost:3000/register" -Method Post -ContentType "application/json" -Body '{"name":"Chinedu","email":"chinedu_test@example.com","password":"mypassword"}' -SessionVariable mySession
$reg | ConvertTo-Json

Write-Host "`n2. Attempting to link GTBank account (expecting KYC block)..."
try {
    $res = Invoke-RestMethod -Uri "http://localhost:3000/accounts/connect" -Method Post -ContentType "application/json" -Body '{"institutionId":"gtbank","username":"chinedu123","password":"password123","agreedToConsent":true}' -WebSession $mySession
    Write-Host "Success (unexpected):"
    $res | ConvertTo-Json
} catch {
    Write-Host "Blocked as expected (403 Forbidden):"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $response = $reader.ReadToEnd()
    $response
}

Write-Host "`n3. Verifying KYC (using 11-digit BVN)..."
$kyc = Invoke-RestMethod -Uri "http://localhost:3000/kyc/verify" -Method Post -ContentType "application/json" -Body '{"bvn":"12345678901"}' -WebSession $mySession
$kyc | ConvertTo-Json

Write-Host "`n4. Attempting to link GTBank account again (expecting success)..."
$connect1 = Invoke-RestMethod -Uri "http://localhost:3000/accounts/connect" -Method Post -ContentType "application/json" -Body '{"institutionId":"gtbank","username":"chinedu123","password":"password123","agreedToConsent":true}' -WebSession $mySession
$connect1 | ConvertTo-Json

Write-Host "`n5. Attempting to link Kuda account (expecting success)..."
$connect2 = Invoke-RestMethod -Uri "http://localhost:3000/accounts/connect" -Method Post -ContentType "application/json" -Body '{"institutionId":"kuda","username":"chinedu_kuda","password":"password_kuda","agreedToConsent":true}' -WebSession $mySession
$connect2 | ConvertTo-Json

Write-Host "`n6. Checking Dashboard Summary (expecting aggregated balance)..."
$dashboard = Invoke-RestMethod -Uri "http://localhost:3000/dashboard" -Method Get -WebSession $mySession
$dashboard | ConvertTo-Json

Write-Host "`n7. Disconnecting GTBank Account..."
$accountId = $connect1.account.id
$disconnect = Invoke-RestMethod -Uri "http://localhost:3000/accounts/$accountId" -Method Delete -WebSession $mySession
$disconnect | ConvertTo-Json

Write-Host "`n8. Checking Dashboard Summary again (expecting only Kuda left)..."
$dashboard2 = Invoke-RestMethod -Uri "http://localhost:3000/dashboard" -Method Get -WebSession $mySession
$dashboard2 | ConvertTo-Json
