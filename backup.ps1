# ==============================
# backup.ps1 : Backup MongoDB
# ==============================

# สร้าง timestamp เพื่อใส่ชื่อโฟลเดอร์
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "dump\backup-$timestamp"

# สร้างโฟลเดอร์บนเครื่อง Windows ถ้ายังไม่มี
if (-Not (Test-Path -Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# รัน mongodump ภายใน container แล้ว mount กลับมาที่ path ที่ Windows เห็นได้
docker exec Mongo mongodump --db Benjaphan --out "/dump/backup-$timestamp"

# แจ้งผล
Write-Output "✅ Backup MongoDB เสร็จแล้วที่ $backupDir"
