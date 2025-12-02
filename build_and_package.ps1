# build_and_package.ps1
Write-Host "Iniciando Build Local (Restauración)..."

# Asegurar que usamos el comando correcto
cmd /c "npx @11ty/eleventy"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en el build."
    exit 1
}

$PackageDir = "deploy_package_static"
$SiteDir = "_site_tmp"
$NewSiteDir = "_site_new"

# Limpieza previa
if (Test-Path $PackageDir) { Remove-Item -Path $PackageDir -Recurse -Force }
New-Item -ItemType Directory -Path $PackageDir | Out-Null

# Copiar archivos construidos
Copy-Item -Path $SiteDir -Destination "$PackageDir\$NewSiteDir" -Recurse

# Crear script de deploy simple
$DeployScript = @"
#!/bin/bash
# deploy_static.sh
echo "Restaurando sitio..."
if [ -d "_site_new" ]; then
    rm -rf _site
    mv _site_new _site
    chown -R www-data:www-data _site
    chmod -R 755 _site
    systemctl reload nginx
    echo "Listo."
else
    echo "Error: No se encuentra _site_new"
fi
"@
Set-Content -Path "$PackageDir\deploy_static.sh" -Value $DeployScript
# Asegurar finales de línea LF para Linux
(Get-Content "$PackageDir\deploy_static.sh") -join "`n" | Set-Content -NoNewline "$PackageDir\deploy_static.sh"

$ZipFile = "deploy_static.zip"
if (Test-Path $ZipFile) { Remove-Item $ZipFile -Force }

Write-Host "Comprimiendo..."
Compress-Archive -Path "$PackageDir\*" -DestinationPath $ZipFile -Force

Write-Host "Paquete de restauración creado: $ZipFile"
