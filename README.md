# 🇹🇷 TurkAmerica - Plataforma de Aprendizaje de Turco

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Plataforma web completa para aprender turco dirigida a hispanohablantes, con sistema de autenticación, gestión de progreso, rachas de estudio y recursos educativos organizados por niveles (A1-C1).

## ✨ Características

### 🎓 **Recursos Educativos**
- Materiales organizados por niveles (A1 a C1)
- PDFs oficiales del Instituto Yunus Emre
- Explicaciones de gramática interactivas
- Enlaces curados a canales de YouTube y recursos externos

### 👤 **Sistema de Usuarios**
- Registro y autenticación con JWT
- Perfil personalizable con avatar
- Sistema de rachas de estudio
- Sincronización de progreso

### 🎨 **Interfaz Moderna**
- Diseño responsive y adaptativo
- Modo oscuro completo
- Animaciones suaves y microinteracciones
- Soporte para diferentes tamaños de fuente

### 📱 **App Móvil Companion**
- Flashcards con sincronización en la nube
- Modo offline
- Sistema de repetición espaciada

## 🚀 Inicio Rápido

### Prerequisitos

- **Node.js** v16 o superior
- **MongoDB** v4.4 o superior
- **npm** o **yarn**

### Instalación Automática

```bash
# 1. Clonar el repositorio
git clone https://github.com/yourusername/turkamerica.git
cd turkamerica

# 2. Ejecutar script de configuración
node setup.js

# 3. Iniciar el servidor
npm run dev
```

### Instalación Manual

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/yourusername/turkamerica.git
cd turkamerica
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Iniciar MongoDB
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 4. Iniciar servidor
npm run dev
```

## 📁 Estructura del Proyecto

```
turkamerica/
├── config/
│   └── database.js          # Configuración de MongoDB
├── middleware/
│   └── auth.js              # Middleware de autenticación JWT
├── models/
│   └── User.js              # Modelo de usuario con Mongoose
├── routes/
│   └── auth.js              # Rutas de autenticación
├── public/                  # Frontend estático
│   ├── auth/                # Páginas de auth
│   │   ├── login.html
│   │   ├── register.html
│   │   └── auth.js
│   ├── css/                 # Estilos
│   │   ├── styles.css
│   │   ├── darkmode.css
│   │   └── ...
│   ├── js/                  # Scripts frontend
│   │   ├── config.js        # Configuración centralizada
│   │   ├── general.js       # Utilidades globales
│   │   └── ...
│   └── index.html           # Página principal
├── .env                     # Variables de entorno (NO COMMIT)
├── .env.example             # Plantilla de .env
├── server.js                # Servidor Express
├── setup.js                 # Script de configuración
└── package.json
```

## 🔧 Configuración

### Variables de Entorno (.env)

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/turkamerica

# Security
JWT_SECRET=your-secret-key-here

# CORS (producción)
ALLOWED_ORIGINS=https://yourdomain.com
```

### Generar JWT Secret Seguro

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📡 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/logout` | Cerrar sesión | Sí |
| GET | `/api/auth/verify` | Verificar token | Sí |
| GET | `/api/auth/profile` | Obtener perfil | Sí |
| PUT | `/api/auth/profile` | Actualizar perfil | Sí |
| GET | `/api/auth/streak` | Obtener racha | Sí |
| POST | `/api/auth/update-streak` | Actualizar racha | Sí |

### Health Check

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Estado del servidor |

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Diagnóstico de problemas
node diagnose.js

# Setup inicial
node setup.js
```

### Modo Desarrollo

El servidor usa `nodemon` para reiniciar automáticamente cuando detecta cambios:

```bash
npm run dev
```

### Testing

```bash
# Ejecutar tests (cuando estén disponibles)
npm test
```

## 🏗️ Stack Tecnológico

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas

### Frontend
- **HTML5/CSS3** - Estructura y estilos
- **JavaScript ES6+** - Lógica del cliente
- **Font Awesome** - Iconos
- **Google Fonts** - Tipografías

### Seguridad
- **Helmet** - Headers de seguridad
- **CORS** - Control de orígenes
- **Rate Limiting** - Protección contra ataques
- **express-validator** - Validación de datos

## 🚀 Deployment

### Preparación para Producción

1. **Configurar variables de entorno**
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/turkamerica
JWT_SECRET=<generar-secreto-seguro>
ALLOWED_ORIGINS=https://yourdomain.com
```

2. **Configurar MongoDB Atlas** (recomendado)
   - Crear cluster en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Whitelist de IPs del servidor
   - Copiar connection string

3. **Deploy en plataformas**

#### Heroku
```bash
heroku create turkamerica
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your-uri>
heroku config:set JWT_SECRET=<your-secret>
git push heroku main
```

#### Railway
```bash
railway login
railway init
railway add
railway up
```

#### VPS (Ubuntu)
```bash
# Instalar Node.js y MongoDB
# Clonar repositorio
# Configurar nginx como reverse proxy
# Usar PM2 para process management
pm2 start server.js --name turkamerica
pm2 startup
pm2 save
```

## 📊 Características del Sistema

### Sistema de Rachas
- Tracking diario de actividad
- Récords personales
- Mensajes motivacionales
- Sincronización automática

### Modo Oscuro
- Detección automática de preferencias del sistema
- Toggle manual
- Persistencia entre sesiones
- Transiciones suaves

### Almacenamiento
- LocalStorage para preferencias
- MongoDB para datos de usuario
- Sincronización cross-device

## 🐛 Troubleshooting

### MongoDB no conecta

```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Verificar estado
mongosh --eval "db.version()"
```

### Error: Puerto en uso

```bash
# Cambiar puerto en .env
PORT=3001

# O matar proceso en el puerto
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### JWT Secret no válido

```bash
# Generar nuevo secreto
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Actualizar en .env
JWT_SECRET=<nuevo-secreto>
```

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] Tests unitarios y de integración
- [ ] Sistema de recuperación de contraseña
- [ ] Chat en vivo con tutores
- [ ] Sistema de gamificación avanzado
- [ ] App móvil nativa (iOS/Android)
- [ ] API pública para developers
- [ ] Integración con servicios de pago
- [ ] Certificaciones oficiales

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👤 Autor

**LatinCTC**
- GitHub: [@LatinCTC](https://github.com/LatinCTC)
- Email: contact@turkamerica.com

## 🙏 Agradecimientos

- Instituto Yunus Emre por los materiales educativos
- Comunidad de aprendices de turco
- Todos los contributors y supporters

## 💖 Apoyo

Si este proyecto te ha sido útil, considera:
- ⭐ Dar una estrella al repositorio
- 🐛 Reportar bugs
- 💡 Sugerir nuevas características
- 💰 [Apoyar el proyecto](https://whydonate.com/fundraising/-apoya-mas-desarollos-para-nuestra-comunidad)

---

**Made with ❤️ by LatinCTC**