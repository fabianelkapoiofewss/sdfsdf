import logoGildo from '../assets/gildo.png';
import logoPJ from '../assets/logoPJfin.png';
import avatar from '../assets/avatar2.jpg';
import LogoPSC from '../assets/LogoPSC.jpeg';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './css/Header.css';

import { IoMdArrowDropdownCircle } from "react-icons/io";
import { FaTable } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import { FaRegUser } from "react-icons/fa";
import { ImStatsBars2 } from "react-icons/im";
import { FaUserCircle } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

import { Link } from 'react-router-dom';

import { useUiStore } from '../hooks/useUiStore.js';
import { useSelector } from 'react-redux';

import { useAuthStore } from '../hooks/useAuthStore.js';
import { useTablesStore } from '../hooks/useTableStore.js';

import { nothingTable } from '../store/tables/tablesSlice';


export const Header = () => {

  const { isModalOpen } = useUiStore();
  const { user } = useSelector(state => state.auth);

  const { startLogout } = useAuthStore();

    const { activeUsuarios } = useTablesStore();

  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();

  // const handleClickTablas = () => {
  //   dispatch(nothingTable());
  // };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  // cierra el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest('#boton-perfil-cerrarSesion') &&
        !e.target.closest('#dropdown-menu-perfil')
      ) {
        setMenuOpen(false);
      }
      
    };
    // agrega el event listener al montar el componente
    document.addEventListener('mousedown', handleClickOutside);
    // elimina el event listener al desmontar el componente
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id="header" className={isModalOpen ? 'header-no-fijo' : 'header-fijo'}>
      <div id='box-header-center'>

        <div id='box-logo-header'>
          <Link to='/home'>
            <img src={logoPJ} alt="" />
          </Link>
          <Link to='/home'>
            <img src={logoGildo} alt="" />
          </Link>
          <Link to='/home'>
            <img src={LogoPSC} alt="" className='logo-porSiempreCompa' />
          </Link>
        </div>

        <div id='box-botonera'>
          <Link to='/tables'>
            <button><FaTable /> Datos</button>
          </Link>
          <Link to='/maps'>
            <button><SiGooglemaps /> Mapa</button>
          </Link>
          <Link to='/users-admin' onClick={activeUsuarios}>
            <button><FaRegUser /> Usuarios</button>
          </Link>
          <button><ImStatsBars2 /> Resultados</button>
        </div>

        <div id='box-perfil'>
          <div id='box-perfil-text'>
            <p>Hola</p>
            <p>Usuario</p>
            <p id='boton-perfil-cerrarSesion' onClick={toggleMenu}>
              <IoMdArrowDropdownCircle />
            </p>

            {menuOpen && (
              <div id='dropdown-menu-perfil'>

                <Link to={`/mi-perfil/${user?.id}`}>
                  <p id='dropdown-item'><FaUserCircle /> Mi Perfil</p>
                </Link>

                <p id='dropdown-item' onClick={startLogout}><IoIosLogOut /> Cerrar Sesión</p>
              </div>
            )}

          </div>
          <div id='box-perfil-img'>
            <img src={avatar} alt="" />
          </div>

        </div>

      </div>

    </div>
  )
}
