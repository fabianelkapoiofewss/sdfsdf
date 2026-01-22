import { useDispatch } from 'react-redux';

import { IoIosCloseCircle } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";

import { useUiStore } from '../../../hooks/useUiStore.js';
import { limpiarDatos } from '../../../store/tables/datosSlice.js'

import { useTablesStore } from '../../../hooks/useTableStore.js';
import { BuscarPersonas } from "../../BuscarPersonas.jsx";
import '../../css/BuscarEventosPersona.css';


export const SearchOnePersona = ({ onSelectPersona }) => {

  const dispatch = useDispatch();

  const { modalAbierto, cerrarModal } = useUiStore();
  const { buscadorPersona } = useTablesStore();

  const handleSelectPersona = (persona) => {
    buscadorPersona(persona._id);
    onSelectPersona(persona._id);
    cerrarModal();
    dispatch(limpiarDatos());
  };

  const handleCloseModal = () => {
    cerrarModal();
    dispatch(limpiarDatos());
  };


  return (
    <div id='ModalBuscarPersona' className={modalAbierto === 'BuscarPersona' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>

      <div id='box-modal-buscar-eventos-persona'>

        <div className='box-close-modal'>
          <h3><FaRegUser /> Buscar una Persona</h3>
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