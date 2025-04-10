import React, { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { isLoaded: userLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoaded || !userLoaded) {
      // Aún cargando la información del usuario, no hagas nada todavía
      return;
    }

    if (!isSignedIn) {
      // Si el usuario no está conectado, redirige a /login
      navigate('/login');
    }
    // No es necesario un else aquí, si está conectado, el componente se renderizará normalmente
  }, [isSignedIn, authLoaded, userLoaded, navigate]);

  // Mientras se carga la información del usuario, puedes mostrar un indicador de carga
  if (!authLoaded || !userLoaded) {
    return <div>Cargando información del usuario...</div>;
  }

  // Si el usuario NO está conectado, el useEffect ya lo habrá redirigido a /login
  // Por lo tanto, si llegamos a este punto, significa que isSignedIn es true
  return (
    <div>
      {/* Aquí va el contenido que solo se muestra a usuarios conectados */}
      <h1>Bienvenido a la página principal</h1>
      {/* ... más información o funcionalidades para usuarios conectados ... */}
    </div>
  );
};

export default Home;