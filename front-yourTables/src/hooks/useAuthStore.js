import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import yourTablesApi from '../api/yourTablesApi.js';
import { onChecking, onLogin, onLogout, clearErrorMessage } from '../store/auth/authSlice.js';
import { handleApiError } from '../api/handleApiError.js';
import { toast } from 'sonner';



export const useAuthStore = () => {

  const { status, user, errorMessage } = useSelector( state => state.auth );
  
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const startLogin = async( { correoElectronico, contrasena } ) => {
    
    dispatch( onChecking() );
    
    try { 
      const { data } = await yourTablesApi.post('/auth/login', { 
        correoElectronico, 
        contrasena 
      }, {withCredentials: true});

      if ( data ) {
  
        dispatch( 
          onLogin({
            id: data.data.id,
            nombre: data.data.nombre,
            apellido: data.data.apellido,
            correoElectronico: data.data.correoElectronico,
            token: data.data.token
          })
        );
        toast.success('Bienvenido', {
          description: 'Iniciaste sesion con exito',
          duration: 2500
        });
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      }

    } catch (error) {
      handleApiError(error);
      dispatch( onLogout('Credenciales incorrectas') );
      setTimeout(() => {
        dispatch( clearErrorMessage() );
      }, 10);
      
    }
  }
  
  const checkAuthToken = async() => {

    dispatch(onChecking());

    try {
      const { data } = await yourTablesApi.get('/auth/me');
      dispatch(onLogin({
        id: data.data.id,
        nombre: data.data.nombre,
        apellido: data.data.apellido,
        correoElectronico: data.data.correoElectronico
      }));
    } catch (error) {
      dispatch(onLogout());
    }
  
  };
  
  // LOGOUT
  const startLogout = () => {

    try {
      yourTablesApi.get('/auth/logout');
      dispatch(onLogout());
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    {
      status,
      user,
      errorMessage,

      startLogin,
      startLogout,
      checkAuthToken
    }
  )
}
