import '../../css/AddCoordinador.css';
import { useAddCoordinador } from '../../../hooks/custom/useAddCoordinador';

import { IoIosCloseCircle } from "react-icons/io";
import { FaRegSave, FaSearch, FaTimes } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaCircleArrowLeft, FaCircleArrowRight } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { useTablesStore } from '../../../hooks/useTableStore';
import { BuscarPersonas } from '../../BuscarPersonas';
import { toast } from 'sonner';


export const AddCoordinador = () => {

  const { getJurisdicciones } = useTablesStore();

  const {
    modalAbierto, cerrarModal,
    step, handleNext, handlePrevious,
    selectedPersonaId, setJurisdiccionACargo,
    jurisdiccionesSeleccionadas, setJurisdiccionesSeleccionadas,
    handleRemoveJurisdiccion,
    handleSelectCoordinador, handleSelectPersona,
    handleRemovePersona,
    fechaDesde, setFechaDesde,
    personasACargo, handleCrearCoordinador,
  } = useAddCoordinador();

  const [jurisdicciones, setJurisdicciones] = useState([])

  useEffect(() => {
    const fetchJurisdicciones = async () => {
      try {
        const data = await getJurisdicciones();
        setJurisdicciones(data);
      } catch (error) {
        console.log('Error al obtener las Jurisdicciones:', error);
      }
    };
    if (modalAbierto === 'AddCoordinador' && selectedPersonaId) {
      fetchJurisdicciones();
    }
  }, [modalAbierto, selectedPersonaId]);

  return (
    <div id='ModalAddCoordinador' className={modalAbierto === 'AddCoordinador' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>

      <div id='box-modal-add-coordinador'>

        <div className='box-close-modal'>
          <h3><FaRegUser /> Agregar Coordinador</h3>
          <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
        </div>

        {step === 1 && selectedPersonaId === null ? (

          <div id='caja-principal-agregarCoordinador'>

            <h3>Asignar persona como Coordinador</h3>

            <BuscarPersonas selectPersona={handleSelectCoordinador} />

          </div>
        ) : step === 2 && selectedPersonaId ? (
          <>
            <div id="primera-caja-principal-juri">
              <div id="caja-seleccionar-juri">
                <h3>Seleccionar Jurisdicciones:</h3>
                <select
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedJurisdiccion = jurisdicciones.find(j => j._id === selectedId);

                    if (!selectedJurisdiccion) return;

                    if (jurisdiccionesSeleccionadas.length >= 2) {
                      toast.error("Solo puede seleccionar un máximo de 2 Jurisdicciones.");
                      return;
                    }

                    setJurisdiccionACargo((prev) => {
                      if (!prev.includes(selectedId)) {
                        return [...prev, selectedId];
                      }
                      return prev;
                    });

                    setJurisdiccionesSeleccionadas((prev) => {
                      if (!prev.includes(selectedJurisdiccion.nombreJurisdiccion)) {
                        return [...prev, selectedJurisdiccion.nombreJurisdiccion];
                      }
                      return prev;
                    });
                  }}
                >
                  <option value="">Seleccione una jurisdicción</option>
                  {jurisdicciones.map((jurisdiccion) => (
                    <option key={jurisdiccion._id} value={jurisdiccion._id}>
                      {jurisdiccion.nombreJurisdiccion}
                    </option>
                  ))}
                </select>
              </div>
              <div id="caja-ver-juri">
                <h3>Jurisdicciones seleccionadas:</h3>
                <ul>
                  {jurisdiccionesSeleccionadas.map((nombre, index) => (
                    <li id="box-li-jurisdiccion-coordinador" key={index}>
                      - {nombre}
                      <FaTimes id="boton-remove-barrio" onClick={() => handleRemoveJurisdiccion(index)} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div id='caja-boton-carga-dirigentes'>
              <button onClick={() => handleNext()} className='botonCeleste-borde-blanco'>
                Cargar Dirigentes <FaCircleArrowRight size={16} />
              </button>
            </div>
          </>
        ) : step === 3 ? (
          <>
            <div id='caja-principal-agregarPersoACargo'>

              <div id='caja-principal-seleccionar-agregarPersoACargo'>

                <h4>Agrega a las personas que el Coordinador tiene a cargo</h4>

                <BuscarPersonas selectPersona={handleSelectPersona} />

              </div>

              <div id='caja-principal-ver-agregarPersoACargo'>
                <h3>Dirigentes seleccionados:</h3>
                <ul>
                  {personasACargo.map((persona, index) => (
                    <li key={index}>{persona.apellido}, {persona.nombre} - {persona.dni}&nbsp;
                      <FaTimes id="boton-remove-barrio" onClick={() => handleRemovePersona(persona)} />
                    </li>
                  ))}
                </ul>
              </div>

            </div>
            <div className='box-botons-prev-next-event'>
              <div id='box-atras-addEvento'>
                <button onClick={() => handlePrevious()} className='botonCeleste-borde-blanco'>
                  <FaCircleArrowLeft size={16} /> Volver a Jurisdicciones
                </button>
              </div>
              <div id='box-siguiente-addEvento'>
                <button onClick={() => handleNext()} className='botonCeleste-borde-blanco'>
                  Cargar Fecha <FaCircleArrowRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : step === 4 ? (
          <>
            <div id="caja-fechaDesde-coord">
              <h3>Fecha de inicio como Coordinador:</h3>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </div>
            <div className='box-botons-prev-next-event'>
              <div id='box-atras-addEvento'>
                <button onClick={() => handlePrevious()} className='botonCeleste-borde-blanco'>
                  <FaCircleArrowLeft size={16} /> Volver a Dirigentes
                </button>
              </div>
              <div id='box-siguiente-addEvento'>
                <button onClick={handleCrearCoordinador} className='botonCeleste-borde-blanco'>
                  <FaRegSave /> Guardar Coordinador
                </button>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
