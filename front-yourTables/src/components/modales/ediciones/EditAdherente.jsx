import { useEditAdherente } from "../../../hooks/custom/useEditAdherente";

import { FaRegSave, FaRegUser, FaTimes, FaSearch } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";
import '../../css/EditAdherente.css';

export const EditAdherente = ({ idRegistro }) => {
    const {
        modalAbierto, cerrarModal,
        handleEditarAdherente,
        step, setStep,
        handleNext, handlePrevious,
        barrios, setBarriosSeleccionados, barriosSeleccionados,
        personas, selectedPersonaId, setSelectedPersonaId,
        selectedSuperiores, setSelectedSuperiores,
        inputValue, setInputValue,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        selectedButton, setSelectedButton,
        searchPerformed,
        handleRemoveBarrio,
        fetchAdherente, handleSearch,
        handleButtonClick
    } = useEditAdherente(idRegistro);

    return (
        <div
            id='ModalEditAdherente'
            className={modalAbierto === 'EditAdherente' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}
        >
            <div id="box-modal-edit-adherente">
                <div className="box-close-modal">
                    <h3>
                        <FaRegUser /> Editar Adherente
                    </h3>
                    <p className="boton-close" onClick={cerrarModal}>
                        <IoIosCloseCircle />
                    </p>
                </div>

                {step === 1 ? (
                    <>
                        <div id="caja-principal-agregarBarrios">

                            <div id="caja-seleccionar-barrios">

                                <h3>Selecciona Barrios:</h3>
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
                                            {barrio.nombreBarrio}&nbsp;
                                            <FaTimes id='boton-remove-barrio' onClick={() => handleRemoveBarrio(barrio)} />
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                        <div id='caja-boton-carga-dirigentes'>
                            <button onClick={() => handleNext()} className='botonCeleste-borde-blanco'>
                                Ir a Fechas <FaCircleArrowRight size={16} />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div id="caja-fechas-edit-adherente">

                            <label>Fecha de inicio como Adherente:</label>
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
                                <button onClick={handleEditarAdherente} className='botonCeleste-borde-blanco'>
                                    <FaRegSave /> Guardar Cambios
                                </button>
                            </div>
                        </div>

                    </>
                )}
            </div>

        </div>
    )
};