import { useEditCoordinador } from "../../../hooks/custom/useEditCoordinador";
import '../../css/EditCoordinador.css';
import { FaRegSave, FaRegUser, FaTimes, FaSearch } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";
import { BuscarPersonas } from "../../BuscarPersonas";


export const EditCoordinador = ({ idRegistro }) => {
  const {
    modalAbierto, cerrarModal,
    jurisdicciones, jurisdiccionesSeleccionadas,
    handleSelectJurisdiccion, handleRemoveJurisdiccion,
    handleSelectPersona, handleRemovePersona,
    handleEditarCoordinador, personasACargo,
    fechaDesde, setFechaDesde,
    fechaHasta, setFechaHasta,
    step, handleNext, handlePrevious,
  } = useEditCoordinador(idRegistro);

  return (
    <div
      id='ModalEditCoordinador'
      className={modalAbierto === 'EditCoordinador' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}
    >
      <div id="box-modal-edit-coordinador">

        <div className="box-close-modal">
          <h3>
            <FaRegUser /> Editar Coordinador
          </h3>
          <p className="boton-close" onClick={cerrarModal}>
            <IoIosCloseCircle />
          </p>
        </div>

        {step === 1 ? (
          <>
            <div id='caja-principal-agregarPersoACargo'>

              <div id='caja-principal-seleccionar-agregarPersoACargo'>

                <h4>Agrega o elimina a las personas que el Coordinador tiene a cargo:</h4>

                <BuscarPersonas selectPersona={handleSelectPersona} />

              </div>

              <div id='caja-principal-ver-agregarPersoACargo'>
                <h3>Dirigentes actuales:</h3>
                <ul>
                  {personasACargo.map((persona, index) => (
                    <li key={index}>{persona.apellido}, {persona.nombre} - {persona.dni}&nbsp;
                      <FaTimes id='boton-remove-barrio' onClick={() => handleRemovePersona(persona)} />
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div id='caja-boton-carga-dirigentes'>
              <button onClick={() => handleNext()} className='botonCeleste-borde-blanco'>
                Ir a Jurisdiccines <FaCircleArrowRight size={16} />
              </button>
            </div>
          </>
        ) : step === 2 ? (
          <>
            <div id="caja-principal-agregarBarrios">

              <div id="caja-seleccionar-barrios">
                <h3>Seleccionar Jurisdicciones:</h3>
                <select
                  id="jurisdicciones"
                  onChange={handleSelectJurisdiccion}
                >
                  <option value="">-- Selecciona una jurisdicción --</option>
                  {jurisdicciones.map(jurisdiccion => (
                    <option key={jurisdiccion._id} value={jurisdiccion._id}>
                      {jurisdiccion.nombreJurisdiccion}
                    </option>
                  ))}
                </select>
              </div>

              <div id="caja-ver-juri">
                <h3>Actuales Jurisdicciones a cargo:</h3>
                <ul>
                  {jurisdiccionesSeleccionadas.map((jurisdiccion, index) => (
                    <li id="box-li-jurisdiccion-coordinador" key={jurisdiccion._id || index}>
                      - {jurisdiccion.nombreJurisdiccion}
                      <FaTimes id="boton-remove-barrio" onClick={() => handleRemoveJurisdiccion(jurisdiccion)} />
                    </li>
                  ))}
                </ul>

              </div>

            </div>

            <div className='box-botons-prev-next-event'>
              <div id='box-atras-addEvento'>
                <button onClick={() => handlePrevious()} className='botonCeleste-borde-blanco'>
                  <FaCircleArrowLeft size={16} /> Volver a Dirigentes
                </button>
              </div>
              <div id='box-siguiente-addEvento'>
                <button onClick={() => handleNext()} className='botonCeleste-borde-blanco'>
                  Ir a Fechas <FaCircleArrowRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div id="caja-fechas-edit-coordinador">

              <label>Fecha de inicio como Coordinador:</label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value || "")}
              />

              <label>Fecha Finalización (opcional):</label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value || "")}
              />
            </div>

            <div className='box-botons-prev-next-event'>
              <div id='box-atras-addEvento'>
                <button onClick={() => handlePrevious()} className='botonCeleste-borde-blanco'>
                  <FaCircleArrowLeft size={16} /> Volver a Jurisdicciones
                </button>
              </div>
              <div id='box-siguiente-addEvento'>
                <button onClick={cerrarModal} className='botonCeleste-borde-blanco'>
                  Cancelar
                </button>
                <button onClick={handleEditarCoordinador} className='botonCeleste-borde-blanco'>
                  <FaRegSave /> Guardar Cambios
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};