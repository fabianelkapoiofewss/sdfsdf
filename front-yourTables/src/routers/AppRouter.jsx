import { Routes, Route, Navigate} from 'react-router-dom';
import { useEffect } from 'react';
import { Home } from '../pages/Home.jsx';
import { Login } from '../pages/Login.jsx';
import { Tables } from '../pages/Tables.jsx';
import { Maps } from '../pages/Maps.jsx';

import { useAuthStore } from '../hooks/useAuthStore.js';
import { PerfilUser } from '../pages/PerfilUser.jsx';
import { UsersAdministracion } from '../pages/UsersAdministracion.jsx';
import LoadingScreen from '../pages/LoadingScreen.jsx';


export const AppRouter = () => {
    
  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, [])

  // Si el status es 'checking', mostramos el mensaje de "Cargando..."
  if (status === 'checking') {
    return <LoadingScreen />;
  }

  return (

    <Routes>
      {
        // Si el usuario no está autenticado, solo puede acceder a la ruta de Login
        (status === 'not-authenticated') ? (
          <>
            <Route path="/login" element={<Login />} />
            {/* Cualquier otra ruta lo redirige al login */}
            <Route path="/*" element={<Navigate to="/login" />} />
          </>
        ) : (
          // Si el usuario está autenticado, tiene acceso a las demás rutas
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/mi-perfil/:id" element={<PerfilUser />} />
            <Route path="/users-admin" element={<UsersAdministracion />} />
            {/* <Route path="/cargar-ubicacion" element={<AddUbiPrueba />} /> */}
            {/* Si el usuario intenta acceder al login estando autenticado, redirige a Home */}
            <Route path="/*" element={<Navigate to="/home" />} />
          </>
        )
      }

    </Routes>
  );
}
