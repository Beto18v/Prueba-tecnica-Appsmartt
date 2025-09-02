# Guía de Despliegue - DigitalOcean VPS

Esta guía te llevará paso a paso para desplegar tu aplicación en un VPS de DigitalOcean con Ubuntu.

## Prerrequisitos

- Cuenta en DigitalOcean
- Dominio configurado (opcional para HTTPS)
- Artifacts compilados del frontend y backend

## 1. Crear Droplet y Configurar Firewall

### 1.1 Crear el Droplet

```bash
# Crear droplet en DigitalOcean (via web o API)
# Especificaciones mínimas recomendadas:
# - Ubuntu 22.04 LTS
# - 2GB RAM, 1 vCPU, 50GB SSD
# - Agregar tu SSH key
```

### 1.2 Conectar y actualizar sistema

```bash
# Conectar al servidor
ssh root@tu_ip_del_servidor

# Actualizar el sistema
apt update && apt upgrade -y

# Instalar paquetes esenciales
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

### 1.3 Configurar Firewall (UFW)

```bash
# Habilitar UFW
ufw --force enable

# Permitir SSH
ufw allow 22/tcp

# Permitir HTTP y HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Verificar estado
ufw status verbose
```

## 2. Instalar Node.js LTS, PostgreSQL, Nginx, PM2

### 2.1 Instalar Node.js LTS

```bash
# Agregar repositorio NodeSource para Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

# Instalar Node.js
apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 2.2 Instalar PostgreSQL

```bash
# Instalar PostgreSQL
apt install -y postgresql postgresql-contrib

# Iniciar y habilitar PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Verificar estado
systemctl status postgresql
```

### 2.3 Instalar Nginx

```bash
# Instalar Nginx
apt install -y nginx

# Iniciar y habilitar Nginx
systemctl start nginx
systemctl enable nginx

# Verificar estado
systemctl status nginx
```

### 2.4 Instalar PM2 globalmente

```bash
# Instalar PM2
npm install -g pm2

# Configurar PM2 para arrancar al inicio
pm2 startup systemd
# Ejecutar el comando que te muestre PM2

# Verificar instalación
pm2 --version
```

## 3. Configurar Base de Datos y Usuario

### 3.1 Configurar PostgreSQL

```bash
# Cambiar a usuario postgres
sudo -u postgres psql

# Dentro de PostgreSQL:
CREATE DATABASE tu_database_name;
CREATE USER tu_db_user WITH ENCRYPTED PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE tu_database_name TO tu_db_user;
ALTER USER tu_db_user CREATEDB;
\q
```

### 3.2 Configurar acceso remoto (opcional)

```bash
# Editar postgresql.conf
nano /etc/postgresql/*/main/postgresql.conf
# Descomentar y cambiar: listen_addresses = 'localhost'

# Editar pg_hba.conf
nano /etc/postgresql/*/main/pg_hba.conf
# Agregar: local   all   tu_db_user   md5

# Reiniciar PostgreSQL
systemctl restart postgresql
```

## 4. Preparar Estructura de Directorios

### 4.1 Crear directorios

```bash
# Crear estructura de directorios
mkdir -p /var/www/app/{backend,dist}
mkdir -p /var/log/pm2

# Establecer permisos
chown -R www-data:www-data /var/www/app
chmod -R 755 /var/www/app
```

## 5. Copiar Artifacts de Frontend

### 5.1 Copiar archivos del frontend

```bash
# Desde tu máquina local, copiar el build del frontend
scp -r ./frontend/dist/* root@tu_ip_del_servidor:/var/www/app/dist/

# En el servidor, ajustar permisos
chown -R www-data:www-data /var/www/app/dist
chmod -R 755 /var/www/app/dist
```

## 6. Configurar Backend

### 6.1 Copiar backend al servidor

```bash
# Desde tu máquina local
scp -r ./backend root@tu_ip_del_servidor:/var/www/app/

# En el servidor, navegar al directorio del backend
cd /var/www/app/backend
```

### 6.2 Configurar variables de entorno

```bash
# Copiar y editar el archivo .env
cp .env.example .env
nano .env

# Configurar las variables según tu entorno:
# PORT=3000
# DATABASE_URL=postgresql://tu_db_user:tu_password_seguro@localhost:5432/tu_database_name
# JWT_SECRET=tu_jwt_secret_muy_seguro
# NODE_ENV=production
```

### 6.3 Instalar dependencias

```bash
# Instalar dependencias de producción
npm ci --only=production

# Si necesitas instalar dependencias de desarrollo para migraciones:
npm install

# Verificar que dist/index.js existe
ls -la dist/
```

