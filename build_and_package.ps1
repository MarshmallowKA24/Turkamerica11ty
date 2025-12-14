# --- CONFIGURACIÓN ---
$StagingDir = "deploy_package_static"  # Carpeta temporal
$SiteSource = "_site_tmp"              # Donde Eleventy deja tus archivos (según tu config anterior)
$ZipFile    = "deploy_static.zip"

Write-Host "🚀 INICIANDO PROCESO MAESTRO..." -ForegroundColor Cyan

# ---------------------------------------------------------
# PASO 1: LIMPIEZA PREVENTIVA (Evita el loop infinito)
# ---------------------------------------------------------
Write-Host "🧹 Limpiando archivos viejos..."
if (Test-Path $StagingDir) { Remove-Item $StagingDir -Recurse -Force -ErrorAction SilentlyContinue }
if (Test-Path $ZipFile)    { Remove-Item $ZipFile -Force -ErrorAction SilentlyContinue }

# ---------------------------------------------------------
# PASO 2: CONSTRUIR EL SITIO (Eleventy)
# ---------------------------------------------------------
Write-Host "🏗️  Ejecutando Build de Eleventy..."
cmd /c "npx @11ty/eleventy"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: El build falló. Deteniendo." -ForegroundColor Red
    exit 1
}

# ---------------------------------------------------------
# PASO 3: PREPARAR EL PAQUETE (Copiar todo a la carpeta temporal)
# ---------------------------------------------------------
Write-Host "📦 Organizando archivos para el servidor..."
New-Item -ItemType Directory -Path $StagingDir | Out-Null

# A. Copiar el Frontend (Lo renombramos a '_site' para que Nginx lo quiera)
if (Test-Path $SiteSource) {
    Write-Host "   - Copiando Frontend..."
    Copy-Item -Path $SiteSource -Destination "$StagingDir\_site" -Recurse
} else {
    Write-Host "❌ Error: No se encontró la carpeta $SiteSource" -ForegroundColor Red
    exit 1
}

# B. Copiar el Backend (Server)
if (Test-Path "server") {
    Write-Host "   - Copiando Backend..."
    Copy-Item -Path "server" -Destination "$StagingDir\server" -Recurse
}

# C. Copiar Assets (Imágenes, logos)
if (Test-Path "assets") {
    Write-Host "   - Copiando Assets..."
    Copy-Item -Path "assets" -Destination "$StagingDir\_site\assets" -Recurse
}

# D. Copiar Archivos de Configuración Node
Copy-Item "package.json" "$StagingDir\"
if (Test-Path "package-lock.json") { Copy-Item "package-lock.json" "$StagingDir\" }

# ---------------------------------------------------------
# PASO 4: CREAR SCRIPT DE AUTO-INSTALACIÓN (Para Linux)
# ---------------------------------------------------------
Write-Host "📝 Generando script de control para Ubuntu..."

$DeployScriptContent = @"
#!/bin/bash
# Script generado automáticamente por PowerShell

echo "🚀 Iniciando despliegue en el servidor..."

# 1. Instalar dependencias si cambiaron
if [ -f "package.json" ]; then
    echo "📦 Instalando librerías del backend..."
    npm install --production
fi

# 2. Reiniciar el Backend (PM2)
echo "🧠 Reiniciando API..."
pm2 restart turkamerica-api || pm2 start server/server.js --name "turkamerica-api"

# 3. Ajustar Permisos (Vital para error 403/404)
# Le damos todo a 'ubuntu' (tu usuario) para que puedas editar, y lectura a otros
echo "🔒 Ajustando permisos..."
sudo chown -R ubuntu:ubuntu .
sudo chmod -R 755 .

# 4. Recargar Nginx
echo "🌐 Recargando servidor web..."
sudo systemctl reload nginx

echo "✅ ¡TODO LISTO! Sitio y Backend actualizados."
"@

# Guardar el archivo asegurando formato Unix (LF en vez de CRLF)
$DeployScriptPath = "$StagingDir\deploy_static.sh"
[IO.File]::WriteAllText($DeployScriptPath, $DeployScriptContent.Replace("`r`n", "`n"))

# ---------------------------------------------------------
# PASO 5: COMPRIMIR
# ---------------------------------------------------------
Write-Host "🗜️  Comprimiendo ZIP final..."
# Comprimimos el CONTENIDO de la carpeta, no la carpeta en sí
Compress-Archive -Path "$StagingDir\*" -DestinationPath $ZipFile -Force

Write-Host "---------------------------------------------------" -ForegroundColor Green
Write-Host "✅ ÉXITO: Sube '$ZipFile' a tu servidor." -ForegroundColor Green
Write-Host "---------------------------------------------------"