// Ejemplo en server.js (o en un archivo de rutas)
const express = require('express');
const mongoose = require('mongoose');
const Job = require('./models/jobs.model.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/jobs', async (req, res) => {
  try {
    const nuevoJob = new Job(req.body);
    const jobGuardado = await nuevoJob.save();
    res.status(201).json(jobGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const jobActualizado = await Job.findByIdAndUpdate(id, req.body, { new: true });
    if (!jobActualizado) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }
    res.json(jobActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const jobEliminado = await Job.findByIdAndDelete(id);
    if (!jobEliminado) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }
    res.status(204).send(); // 204 No Content para indicar eliminación exitosa sin cuerpo de respuesta
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