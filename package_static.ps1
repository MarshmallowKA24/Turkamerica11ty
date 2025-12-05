# package_static.ps1
# Script para comprimir manualmente la carpeta de despliegue si el build falla al crear el ZIP.

$PackageDir = "deploy_package_static"
$ZipFile = "deploy_static.zip"

Write-Host "Iniciando compresión manual..."

if (-not (Test-Path $PackageDir)) {
    Write-Host "Error: No se encuentra la carpeta '$PackageDir'. Ejecuta primero ./build_and_package.ps1" -ForegroundColor Red
    exit 1
}

# Intentar eliminar zip anterior si existe
if (Test-Path $ZipFile) {
    try {
        Remove-Item $ZipFile -Force -ErrorAction Stop
        Write-Host "Zip anterior eliminado."
    } catch {
        Write-Host "Error: No se pudo eliminar '$ZipFile'. Asegúrate de que no esté abierto." -ForegroundColor Red
        exit 1
    }
}

# Comprimir
try {
    Compress-Archive -Path "$PackageDir\*" -DestinationPath $ZipFile -Force -ErrorAction Stop
    Write-Host "✅ Éxito: Se ha creado '$ZipFile'." -ForegroundColor Green
} catch {
    Write-Host "❌ Error al comprimir: $_" -ForegroundColor Red
    Write-Host "Intenta cerrar programas que puedan estar usando los archivos o hazlo manualmente."
}
