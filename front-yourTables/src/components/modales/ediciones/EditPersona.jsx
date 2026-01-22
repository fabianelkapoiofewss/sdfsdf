import { useState, useEffect } from "react";
import { useEditPersona } from "../../../hooks/custom/useEditPersona";
import { FaRegSave, FaRegUser } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { SiGooglemaps } from "react-icons/si";
const apiKeyMaps = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

import '../../css/AddPersona.css';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};


export const EditPersona = ({ idRegistro }) => {

  const {
    modalAbierto, cerrarModal,
    personaData, handleInputChange,
    handleEditarPersona,
    barrios, isArgentina,
    setIsArgentina,
    modalMapa, setModalMapa,
    selectedLocation, setSelectedLocation,
    handleUbicacionChange,
    localidades, handleLocalidadChange,
    isFormosa
  } = useEditPersona(idRegistro);


  const handleCountryChange = (event) => {
    const { value } = event.target;
    console.log("Cambio de país:", value);
    handleInputChange(event); // Mantener el comportamiento original
    setIsArgentina(value === 'Argentina'); // Verificar si el país es Argentina
  };


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
      const coords = personaData.ubicacion?.coordenadas;
      if (coords) {
        const [lng, lat] = coords;
        setSelectedLocation({ lat, lng });
      }
    }
  }, [modalMapa]);

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

  const saveUbi = () => {
    if (selectedLocation) {
      console.log("Guardando ubicación:", selectedLocation);
      handleUbicacionChange(selectedLocation);
    }
    setModalMapa(false);
  };


  return (
    <div id='ModalEditPersona' className={modalAbierto === 'EditPersona' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>
      {!modalMapa ? (
        <div id='box-datos-add-persona' className='box-modal-add-persona'>
          <div className='box-close-modal'>
            <h3><FaRegUser /> Editar Persona</h3>
            <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
          </div>
          <div className='box-form-modal-add'>
            <form id='form-create-persona' onSubmit={handleEditarPersona}>
              <div className='box-inputs-add-persona'>
                <label htmlFor="">Nombre</label>
                <input
                  type="text"
                  placeholder='Ingrese nombre de la Persona'
                  required
                  name='nombre'
                  value={personaData.nombre || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="">Apellido</label>
                <input
                  type="text"
                  placeholder='Ingrese apellido de la Persona'
                  required
                  name='apellido'
                  value={personaData.apellido || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="">DNI</label>
                <input
                  type="number"
                  placeholder='Ingrese DNI'
                  required
                  name='dni'
                  value={personaData.dni || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="">Sexo</label>
                <select
                  name='sexo'
                  value={personaData.sexo || ''}
                  onChange={handleInputChange}
                  // required
                >
                  <option value="" disabled>
                    Seleccione una opción
                  </option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
                <label htmlFor="">Fecha de Nacimiento</label>
                <input
                  type="date"
                  placeholder='Ingrese fecha de nacimiento'
                  // required
                  name='fechaNacimiento'
                  value={personaData.fechaNacimiento || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="">Estado Civil</label>
                <select
                  name='estadoCivil'
                  value={personaData.estadoCivil || ''}
                  onChange={handleInputChange}
                  // required
                >
                  <option value="" disabled>
                    Seleccione una opción
                  </option>
                  <option value="Soltero">Soltero</option>
                  <option value="Casado">Casado</option>
                  <option value="Viudo">Viudo</option>
                  <option value="Divorciado">Divorciado</option>
                </select>
                <label htmlFor="">Numero de Telefono</label>
                <input
                  type="text"
                  placeholder='+ 54'
                  name='numeroTelefono'
                  // required
                  value={personaData.numeroTelefono || ''}
                  onChange={handleInputChange}
                />
                <label>Cargo:</label>
                <input 
                  type="text"
                  placeholder="Ingrese el cargo"
                  name="cargo"
                  disabled
                  value={personaData.cargo || ''}
                  onChange={handleInputChange}
                />

              </div>
              <div className='box-inputs-add-persona'>

                <label htmlFor="">País de nacimiento</label>
                <select
                  name='paisNacimiento'
                  value={personaData.paisNacimiento || ''}
                  onChange={handleCountryChange} // Manejar el cambio de país
                >
                  <option value="" disabled>
                    Seleccione País
                  </option>
                  <option value="Argentina">Argentina</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Brasil">Brasil</option>
                  <option value="Chile">Chile</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Surinam">Surinam</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Otro">Otro</option>
                </select>

                <label htmlFor="">Provincia de nacimiento</label>
                {isArgentina ? (
                  <select
                    name='provinciaNacimiento'
                    value={personaData.provinciaNacimiento || ''}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Seleccione Provincia
                    </option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="Catamarca">Catamarca</option>
                    <option value="Chaco">Chaco</option>
                    <option value="Chubut">Chubut</option>
                    <option value="Córdoba">Córdoba</option>
                    <option value="Corrientes">Corrientes</option>
                    <option value="Entre Ríos">Entre Ríos</option>
                    <option value="Formosa">Formosa</option>
                    <option value="Jujuy">Jujuy</option>
                    <option value="La Pampa">La Pampa</option>
                    <option value="La Rioja">La Rioja</option>
                    <option value="Mendoza">Mendoza</option>
                    <option value="Misiones">Misiones</option>
                    <option value="Neuquén">Neuquén</option>
                    <option value="Río Negro">Río Negro</option>
                    <option value="Salta">Salta</option>
                    <option value="San Juan">San Juan</option>
                    <option value="San Luis">San Luis</option>
                    <option value="Santa Cruz">Santa Cruz</option>
                    <option value="Santa Fe">Santa Fe</option>
                    <option value="Santiago del Estero">Santiago del Estero</option>
                    <option value="Tierra del Fuego">Tierra del Fuego</option>
                    <option value="Tucumán">Tucumán</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Ingrese su provincia"
                    name="provinciaNacimiento"
                    value={personaData.provinciaNacimiento || ''}
                    onChange={handleInputChange}
                  />
                )}
                <label htmlFor="">Ciudad de nacimiento</label>
                <input
                  type="text"
                  // required
                  placeholder='Ingrese la Ciudad de nacimiento'
                  name='ciudadNacimiento'
                  value={personaData.ciudadNacimiento || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="">Dirección actual</label>
                <input
                  type="text"
                  // required
                  placeholder='Ingrese la dirección actual'
                  name='direccion'
                  value={personaData.direccion || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="">Ocupación</label>
                <input
                  type="text"
                  // required
                  placeholder='Ingrese su ocupación'
                  name='ocupacion'
                  value={personaData.ocupacion || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="">Localidad</label>
                <select
                  name='localidad'
                  value={personaData.localidad || ''}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleLocalidadChange(e);
                  }}
                >
                  <option value="" disabled>
                    Seleccione localidad
                  </option>
                  {localidades.map((localidad) => (
                    <option key={localidad._id} value={localidad._id}>
                      {localidad.nombreLocalidad}
                    </option>
                  ))}
                </select>
                {isFormosa ? (
                  <>
                <label htmlFor="">Barrio</label>
                <select
                  name='barrio'
                  value={personaData.barrio || ''}
                  onChange={handleInputChange}
                  // required
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
                <label htmlFor="">Vota por:</label>
                <select name="votaPor" value={personaData.votaPor || ''} onChange={handleInputChange}>
                  <option value="" disabled>
                    Seleccione un Partido
                  </option>
                  <option value="PJ">PJ</option>
                  <option value="UCR">UCR</option>
                  <option value="LLA">LLA</option>
                  <option value="PRO">PRO</option>
                  <option value="Otros">Otros</option>
                </select>

                <button onClick={() => setModalMapa(true)} className='boton-borde-ubicacion'><SiGooglemaps /> Ubicación</button>

              </div>
              <div className='box-form-button'>
                <button type='submit' className='botonCeleste-borde-blanco'><FaRegSave /> Guardar</button>
              </div>
            </form>
          </div>

        </div>
      ) : (
        <div id='box-ubicacion-main' className={modalMapa ? 'box-ubicacion' : 'modalMostrarInactivo'}>
          <div id='box-seleccione-ubicacion-titulo'>
            <h3>Seleccione Ubicación</h3>
            <p className='boton-close' onClick={() => setModalMapa(false)}><IoIosCloseCircle /></p>
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
  )
}