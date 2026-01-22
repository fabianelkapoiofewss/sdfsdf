import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { GrWorkshop } from "react-icons/gr";
import { IoIosCloseCircle } from "react-icons/io";
import { FaRegSave, FaSearch, FaTimes } from "react-icons/fa";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";

import { useEditEvento } from "../../../hooks/custom/useEditEvento";
import { BuscarPersonas } from "../../BuscarPersonas";


import '../../css/AddEvento.css';
import { useEffect } from 'react';

const apiKeyMaps = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

export const EditEvento = ({ idRegistro }) => {

    const {
        modalAbierto, cerrarModal,
        eventoData,
        personas, instituciones, crearPersonaSubmit,
        step, setStep, handleNext, handlePrevious,
        handleButtonClick, handleBuscar, getPlaceholder,
        isFormosa, tipoBusqueda, setTipoBusqueda,
        inputBusqueda, setInputBusqueda,
        selectedButton, searchPerformed,
        registrarAsistente, setRegistrarAsistente,
        organizadorDelEvento, handleSelectOrganizador, handleRemoveOrganizador,
        fecha, setFecha,
        acciones, accion, setAccion,
        localidades, handleLocalidadChange,
        localidad,
        barrios, barrio, setBarrio,
        direccion, setDireccion,
        detalle, setDetalle,
        beneficiariosOAsistentes,
        handleSelectBeneficiario, handleRemoveBeneficiario,
        nombrePersona, apellidoPersona, dniPersona,
        direccionPersona, barrioPersona,
        numeroTelefonoPersona,
        onInputChange,
        loading, error, images,
        handleFileChange, handleRemoveImage,
        ubicacion, setUbicacion,
        selectedLocation, setSelectedLocation, handleUbicacionChange,
        handleEditarEvento
    } = useEditEvento(idRegistro);


    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKeyMaps,
        libraries,
        language: 'es',
    });

    useEffect(() => {
        if (step === 5 && ubicacion?.coordenadas?.length === 2) {
            const coords = ubicacion.coordenadas;
            console.log("Ubicación:", coords);
            if (coords) {
                const [lng, lat] = coords;
                setSelectedLocation({ lat, lng });
            }
        }
    }, [step, ubicacion]);

    const onMapClick = (event) => {
        if (event.latLng) {
            const location = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };
            console.log("Ubicación seleccionada:", location);
            handleUbicacionChange(location);
        }
    };

    return (
        <div id="ModalEditEvento" className={modalAbierto === 'EditEvento' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>

            <div className="box-modal-add-evento">

                <div className='box-close-modal'>
                    <h3><GrWorkshop /> Editar Evento</h3>
                    <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
                </div>

                {step === 1 ? (
                    <>
                        <div id='primera-caja-prin-addEvento'>

                            <div id='primera-caja-prin-addEvento-first'>

                                <h3>Organizado por:</h3>

                                <BuscarPersonas selectPersona={handleSelectOrganizador} />

                            </div>
                            <div id='primera-caja-prin-addEvento-second'>
                                <h3>Organizador actual del Evento:</h3>
                                <ul>
                                    {organizadorDelEvento.map((persona, index) => (
                                        <li id='box-li-add-organizador-evento' key={index}>{persona.apellido}, {persona.nombre} - {persona.cargo ? persona.cargo : "Sin cargo"} &nbsp;
                                            <p><FaTimes id='boton-remove-organizador' onClick={() => handleRemoveOrganizador(persona)} /></p>
                                        </li>
                                    ))}
                                </ul>

                            </div>

                        </div>
                        <div id='box-primer-parte-siguiente-addEvento'>
                            <button onClick={() => handleNext()} className='botonCeleste-borde-blanco'>
                                Ir a cabecera <FaCircleArrowRight size={16} />
                            </button>
                        </div>
                    </>
                ) : step === 2 ? (
                    <>
                        <div id='primera-caja-prin-addEvento'>

                            <div id='primera-caja-prin-addEvento-first'>
                                <h3>Fecha del Evento</h3>
                                <input
                                    type="date"
                                    value={fecha || ""}
                                    onChange={(e) => setFecha(e.target.value)}
                                />
                                <h3>Seleccionar Acción realizada</h3>
                                <select
                                    value={accion}
                                    onChange={(e) => setAccion(e.target.value)}
                                >
                                    <option value="" disabled>Seleccione una acción</option>
                                    {acciones.map((accion) => (
                                        <option key={accion._id} value={accion._id}>
                                            {accion.nombreAccion}
                                        </option>
                                    ))}
                                </select>

                                <h3>Localidad</h3>
                                <select
                                    name="localidad"
                                    value={localidad}
                                    onChange={handleLocalidadChange}
                                >
                                    <option value="" disabled>Seleccione una localidad</option>
                                    {localidades.map((localidad) => (
                                        <option key={localidad._id} value={localidad._id}>
                                            {localidad.nombreLocalidad}
                                        </option>
                                    ))}
                                </select>


                            </div>
                            <div id='primera-caja-prin-addEvento-second'>
                                <div id='box-dire-desc-addEvento'>

                                    {isFormosa ? (
                                        <>
                                            <h3>Barrio</h3>
                                            <select
                                                value={barrio}
                                                onChange={(e) => setBarrio(e.target.value)}
                                            >
                                                <option value="" disabled>Seleccione un barrio</option>
                                                {barrios.map((barrio) => (
                                                    <option key={barrio._id} value={barrio._id}>
                                                        {barrio.nombreBarrio}
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                    ) : (
                                        <></>
                                    )}

                                    <label htmlFor="direccion">Dirección</label>
                                    <input
                                        type="text"
                                        placeholder='Ingrese la dirección del evento'
                                        name='direccion'
                                        value={direccion || ""}
                                        onChange={(e) => setDireccion(e.target.value)}
                                    />
                                    <label htmlFor="detalle">Descripción</label>
                                    <textarea
                                        type="text"
                                        placeholder='Puedes dejar algún detalle del evento'
                                        name='detalle'
                                        value={detalle || ""}
                                        onChange={(e) => setDetalle(e.target.value)}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className='box-botons-prev-next-event'>
                            <div id='box-atras-addEvento'>
                                <button onClick={() => handlePrevious()} className='botonCeleste-borde-blanco'>
                                    <FaCircleArrowLeft size={16} /> Volver a Organizador
                                </button>
                            </div>
                            <div id='box-siguiente-addEvento'>
                                <button onClick={() => handleNext()} className='botonCeleste-borde-blanco'>
                                    Ir a Benef/Asist <FaCircleArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : step === 3 ? (
                    <>
                        <div id='primera-caja-prin-addEvento'>
                            <div id='primera-caja-prin-addEvento-first'>
                                <h3>Beneficiario o Asistente</h3>
                                <select value={tipoBusqueda} onChange={(e) => setTipoBusqueda(e.target.value)}>
                                    <option value="" disabled >Seleccione el tipo de Beneficiario</option>
                                    <option value="Persona">Persona</option>
                                    <option value="Institucion">Institución</option>
                                </select>
                                {tipoBusqueda === 'Institucion' ? (
                                    <>
                                        <input
                                            type="text"
                                            placeholder={`Buscar ${tipoBusqueda}`}
                                            value={inputBusqueda}
                                            onChange={(e) => setInputBusqueda(e.target.value)}
                                        />
                                        <button onClick={handleBuscar} className='botonCeleste-borde-blanco'>Buscar</button>

                                        {searchPerformed && (
                                            <div id='box-modal-add-evento-results'>
                                                {instituciones.length === 0 ? (
                                                    <p>No se encontraron instituciones.</p>
                                                ) : (
                                                    <table className='tabla-resultados'>
                                                        <thead>
                                                            <tr>
                                                                <th>Nombre de la Institución</th>
                                                                <th>Acción</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {instituciones.map((institucion) => (
                                                                <tr key={institucion._id}>
                                                                    <td>{institucion.nombreInstitucion}</td>
                                                                    <td>
                                                                        <button onClick={() => handleSelectBeneficiario(institucion)} className='botonCeleste-borde-blanco'>Seleccionar</button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        )}

                                    </>
                                ) : tipoBusqueda === 'Persona' ? (
                                    <>
                                        {!registrarAsistente && (
                                            <div id='box-modal-add-evento-buttons'>

                                                <button
                                                    className={`botonCeleste-borde-blanco ${selectedButton === "dni" ? "botonActivo" : ""}`}
                                                    onClick={() => handleButtonClick("dni")}
                                                >
                                                    Buscar por DNI
                                                </button>
                                                <button
                                                    className={`botonCeleste-borde-blanco ${selectedButton === "apellido" ? "botonActivo" : ""}`}
                                                    onClick={() => handleButtonClick("apellido")}
                                                >
                                                    Buscar por Apellido
                                                </button>
                                                <button
                                                    className={`botonCeleste-borde-blanco ${selectedButton === "nombre" ? "botonActivo" : ""}`}
                                                    onClick={() => handleButtonClick("nombre")}
                                                >
                                                    Buscar por Nombre
                                                </button>

                                            </div>
                                        )}
                                        {selectedButton && (
                                            <div id='box-modal-add-evento-input'>
                                                <form action="" onSubmit={handleBuscar}>
                                                    <input
                                                        type="text" placeholder={getPlaceholder()}
                                                        value={inputBusqueda}
                                                        onChange={(e) => setInputBusqueda(e.target.value)} />
                                                    <button type='submit' className='botonCeleste-borde-blanco'><FaSearch /></button>
                                                </form>
                                            </div>
                                        )}
                                        {searchPerformed ? (
                                            <div id='box-modal-add-register-results-search'>
                                                <table className='tabla-resultados'>
                                                    <thead>
                                                        <tr>
                                                            <th>Apellido</th>
                                                            <th>Nombre</th>
                                                            <th>dni</th>
                                                            <th>Acción</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {personas.map((persona) => (
                                                            <tr key={persona._id}>
                                                                <td>{persona.apellido}</td>
                                                                <td>{persona.nombre}</td>
                                                                <td>{persona.dni}</td>
                                                                <td>
                                                                    <button onClick={() => handleSelectBeneficiario(persona)} className='botonCeleste-borde-blanco'>Seleccionar</button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : registrarAsistente ? (
                                            <div id='box-form-add-asistente'>
                                                <form onSubmit={crearPersonaSubmit}>
                                                    <div id='form-contenedor-add-asistente'>
                                                        <div id='form-primera-caja-add-asistente'>
                                                            <label>Nombre</label>
                                                            <input
                                                                type="text"
                                                                placeholder='Ingrese nombre de la Persona'
                                                                required
                                                                name='nombrePersona'
                                                                value={nombrePersona}
                                                                onChange={onInputChange}
                                                            />
                                                            <label>Apellido</label>
                                                            <input
                                                                type="text"
                                                                placeholder='Ingrese apellido de la Persona'
                                                                required
                                                                name='apellidoPersona'
                                                                value={apellidoPersona}
                                                                onChange={onInputChange}
                                                            />
                                                            <label>DNI</label>
                                                            <input
                                                                type="number"
                                                                placeholder='Ingrese DNI'
                                                                required
                                                                name='dniPersona'
                                                                value={dniPersona}
                                                                onChange={onInputChange}
                                                            />
                                                        </div>

                                                        <div id='form-segunda-caja-add-asistente'>
                                                            <label>Dirección</label>
                                                            <input
                                                                type="text"
                                                                placeholder='Ingrese la dirección'
                                                                name='direccionPersona'
                                                                value={direccionPersona}
                                                                onChange={onInputChange}
                                                            />
                                                            <label>Barrio</label>
                                                            <select
                                                                name="barrioPersona"
                                                                value={barrioPersona}
                                                                onChange={onInputChange}
                                                            >
                                                                <option value="">Seleccione un barrio</option>
                                                                {barrios.map((barrio) => (
                                                                    <option key={barrio._id} value={barrio._id}>
                                                                        {barrio.nombreBarrio}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <label>Número de Teléfono</label>
                                                            <input
                                                                type="number"
                                                                name='numeroTelefonoPersona'
                                                                placeholder='+ 54 9'
                                                                value={numeroTelefonoPersona}
                                                                onChange={onInputChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div id='box-botons-add-encargado'>
                                                        <button type='submit' className='botonAzul-borde-negro'>
                                                            Guardar Y Seleccionar
                                                        </button>
                                                        <button
                                                            className='botonCeleste-borde-blanco'
                                                            onClick={() => setRegistrarAsistente(false)}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </>
                                ) : (
                                    <></>
                                )}

                            </div>
                            <div id='primera-caja-prin-addEvento-second'>
                                <>
                                    <h3>Beneficiario/Asistentes seleccionados:</h3>
                                    <ul className='list-asitentes-add-event'>
                                        {beneficiariosOAsistentes.length > 0 ? (
                                            beneficiariosOAsistentes.map((bene, index) => (
                                                <li id="box-li-asistente-evento" key={index}>
                                                    {bene.referencia ? (
                                                        bene.referencia.nombreInstitucion ? (
                                                            bene.referencia.nombreInstitucion
                                                        ) : (
                                                            `${bene.referencia.dni} - ${bene.referencia.apellido} ${bene.referencia.nombre}`
                                                        )
                                                    ) : (
                                                        bene.nombreInstitucion ? `${bene.nombreInstitucion}` : `${bene.dni} - ${bene.apellido} ${bene.nombre}`
                                                    )}
                                                    &nbsp;
                                                    <p>
                                                        <FaTimes
                                                            id="boton-remove-asitente"
                                                            onClick={() => handleRemoveBeneficiario(bene)}
                                                        />
                                                    </p>
                                                </li>
                                            ))
                                        ) : (
                                            <p>No hay beneficiarios/asistentes cargados.</p>
                                        )}


                                    </ul>
                                </>

                            </div>
                        </div>
                        <div className='box-botons-prev-next-event'>
                            <div id='box-atras-addEvento'>
                                <button onClick={() => handlePrevious()} className='botonCeleste-borde-blanco'>
                                    <FaCircleArrowLeft size={16} /> Volver a cabecera
                                </button>
                            </div>
                            <div id='box-siguiente-addEvento'>
                                <button onClick={() => handleNext()} className='botonCeleste-borde-blanco'>
                                    Ir a imagen/mapa <FaCircleArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : step === 4 ? (
                    <>
                        <div id="tercera-caja-prin-addEvento">
                            <div id="box-subir-imagenes-addEvento">
                                <h3>Subir Fotos del Evento</h3>
                                <input type="file" name='archivos' onChange={handleFileChange} multiple />
                                {loading && <p>Subiendo imagen...</p>}
                                {error && <p style={{ color: "red" }}>{error}</p>}
                                <div className="box-images-cloud">
                                    {images.map((image, index) => (
                                        <div className="image-container-cloud" key={index}>
                                            <img src={image.previewUrl} alt={`Uploaded ${index + 1}`}
                                            />
                                            <button
                                                className="boton-close-cloud-image"
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                ×
                                            </button>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='box-botons-prev-next-event'>
                            <div id='box-atras-addEvento'>
                                <button onClick={() => handlePrevious()} className='botonCeleste-borde-blanco'>
                                    <FaCircleArrowLeft size={16} /> Volver a Benif/Asist
                                </button>
                            </div>
                            <div id='box-siguiente-addEvento'>
                                <button onClick={() => handleNext()} className='botonCeleste-borde-blanco'>
                                    Ir al mapa <FaCircleArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : step === 5 ? (
                    <>
                        <div id='box-seleccione-ubicacion-mapa-addEvento'>
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                zoom={13}
                                center={
                                    selectedLocation && typeof selectedLocation.lat === "number" && typeof selectedLocation.lng === "number"
                                        ? selectedLocation
                                        : { lat: -26.1849, lng: -58.1731 }
                                }
                                onClick={onMapClick}
                            >
                                {/* {selectedLocation && selectedLocation.lat && selectedLocation.lng && (
                                    <Marker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
                                )} */}
                                {selectedLocation && typeof selectedLocation.lat === "number" && typeof selectedLocation.lng === "number" && (
                                    <Marker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
                                )}

                            </GoogleMap>
                        </div>
                        <div id='box-seleccione-ubicacion-boton-addEvento'>
                            <button onClick={() => handlePrevious()} className='botonCeleste-borde-blanco' id='button-volver-ubicacion'>
                                <FaCircleArrowLeft size={16} /> Volver a imágenes
                            </button>
                            <button onClick={handleEditarEvento} className='botonCeleste-borde-blanco' id='button-guardar-ubicacion'>
                                <FaRegSave /> Guardar
                            </button>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
}