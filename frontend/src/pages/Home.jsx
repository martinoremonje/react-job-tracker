import React, { useEffect, useState } from 'react';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk(); // Importa signOut si necesitas cerrar sesión
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrlLocal = 'http://localhost:3000';

  useEffect(() => {
    if (!isLoaded) {
      return; // Espera a que se cargue el estado de autenticación
    }

    if (!isSignedIn) {
      setTimeout(() => {
        navigate('/login'); // Redirige a la página de inicio de sesión después de un breve retraso
      }, 100); // Espera 100 milisegundos (ajusta si es necesario)
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await fetch(`${backendUrlLocal}/api/jobs`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setJobs(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isSignedIn, isLoaded, navigate]);

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (error) {
    return <div>Error loading jobs: {error}</div>;
  }

  return (
    <div>
      <h1>Job Listings</h1>
      {jobs.map(job => (
        <div key={job._id}>
          {job.company} - {job.role}
        </div>
      ))}
    </div>
  );
};

export default HomePage;