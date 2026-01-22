import '../../css/AddDirigente.css';
import { IoIosCloseCircle } from "react-icons/io";
import { FaSearch, FaRegUser, FaRegSave, FaTimes } from "react-icons/fa";

import { useAddDirigente } from "../../../hooks/custom/useAddDirigente";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";
import { BuscarPersonas } from '../../BuscarPersonas';

export const AddDirigente = () => {

  const {
    modalAbierto, cerrarModal,
    handleNext, handlePrevious,
    barrios, selectedPersonaId,
    selectedSuperiores, step,
    barriosSeleccionados,
    handleAgregarBarrio,
    fechaDesde, setFechaDesde,
    fechaHasta, setFechaHasta,
    handleSelectDirigente, handleSelectSuperior,
    handleSelectPersona, personasACargo,
    handleCrearDirigente,
    handleRemoveBarrio,
    handleRemovePersona
  } = useAddDirigente();

  return (
    <div
      id="ModalAddDirigente"
      className={modalAbierto === 'AddDirigente' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}
    >
      <div id="box-modal-add-dirigente">
        <div className="box-close-modal">
          <h3>
            <FaRegUser /> Agregar Dirigente
          </h3>
          <p className="boton-close" onClick={cerrarModal}>
            <IoIosCloseCircle />
          </p>
        </div>

        {step === 1 && selectedPersonaId === null ? (

          <div id="caja-principal-agregarDirigente">

            <h3>Asignar persona como Dirigente</h3>

            <BuscarPersonas selectPersona={handleSelectDirigente} />

          </div>
        ) : step === 2 && selectedPersonaId ? (
          <>
            <div id="caja-principal-agregarSuperior">

              <h4>Asignar un Coordinador de Jurisdicción como Superior</h4>

              <BuscarPersonas selectPersona={handleSelectSuperior} />

            </div>
          </>
        ) : step === 3 && selectedSuperiores ? (
          <>
            <div id="caja-principal-agregarBarrios">

              <div id="caja-seleccionar-barrios">
                <h3>Seleccionar Barrios:</h3>
                <select onChange={handleAgregarBarrio}>
                  <option value="">Seleccione un barrio</option>
                  {barrios.map((barrio) => (
                    <option key={barrio._id} value={barrio._id}>
                      {barrio.nombreBarrio}
                    </option>
                  ))}
                </select>
              </div>

              <div id="caja-ver-barrios">
                <h3>Barrios seleccionados:</h3>
                <ul>
                  {barriosSeleccionados.map((barrio, index) => (
                    <li key={index}>
                      {barrio.nombreBarrio}&nbsp;
                      <FaTimes id='boton-remove-barrio' onClick={() => handleRemoveBarrio(index)} />
                    </li>
                  ))}
                </ul>
              </div>

            </div>
            <div id='caja-boton-carga-dirigentes'>
              <button onClick={() => handleNext()} className='botonCeleste-borde-blanco'>
                Cargar Adherentes <FaCircleArrowRight size={16} />
              </button>
            </div>
          </>
        ) : step === 4 ? (
          <>
            <div id='caja-principal-agregarPersoACargo'>

              <div id='caja-principal-seleccionar-agregarPersoACargo'>

                <h4>Agrega a las personas que el Dirigente tiene a cargo</h4>

                <BuscarPersonas selectPersona={handleSelectPersona} />

              </div>

              <div id='caja-principal-ver-agregarPersoACargo'>
                <h3>Adherentes seleccionados:</h3>
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
                  <FaCircleArrowLeft size={16} /> Volver a Barrios
                </button>
              </div>
              <div id='box-siguiente-addEvento'>
                <button onClick={() => handleNext()} className='botonCeleste-borde-blanco'>
                  Cargar Fechas <FaCircleArrowRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div id="caja-fechas-dirigente">

              <label>
                Fecha de inicio como Dirigente:
              </label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />

              <label>
                Fecha Finalización (opcional):
              </label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />

            </div>
            <div className='box-botons-prev-next-event'>
              <div id='box-atras-addEvento'>
                <button onClick={() => handlePrevious()} className='botonCeleste-borde-blanco'>
                  <FaCircleArrowLeft size={16} /> Volver a Adherentes
                </button>
              </div>
              <div id='box-siguiente-addEvento'>
                <button onClick={handleCrearDirigente} className='botonCeleste-borde-blanco'>
                  <FaRegSave /> Guardar Dirigente
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};