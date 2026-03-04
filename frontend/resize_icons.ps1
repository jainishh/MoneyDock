Add-Type -AssemblyName System.Drawing

$srcFile = "d:\MoneyDock\frontend\src\assets\logo\tablogo.png"
$pubDir = "d:\MoneyDock\frontend\public"

$img = [System.Drawing.Image]::FromFile($srcFile)

function Resize-Image {
    param($size, $name)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    # Fill background to fix transparency if needed, but since it's PNG we keep it transparent
    $graph.Clear([System.Drawing.Color]::Transparent)
    
    $graph.DrawImage($img, 0, 0, $size, $size)
    $bmp.Save("$pubDir\$name", [System.Drawing.Imaging.ImageFormat]::Png)
    $graph.Dispose()
    $bmp.Dispose()
    Write-Host "Created $name ($size x $size)"
}

Resize-Image 192 "icon-192x192.png"
Resize-Image 512 "icon-512x512.png"
Resize-Image 180 "apple-touch-icon.png"

$img.Dispose()
Write-Host "All icons resized successfully!"
