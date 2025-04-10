const express = require('express');
const mongoose = require('mongoose');
const Job = require('./models/jobs.model.js');
require('dotenv').config();
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
const port = process.env.PORT || 3000;

// Configuración del middleware de autenticación
const checkAuth = auth({
  audience: 'clerk',
  issuerBaseURL: `https://${process.env.CLERK_DOMAIN}`, 
  tokenSigningAlg: 'RS256',
});

app.use(express.json());

// Aplica el middleware de autenticación a las rutas que deseas proteger
app.post('/api/jobs', checkAuth, async (req, res) => {
  try {
    const nuevoJob = new Job(req.body);
    // Aquí podrías guardar información del usuario que creó el trabajo si lo deseas
    // nuevoJob.createdBy = req.auth?.payload?.sub; // El 'sub' claim del JWT suele ser el ID del usuario
    const jobGuardado = await nuevoJob.save();
    res.status(201).json(jobGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/jobs', async (req, res) => { // Por ahora, dejamos esta ruta sin autenticación para que todos puedan ver los trabajos
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/jobs/:id', checkAuth, async (req, res) => {
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

app.delete('/api/jobs/:id', checkAuth, async (req, res) => {
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