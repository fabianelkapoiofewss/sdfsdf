import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

import { FaUser, FaUserCircle } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { CiEdit } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';

import { AddUsuario } from '../components/modales/registros/AddUsuario';
import { ConfirmDetele } from '../components/modales/ConfirmDelete';
import { EditUsuario } from '../components/modales/ediciones/EditUsuario';
import { useUiStore } from '../hooks/useUiStore';

import PulseLoader from "react-spinners/PulseLoader";

import './css/UsersAdministracion.css';

export const UsersAdministracion = () => {

  const { abrirModalAddUsuario, abrirModalConfirmDelete, abrirModalEditUsuario } = useUiStore();

  const { tableContent, activeTable } = useSelector(state => state.tables);

  const [selectUsuario, setSelectUsuario] = useState()
  const [loading, setLoading] = useState(false);

  const handleDelete = (registroId) => {
    setSelectUsuario(registroId);
    abrirModalConfirmDelete();
  }

  const handleUpdate = (registroId) => {
    setSelectUsuario(registroId);
    abrirModalEditUsuario()
  }

  useEffect(() => {
    if (activeTable === 'usuarios') {
      setLoading(true);

      const timeout = setTimeout(() => {
        setLoading(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [tableContent, activeTable]);

  return (
    <>
      <div className='box-padre-users-admin'>
        <Header />

        <div className='box-main-users-admin'>

          <div className='box-header-butoon-users-admin'>

            <button className='botonCeleste-borde-blanco' onClick={abrirModalAddUsuario}>
              <FaUser />
              Registrar nuevo usuario
            </button>

          </div>

          <div className='box-body-users-admin'>

            <h3><FaUsers /> Usuarios Activos</h3>

            <div className='box-list-users-admin'>

              {loading ? (

                <div className='box-loading-results-search-personas'>
                  <p>Cargando Usuarios...</p>
                  <PulseLoader color="white" size={8} />
                </div>

              ) : tableContent.length === 0 && activeTable === 'usuarios' ? (
                <h3>No hay usuarios activos</h3>

              ) : (
                tableContent.map((user) => (
                  <div className='box-datos-user-admin' key={user._id}>

                    <div className='box-icon-accion-user-admin'>

                      <div className='icon-user-admin'>
                        <FaUserCircle size={20} color='gray' />
                      </div>

                      <div className='casilla-accion-user-admin'>

                        <div id='casilla-accion-edit' onClick={() => handleUpdate(user._id)}>
                          <CiEdit size={23} />
                        </div>

                        <div id='casilla-accion-delete' onClick={() => handleDelete(user._id)}>
                          <AiOutlineDelete size={22} />
                        </div>

                      </div>


                    </div>

                    <div className='datos-user-linea'>
                      <strong>Nombre de usuario:&nbsp;</strong><p>{user["nombre usuario"]}</p>
                    </div>
                    <div className='datos-user-linea'>
                      <strong>Contraseña actual:&nbsp;</strong><p>{user.contrasena}</p>
                    </div>


                  </div>
                ))
              )}

            </div>


          </div>

        </div>

        <Footer />
      </div>
      <AddUsuario />
      <ConfirmDetele idRegistro={selectUsuario} />
      <EditUsuario idRegistro={selectUsuario} />
    </>
  )
}