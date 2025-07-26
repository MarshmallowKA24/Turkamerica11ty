const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// Middleware para verificar token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Validaciones
const registerValidation = [
    body('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('El nombre de usuario debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
];

const loginValidation = [
    body('identifier')
        .notEmpty()
        .withMessage('Usuario o email requerido'),
    body('password')
        .notEmpty()
        .withMessage('Contraseña requerida')
];

// POST /api/auth/register - Registro de usuario
router.post('/register', registerValidation, async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: errors.array()[0].msg 
            });
        }

        const { username, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({ 
                    message: 'El email ya está registrado' 
                });
            } else {
                return res.status(400).json({ 
                    message: 'El nombre de usuario ya está en uso' 
                });
            }
        }

        // Crear nuevo usuario (el hash del password se hace en el pre-save hook)
        const newUser = new User({
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: password // Se hashea automáticamente en el modelo
        });

        await newUser.save();

        // Generar token JWT
        const token = jwt.sign(
            { 
                userId: newUser._id, 
                username: newUser.username,
                email: newUser.email 
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        // Respuesta exitosa (el modelo ya excluye la contraseña en toJSON)
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: newUser.toJSON()
        });

    } catch (error) {
        console.error('Error en registro:', error);
        
        // Manejar errores de duplicado de MongoDB
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const message = field === 'email' ? 'El email ya está registrado' : 'El nombre de usuario ya está en uso';
            return res.status(400).json({ message });
        }
        
        res.status(500).json({ 
            message: 'Error interno del servidor' 
        });
    }
});

// POST /api/auth/login - Inicio de sesión
router.post('/login', loginValidation, async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: errors.array()[0].msg 
            });
        }

        const { identifier, password } = req.body;

        // Buscar usuario por email o username
        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { username: identifier.toLowerCase() }
            ]
        });

        if (!user) {
            return res.status(401).json({ 
                message: 'Credenciales inválidas' 
            });
        }

        // Verificar contraseña usando el método del modelo
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Credenciales inválidas' 
            });
        }

        // Actualizar última actividad
        user.stats.lastActivity = new Date();
        await user.save();

        // Generar token JWT
        const token = jwt.sign(
            { 
                userId: user._id, 
                username: user.username,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor' 
        });
    }
});

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // Actualizar última actividad del usuario
        await User.findByIdAndUpdate(req.user.userId, {
            'stats.lastActivity': new Date()
        });

        res.json({ 
            message: 'Logout exitoso' 
        });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor' 
        });
    }
});

// GET /api/auth/verify - Verificar token
router.get('/verify', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        
        if (!user || !user.isActive) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado o inactivo' 
            });
        }

        res.json({
            message: 'Token válido',
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Error verificando token:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor' 
        });
    }
});

// GET /api/auth/profile - Obtener perfil del usuario
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        
        if (!user || !user.isActive) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado' 
            });
        }

        res.json({
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor' 
        });
    }
});

// PUT /api/auth/profile - Actualizar perfil
router.put('/profile', authenticateToken, [
    body('profile.firstName').optional().isLength({ max: 50 }),
    body('profile.lastName').optional().isLength({ max: 50 }),
    body('profile.bio').optional().isLength({ max: 500 }),
    body('preferences.language').optional().isIn(['es', 'en', 'tr']),
    body('preferences.dailyGoal').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: errors.array()[0].msg 
            });
        }

        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado' 
            });
        }

        // Actualizar campos permitidos
        const allowedUpdates = ['profile', 'preferences'];
        allowedUpdates.forEach(field => {
            if (req.body[field]) {
                user[field] = { ...user[field].toObject(), ...req.body[field] };
            }
        });

        await user.save();

        res.json({
            message: 'Perfil actualizado exitosamente',
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor' 
        });
    }
});

module.exports = router;