### 6.4 Ejecutar migraciones

```bash
# Ejecutar migraciones (ajusta según tu setup)
npm run typeorm:migration:run
# O si usas un script específico:
npm run migrate

# Ejecutar seeds si es necesario
npm run seed
```

## 7. Arrancar Backend con PM2

### 7.1 Configurar PM2

```bash
# Verificar que ecosystem.config.js está en el directorio backend
cd /var/www/app/backend
ls -la ecosystem.config.js

# Iniciar la aplicación con PM2
pm2 start ecosystem.config.js

# Verificar estado
pm2 status
pm2 logs backend-app

# Guardar configuración de PM2
pm2 save
```

### 7.2 Verificar funcionamiento del backend

```bash
# Probar el backend directamente
curl http://localhost:3000/api/health
# O cualquier endpoint que tengas configurado

# Ver logs en tiempo real
pm2 logs backend-app --lines 50
```

## 8. Configurar Nginx

### 8.1 Configurar sitio

```bash
# Copiar configuración de Nginx
cp /path/to/nginx.conf /etc/nginx/sites-available/app

# Crear enlace simbólico
ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/

# Remover configuración por defecto
rm /etc/nginx/sites-enabled/default

# Probar configuración
nginx -t

# Recargar Nginx
systemctl reload nginx
systemctl restart nginx
```

### 8.2 Verificar funcionamiento

```bash
# Verificar que Nginx está funcionando
systemctl status nginx

# Probar acceso
curl http://tu_ip_del_servidor
curl http://tu_ip_del_servidor/api/
```

## 9. Seguridad Básica

### 9.1 Configurar Fail2Ban

```bash
# Instalar Fail2Ban
apt install -y fail2ban

# Configurar Fail2Ban para SSH
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
EOF

# Iniciar y habilitar Fail2Ban
systemctl start fail2ban
systemctl enable fail2ban

# Verificar estado
fail2ban-client status
```

### 9.2 Configuraciones adicionales de UFW

```bash
# Limitar conexiones SSH
ufw limit ssh

# Denegar todo el tráfico saliente por defecto (opcional)
ufw --force reset
ufw default deny outgoing
ufw default deny incoming
ufw allow out 53
ufw allow out 80
ufw allow out 443
ufw allow out 123
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
```

### 9.3 Crear usuario no-root (recomendado)

```bash
# Crear usuario para la aplicación
adduser appuser
usermod -aG sudo appuser

# Copiar SSH keys
mkdir /home/appuser/.ssh
cp /root/.ssh/authorized_keys /home/appuser/.ssh/
chown -R appuser:appuser /home/appuser/.ssh
chmod 700 /home/appuser/.ssh
chmod 600 /home/appuser/.ssh/authorized_keys

# Cambiar propietario de la aplicación
chown -R appuser:appuser /var/www/app
```

## 10. Configurar HTTPS con Let's Encrypt (Opcional)

### 10.1 Instalar Certbot

```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
certbot --nginx -d tudominio.com -d www.tudominio.com

# Configurar renovación automática
systemctl enable certbot.timer
systemctl start certbot.timer
```

## 11. Monitoreo y Mantenimiento

### 11.1 Comandos útiles de PM2

```bash
# Ver estado de la aplicación
pm2 status

# Ver logs
pm2 logs backend-app

# Reiniciar aplicación
pm2 restart backend-app

# Recargar aplicación sin downtime
pm2 reload backend-app

# Monitorear recursos
pm2 monit
```

### 11.2 Comandos útiles del sistema

```bash
# Ver uso de recursos
htop
df -h
free -h

# Ver logs del sistema
journalctl -f
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 12. Backup y Actualizaciones

### 12.1 Backup de base de datos

```bash
# Crear script de backup
cat > /home/appuser/backup-db.sh << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
pg_dump -U tu_db_user -h localhost tu_database_name > /home/appuser/backups/db_backup_\$DATE.sql
find /home/appuser/backups -name "db_backup_*.sql" -mtime +7 -delete
EOF

# Hacer ejecutable
chmod +x /home/appuser/backup-db.sh

# Agregar a crontab para backup diario
echo "0 2 * * * /home/appuser/backup-db.sh" | crontab -
```

## ¡Despliegue Completado!

Tu aplicación debería estar funcionando en:

- **Frontend**: http://tu_ip_del_servidor o https://tudominio.com
- **Backend API**: http://tu_ip_del_servidor/api o https://tudominio.com/api

### Verificación final:

1. Visita tu sitio web
2. Verifica que la API responde correctamente
3. Revisa los logs de PM2 y Nginx
4. Confirma que los servicios están habilitados para arrancar al inicio
