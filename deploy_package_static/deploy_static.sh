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