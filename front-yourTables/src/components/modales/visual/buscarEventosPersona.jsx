import { useDispatch } from 'react-redux';

import { IoIosCloseCircle } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";

import { useUiStore } from '../../../hooks/useUiStore.js';
import { limpiarDatos } from '../../../store/tables/datosSlice.js'

import { useTablesStore } from '../../../hooks/useTableStore.js';
import '../../css/BuscarEventosPersona.css';
import { BuscarPersonas } from "../../BuscarPersonas.jsx";


export const BuscarEventosPersona = ({ onSelectPersona }) => {

  const dispatch = useDispatch();

  const { modalAbierto, cerrarModal } = useUiStore();
  const { getEventosByPersona } = useTablesStore();

  // const handleNuevaBusqueda = () => {
  //   setSelectedButton(null);
  //   setInputValue("");
  //   setSearchPerformed(false)
  // }

  const handleSelectPersona = (persona) => {
    getEventosByPersona(persona._id);
    onSelectPersona(persona._id);
    cerrarModal();
    dispatch(limpiarDatos());
  };

  const handleCloseModal = () => {
    cerrarModal();
    dispatch(limpiarDatos());
  };


  return (
    <div id='ModalBuscarEventosPersona' className={modalAbierto === 'BuscarEventosPersona' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>

      <div id='box-modal-buscar-eventos-persona'>

        <div className='box-close-modal'>
          <h3><FaRegUser /> Buscar en qué Eventos participó una Persona</h3>
          <p className='boton-close' onClick={handleCloseModal}><IoIosCloseCircle /></p>
        </div>


        <div id='caja-principal-buscarEventosPersona'>

          <BuscarPersonas selectPersona={handleSelectPersona} />

          {/* <div className="box-button-new-search">
            <button onClick={handleNuevaBusqueda} className='botonCeleste-borde-blanco' style={{ marginTop: "10px" }}>
              Nueva búsqueda
            </button>
          </div> */}

        </div>

      </div>
    </div>
  )
};