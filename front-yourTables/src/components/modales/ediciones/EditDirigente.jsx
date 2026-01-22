import { useEffect } from "react";
import { useEditDirigente } from "../../../hooks/custom/useEditDirigente";

import '../../css/EditDirigente.css';
import { FaRegSave, FaRegUser, FaTimes, FaSearch } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";
import { BuscarPersonas } from "../../BuscarPersonas";

export const EditDirigente = ({ idRegistro }) => {
  const {
    modalAbierto, cerrarModal,
    handleEditarDirigente,
    step, handleNext, handlePrevious,
    barrios, setBarriosSeleccionados, barriosSeleccionados,
    fechaDesde, setFechaDesde,
    fechaHasta, setFechaHasta,
    personasACargo, handleRemoveBarrio,
    handleSelectPersona,
    handleRemovePersona
  } = useEditDirigente(idRegistro);

  return (
    <div
      id='ModalEditDirigente'
      className={modalAbierto === 'EditDirigente' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}
    >
      <div id="box-modal-edit-dirigente">

        <div className="box-close-modal">
          <h3>
            <FaRegUser /> Editar Dirigente
          </h3>
          <p className="boton-close" onClick={cerrarModal}>
            <IoIosCloseCircle />
          </p>
        </div>

        {step === 1 ? (
          <>
            <div id='caja-principal-agregarPersoACargo'>

              <div id='caja-principal-seleccionar-agregarPersoACargo'>

                <h4>Agrega o elimina a las personas que el Dirigente tiene a cargo:</h4>

                <BuscarPersonas selectPersona={handleSelectPersona} />

              </div>

              <div id='caja-principal-ver-agregarPersoACargo'>
                <h3>Adherentes actuales:</h3>
                <ul>
                  {personasACargo.map((persona, index) => (
                    <li id="box-li-barrios-dirigente" key={index}>
                      - {persona.apellido}, {persona.nombre} - {persona.dni}
                      <FaTimes id='boton-remove-barrio' onClick={() => handleRemovePersona(persona)} />
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div id='caja-boton-carga-dirigentes'>
              <button onClick={() => handleNext()} className='botonCeleste-borde-blanco'>
                Ir a Barrios <FaCircleArrowRight size={16} />
              </button>
            </div>
          </>
        ) : step === 2 ? (
          <>
            <div id="caja-principal-agregarBarrios">

              <div id="caja-seleccionar-barrios">
                <h3>Seleccionar Barrios:</h3>
                <select
                  id="barrios"
                  onChange={(e) => {
                    const barrioSeleccionado = barrios.find(b => b._id === e.target.value);
                    if (barrioSeleccionado && !barriosSeleccionados.some(b => b._id === barrioSeleccionado._id)) {
                      setBarriosSeleccionados(prev => [...prev, barrioSeleccionado]);
                    }
                  }}
                >
                  <option value="">-- Selecciona un barrio --</option>
                  {barrios.map(barrio => (
                    <option key={barrio._id} value={barrio._id}>
                      {barrio.nombreBarrio}
                    </option>
                  ))}
                </select>
              </div>

              <div id="caja-ver-barrios">
                <h3>Actuales Barrios a cargo:</h3>
                <ul>
                  {barriosSeleccionados.map(barrio => (
                    <li key={barrio._id}>
                      {barrio.nombreBarrio}
                      <FaTimes id='boton-remove-barrio' onClick={() => handleRemoveBarrio(barrio)} />
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className='box-botons-prev-next-event'>
              <div id='box-atras-addEvento'>
                <button onClick={() => handlePrevious()} className='botonCeleste-borde-blanco'>
                  <FaCircleArrowLeft size={16} /> Volver a Adherentes
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
            <div id="caja-fechas-edit-dirigente">

              <label>Fecha de inicio como Dirigente:</label>
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
                  <FaCircleArrowLeft size={16} /> Volver a Barrios
                </button>
              </div>
              <div id='box-siguiente-addEvento'>
                <button onClick={cerrarModal} className='botonCeleste-borde-blanco'>
                  Cancelar
                </button>
                <button onClick={handleEditarDirigente} className='botonCeleste-borde-blanco'>
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