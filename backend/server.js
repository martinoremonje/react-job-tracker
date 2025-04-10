const express = require('express');
const mongoose = require('mongoose');
const Job = require('./models/jobs.model.js');
require('dotenv').config();
const { clerkMiddleware, getAuth } = require('@clerk/express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:5173', // Para desarrollo
    // origin: 'https://tu-app-de-vercel.vercel.app', // Para producción (reemplaza con tu URL de Vercel)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si necesitas enviar cookies o encabezados de autorización
};

app.use(cors(corsOptions));
app.use(express.json());

// Aplica el clerkMiddleware para habilitar la autenticación de Clerk
app.use(clerkMiddleware());

// Aplica la protección de autenticación a las rutas que deseas
const requireAuth = (req, res, next) => {
    const { auth } = getAuth(req);
    if (!auth.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

app.post('/api/jobs', requireAuth, async (req, res) => {
    try {
        const nuevoJob = new Job(req.body);
        // Aquí puedes acceder al ID del usuario autenticado: auth.userId
        const jobGuardado = await nuevoJob.save();
        res.status(201).json(jobGuardado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/jobs', requireAuth, async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/jobs/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        // Aquí podrías verificar si el usuario autenticado tiene permiso para editar este trabajo
        const jobActualizado = await Job.findByIdAndUpdate(id, req.body, { new: true });
        if (!jobActualizado) {
            return res.status(404).json({ message: 'Trabajo no encontrado' });
        }
        res.json(jobActualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/jobs/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        // Aquí podrías verificar si el usuario autenticado tiene permiso para eliminar este trabajo
        const jobEliminado = await Job.findByIdAndDelete(id);
        if (!jobEliminado) {
            return res.status(404).json({ message: 'Trabajo no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});