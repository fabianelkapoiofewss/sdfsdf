import { useEffect } from 'react';
import './css/Login.css'
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import logo from '../assets/compa.jpg';
import logopj from '../assets/logoPJfin.png';
import logogildo from '../assets/gildo.png';
import LogoPSC from '../assets/LogoPSC.jpeg';

import { useForm } from '../hooks/useForm.js';
import {useAuthStore} from '../hooks/useAuthStore.js';

const loginForm = {
  email: '',
  password:''
}

export const Login = () => {

  const { email, password, onInputChange } = useForm(loginForm);
  const { errorMessage, startLogin } = useAuthStore();

  const loginSubmit = (event) => {
    event.preventDefault();
    startLogin({ correoElectronico:email, contrasena:password });
  }

  // useEffect(() => {
  //   if(errorMessage !== undefined){
  //     Swal.fire('Error en la autenticación', errorMessage, 'error')
  //   }
  
  // }, [errorMessage])

  return (
    <>
      <div id='box-body-main'>
        <div id='box-main-border' className='animate__animated animate__zoomIn'>
          <div id='box-main-login'>
            <div id='box-logo'>
                <img src={logopj} alt="" className='logo-pj'/>
                <img src={LogoPSC} alt="" className='logo-porSiempreCompa' />
                <img src={logogildo} alt="" className='logo-gildo' />
            </div>
            <div id='box-form'>
              <form id='form-login' action="" onSubmit={loginSubmit}>
                <div id='box-inputs'>
                  <label htmlFor="usuario">Usuario</label>
                  <input
                    type="email"
                    placeholder='Ingrese su Usuario'
                    required
                    name='email'
                    value={email}
                    onChange={onInputChange}
                  />
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    placeholder='Ingrese su Contraseña'
                    required
                    name='password'
                    value={password}
                    onChange={onInputChange}
                  />
                </div>
                <div id='box-form-button'>
                    <button type='submit' className='botonCeleste-borde-blanco'>Ingresar</button>
                  
                </div>
              </form>
            </div>

          </div>
        </div>
        
      </div>
    </>
  )
}