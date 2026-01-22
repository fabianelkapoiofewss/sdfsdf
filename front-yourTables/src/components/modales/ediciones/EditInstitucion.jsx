import { useState, useEffect } from "react";
import { useEditInstitucion } from "../../../hooks/custom/useEditInstitucion";
import { FaRegSave, FaRegUser } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { SiGooglemaps } from "react-icons/si";
import { toast } from "sonner";
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
const apiKeyMaps = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

export const EditInstitucion = ({ idRegistro }) => {

    const {
        modalAbierto, cerrarModal,
        institucionData, setInstitucionData,
        handleInputChange,
        handleEditarInstitucion,
        localidades, barrios,
        isFormosa, setIsFormosa,
        modalMapa, setModalMapa,
        selectedLocation, setSelectedLocation,
        handleUbicacionChange,
        handleLocalidadChange
    } = useEditInstitucion(idRegistro);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKeyMaps,
        libraries,
        language: 'es',
    });

    useEffect(() => {
        if (loadError) {
          console.error("Error al cargar Google Maps:", loadError);
        }
      }, [loadError]);
    
      useEffect(() => {
        if (modalMapa) {
          const coords = institucionData.ubicacion?.coordenadas;
          if (coords) {
            const [lng, lat] = coords;
            setSelectedLocation({ lat, lng });
          }
        }
      }, [modalMapa]);

    const saveUbi = () => {
        if (selectedLocation) {
          console.log("Guardando ubicación:", selectedLocation);
          handleUbicacionChange(selectedLocation);
        }
        setModalMapa(false);
      };


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

      const openMapModal = () => setModalMapa(true);
      const closeMapModal = () => setModalMapa(false);


    return (
        <div
            id='ModalEditInstitucion'
            className={modalAbierto === 'EditInstitucion' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}
        >
            {!modalMapa ? (
                <div id="box-datos-edit-institucion" className="box-modal-add-institucion">

                    <div className='box-close-modal'>
                        <h3><FaRegUser /> Editar Institución</h3>
                        <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
                    </div>

                    <div className='box-form-modal-add'>
                        <form id='form-create-institucion' onSubmit={handleEditarInstitucion}>
                            <div className='box-inputs-add-institucion'>
                                <label htmlFor="">Nombre de la Institución</label>
                                <input
                                    type="text"
                                    placeholder='Ingrese nombre de la institución'
                                    required
                                    name='nombreInstitucion'
                                    value={institucionData.nombreInstitucion || ''}
                                    onChange={handleInputChange}

                                />
                                <label htmlFor="">Encargado/Director</label>
                                <input
                                    type="text"
                                    placeholder='Ingrese el nombre del Encargado o Director'
                                    required
                                    name='encargadoODirector'
                                    value={institucionData.encargadoODirector || ''}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="">Localidad</label>
                                <select
                                    name='localidad'
                                    required
                                    value={institucionData.localidad || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>
                                        Seleccione Localidad
                                    </option>
                                    {localidades.map((localidad) => (
                                        <option key={localidad._id} value={localidad._id}>
                                            {localidad.nombreLocalidad}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='box-inputs-add-institucion'>
                                {isFormosa ? (
                                    <>
                                        <label htmlFor="">Barrio</label>
                                        <select
                                            name='barrio'
                                            value={institucionData.barrio || ''}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="" disabled>
                                                Seleccione barrio
                                            </option>
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
                                <label htmlFor="">Dirección actual</label>
                                <input
                                    type="text"
                                    required
                                    placeholder='Ingrese la dirección actual'
                                    name='direccion'
                                    value={institucionData.direccion}
                                    onChange={handleInputChange}
                                />
                                <button onClick={openMapModal} className='boton-borde-ubicacion'><SiGooglemaps /> Ubicación</button>
                            </div>
                            <div className='box-form-button-ubi-institucion'>
                                <button type='submit' className='botonCeleste-borde-blanco'><FaRegSave /> Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div id='box-ubicacion-main' className={modalMapa ? 'box-ubicacion' : 'modalMostrarInactivo'}>
                    <div id='box-seleccione-ubicacion-titulo'>
                        <h3>Seleccione Ubicación</h3>
                        <p className='boton-close' onClick={closeMapModal}><IoIosCloseCircle /></p>
                    </div>

                    <div id='box-seleccione-ubicacion-mapa'>
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
                            {selectedLocation && selectedLocation.lat && selectedLocation.lng && (
                                <Marker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
                            )}
                        </GoogleMap>
                    </div>
                    <div id='box-seleccione-ubicacion-boton'>
                        <button onClick={saveUbi} className='botonCeleste-borde-blanco'><FaRegSave /> Guardar Ubicación</button>
                    </div>

                </div>
            )}
        </div>
    );
}