#!/bin/bash
# Script generado automÃ¡ticamente por PowerShell

echo "ðŸš€ Iniciando despliegue en el servidor..."

# 0. LIMPIEZA: Esta lÃ³gica se moviÃ³ a los pasos manuales previos
# para evitar borrar los archivos que acabamos de descomprimir.



# 1. Instalar dependencias si cambiaron
if [ -f "package.json" ]; then
    echo "ðŸ“¦ Instalando librerÃ­as del backend (como usuario ubuntu)..."
    # Usamos 'su -' y cargamos nvm explÃ­citamente
    su - ubuntu -c "export NVM_DIR=\"\$HOME/.nvm\" && [ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\" && cd /var/www/turkamerica_project && npm install --production"
fi

# 2. Reiniciar el Backend (PM2)
echo "ðŸ§  Reiniciando API (como usuario ubuntu)..."
# Cargamos nvm explÃ­citamente antes de pm2
su - ubuntu -c "export NVM_DIR=\"\$HOME/.nvm\" && [ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\" && (pm2 restart turkamerica-api || pm2 start /var/www/turkamerica_project/server/server.js --name turkamerica-api)"

# 3. Ajustar Permisos (Vital para error 403/404)
# Le damos todo a 'ubuntu' (tu usuario) para que puedas editar, y lectura a otros
echo "ðŸ”’ Ajustando permisos..."
sudo chown -R ubuntu:ubuntu .
sudo chmod -R 755 .

# 4. Recargar Nginx
echo "ðŸŒ Recargando servidor web..."
sudo systemctl reload nginx

echo "âœ… Â¡TODO LISTO! Sitio y Backend actualizados."
