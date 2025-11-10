# Auto-organize cameras into folders based on camera names

Write-Host "🗂️  Auto-organizing cameras into folders..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3333"

# Get all cameras and groups
Write-Host "📥 Fetching data..." -ForegroundColor Yellow
try {
    $cameras = Invoke-RestMethod -Uri "$baseUrl/cameras"
    $groups = Invoke-RestMethod -Uri "$baseUrl/camera-groups"
}
catch {
    Write-Host "❌ Failed to fetch data. Is backend running?" -ForegroundColor Red
    Write-Host "   Start backend: cd backend; npm run start:dev" -ForegroundColor Yellow
    exit
}

Write-Host "✅ Found $($cameras.Count) cameras" -ForegroundColor Green
Write-Host "✅ Found $($groups.Count) groups" -ForegroundColor Green
Write-Host ""

# Create group lookup
$groupLookup = @{}
foreach ($group in $groups) {
    $groupLookup[$group.name] = $group.id
}

# Display available groups
Write-Host "📁 Available groups:" -ForegroundColor Cyan
foreach ($group in $groups | Sort-Object orderIndex) {
    Write-Host "   - $($group.name) (ID: $($group.id))" -ForegroundColor Gray
}
Write-Host ""

# Auto-assign logic
$organized = 0
$failed = 0
$skipped = 0

foreach ($camera in $cameras) {
    $groupId = $null
    $groupName = $null
    
    # Pattern matching for floor assignment
    if ($camera.name -match "Camera (\d+) -" -or $camera.name -match "\((\d+)\.\d+\)") {
        $floorNum = $Matches[1]
        $groupName = "Tầng $floorNum"
    }
    # Special: Thang máy
    elseif ($camera.name -match "Thang may|Thang máy") {
        $groupName = "Thang máy"
    }
    # Special: Sảnh
    elseif ($camera.name -match "Sảnh") {
        $groupName = "Sảnh & Khác"
    }
    # Special: IPCamera
    elseif ($camera.name -match "IPCamera") {
        $groupName = "Sảnh & Khác"
    }
    
    # Get group ID
    if ($groupName -and $groupLookup.ContainsKey($groupName)) {
        $groupId = $groupLookup[$groupName]
    }
    
    # Assign camera to group
    if ($groupId) {
        if ($camera.groupId -eq $groupId) {
            Write-Host "⏭️  Skipped: $($camera.name) (already in $groupName)" -ForegroundColor Gray
            $skipped++
        }
        else {
            try {
                $body = @{ groupId = $groupId } | ConvertTo-Json
                Invoke-RestMethod -Uri "$baseUrl/cameras/$($camera.id)" -Method Patch -Body $body -ContentType "application/json" | Out-Null
                Write-Host "✅ Organized: $($camera.name) → $groupName" -ForegroundColor Green
                $organized++
            }
            catch {
                Write-Host "❌ Failed: $($camera.name)" -ForegroundColor Red
                $failed++
            }
        }
    }
    else {
        Write-Host "⚠️  No group found for: $($camera.name)" -ForegroundColor Yellow
        $failed++
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "📊 Organization Summary" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ Organized: $organized cameras" -ForegroundColor Green
Write-Host "⏭️  Skipped: $skipped cameras (already organized)" -ForegroundColor Gray
Write-Host "❌ Failed: $failed cameras" -ForegroundColor Red
Write-Host "📋 Total: $($cameras.Count) cameras" -ForegroundColor Yellow
Write-Host ""

# Verify result
Write-Host "🔍 Verifying result..." -ForegroundColor Yellow
$tree = Invoke-RestMethod -Uri "$baseUrl/camera-groups/tree"

foreach ($root in $tree) {
    Write-Host ""
    Write-Host "📁 $($root.name)" -ForegroundColor Cyan
    
    if ($root.children) {
        foreach ($child in $root.children | Sort-Object orderIndex) {
            $camCount = if ($child.cameras) { $child.cameras.Count } else { 0 }
            Write-Host "  📁 $($child.name) [$camCount cameras]" -ForegroundColor White
        }
    }
}

Write-Host ""
Write-Host "✅ Organization completed!" -ForegroundColor Green
Write-Host "🌐 Open http://localhost:3000 to see result" -ForegroundColor Cyan

