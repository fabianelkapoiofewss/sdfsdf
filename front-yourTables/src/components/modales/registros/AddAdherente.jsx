import { IoIosCloseCircle } from "react-icons/io";
import { FaRegUser, FaRegSave, FaTimes } from "react-icons/fa";

import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";
import { useAddAdherente } from '../../../hooks/custom/useAddAdherente';
import { BuscarPersonas } from '../../BuscarPersonas';
import '../../css/AddDirigente.css';

export const AddAdherente = () => {

    const {
        modalAbierto, cerrarModal,
        handleNext, handlePrevious,
        barrios, selectedPersonaId,
        selectedSuperiores, step,
        barriosSeleccionados,
        handleAgregarBarrio,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        handleSelectAdherente, handleSelectSuperior,
        handleCrearAdherente,
        handleRemoveBarrio
    } = useAddAdherente();

    return (
        <div
            id="ModalAddAdherente"
            className={modalAbierto === 'AddAdherente' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}
        >
            <div id="box-modal-add-dirigente">
                <div className="box-close-modal">
                    <h3>
                        <FaRegUser /> Agregar Adherente
                    </h3>
                    <p className="boton-close" onClick={cerrarModal}>
                        <IoIosCloseCircle />
                    </p>
                </div>

                {step === 1 && selectedPersonaId === null ? (

                    <div id="caja-principal-agregarDirigente">

                        <h3>Asignar persona como Adherente</h3>

                        <BuscarPersonas selectPersona={handleSelectAdherente} />

                    </div>
                ) : step === 2 && selectedPersonaId ? (
                    <>
                        <div id="caja-principal-agregarSuperior">

                            <h4>Asignar un Dirigente como Superior</h4>

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
                                Cargar Fechas <FaCircleArrowRight size={16} />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div id="caja-fechas-dirigente">

                            <label>
                                Fecha de inicio como Adherente:
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
                                    <FaCircleArrowLeft size={16} /> Volver a Barrios
                                </button>
                            </div>
                            <div id='box-siguiente-addEvento'>
                                <button onClick={handleCrearAdherente} className='botonCeleste-borde-blanco'>
                                    <FaRegSave /> Guardar Adherente
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};