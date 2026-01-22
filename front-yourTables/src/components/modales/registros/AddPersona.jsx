import '../../css/AddPersona.css';
import { useState, useEffect } from 'react';
import { useForm } from '../../../hooks/useForm.js';

import { IoIosCloseCircle } from "react-icons/io";
import { SiGooglemaps } from "react-icons/si";
import { FaRegSave } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";

import { useUiStore } from '../../../hooks/useUiStore.js';
import { usePersonaStore } from '../../../hooks/usePersonaStore.js';
import { useTablesStore } from '../../../hooks/useTableStore.js';

import { toast } from 'sonner';

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
const apiKeyMaps = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const initialPersona = {
  nombrePersona: '',
  apellidoPersona: '',
  dniPersona: '',
  nacimientoPersona: '',
  paisNacimiento: '',
  provinciaNacimiento: '',
  ciudadNacimiento: '',
  localidadPersona: '',
  sexoPersona: '',
  estadoCivilPersona: '' || null,
  ocupacionPersona: '',
  direccionPersona: '',
  barrioPersona: '',
  numeroTelefonoPersona: '',
  partidoPoliticoPersona: '' || null,
  ubicacion: {}
};

export const AddPersona = () => {

  const { modalAbierto, cerrarModal } = useUiStore();

  const { getBarrios, getLocalidades } = useTablesStore();
  const [barrios, setBarrios] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [isArgentina, setIsArgentina] = useState(true);
  const [isFormosa, setIsFormosa] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const dataBarrio = await getBarrios(); // Espera a que la promesa se resuelva
        setBarrios(dataBarrio); // Guarda los barrios en el estado
        const dataLocalidades = await getLocalidades()
        setLocalidades(dataLocalidades)
      } catch (error) {
        console.log('Error al obtener los datos:', error);
      }
    };

    if (modalAbierto === 'AddPersona') {
      fetchDatos(); // Llama a la función asíncrona solo si modalAbierto es 'AddPersona'
    }
  }, [modalAbierto]);


  const { crearPersona } = usePersonaStore();

  const { nombrePersona,
    apellidoPersona,
    dniPersona,
    nacimientoPersona,
    sexoPersona,
    paisNacimiento,
    provinciaNacimiento,
    ciudadNacimiento,
    localidadPersona,
    estadoCivilPersona,
    ocupacionPersona,
    direccionPersona,
    barrioPersona,
    numeroTelefonoPersona,
    partidoPoliticoPersona,
    onInputChange,
    onResetForm } = useForm(initialPersona);

  // Función para manejar el cambio del país
  const handleCountryChange = (event) => {
    const { value } = event.target;
    onInputChange(event); // Mantener el comportamiento original
    setIsArgentina(value === 'Argentina'); // Verificar si el país es Argentina
  };

  const handleLocalidadChange = (event) => {
    const { value } = event.target;
    onInputChange(event);
    const localidadSeleccionada = localidades.find(localidad => localidad._id === value);
    setIsFormosa(localidadSeleccionada?.nombreLocalidad === 'Ciudad de Formosa');
  };

  const [modalMapa, setModalMapa] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKeyMaps,
    libraries,
    language: 'es',
  });

  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
  };

  const crearPersonaSubmit = async (event) => {
    event.preventDefault();
    const ubicacion = selectedLocation
      ? {
        type: "Point",
        coordenadas: [selectedLocation.lng, selectedLocation.lat], // lng, lat
      }
      : {
        type: "Point",
        coordenadas: [0, 0], // valores predeterminados
      };
    console.log('desde crear persona', ubicacion);

    const barrioFinal = isFormosa ? barrioPersona : null;

    try {
      const response = await crearPersona({
        nombrePersona,
        apellidoPersona,
        dniPersona,
        nacimientoPersona,
        sexoPersona,
        paisNacimiento,
        provinciaNacimiento,
        ciudadNacimiento,
        localidadPersona,
        estadoCivilPersona,
        ocupacionPersona,
        direccionPersona,
        barrioPersona: barrioFinal,
        numeroTelefonoPersona,
        partidoPoliticoPersona,
        ubicacion
      })
      if (response) {
        onResetForm();
        cerrarModal();
        setIsFormosa(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // MAPA
  // const libraries = useMemo(() => ['places'], []);

  const openSaveUbi = () => {
    setModalMapa(true);
  };

  const saveUbi = () => {
    toast.success('Ubicación guardada', {
      duration: 1500
    })
    setModalMapa(false);
  };

  const closeSaveUbi = () => {
    setModalMapa(false);
  };

  useEffect(() => {
    if (selectedLocation) {
      console.log('Ubicación seleccionada:', selectedLocation);
    }
  }, [selectedLocation]);

  if (loadError) return <p>Error al cargar el mapa</p>;
  if (!isLoaded) return <p>Cargando...</p>;


  return (
    <div id='ModalAddPersona' className={modalAbierto === 'AddPersona' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>
      {!modalMapa ? (
        <div id='box-datos-add-persona' className='box-modal-add-persona'>
          <div className='box-close-modal'>
            <h3><FaRegUser /> Agregar Persona</h3>
            <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
          </div>
          <div className='box-form-modal-add'>
            <form id='form-create-persona' onSubmit={crearPersonaSubmit}>
              <div className='box-inputs-add-persona'>
                <label htmlFor="">Nombre</label>
                <input
                  type="text"
                  placeholder='Ingrese nombre de la Persona'
                  required
                  name='nombrePersona'
                  value={nombrePersona}
                  onChange={onInputChange}
                />
                <label htmlFor="">Apellido</label>
                <input
                  type="text"
                  placeholder='Ingrese apellido de la Persona'
                  required
                  name='apellidoPersona'
                  value={apellidoPersona}
                  onChange={onInputChange}
                />
                <label htmlFor="">DNI</label>
                <input
                  type="number"
                  placeholder='Ingrese DNI'
                  required
                  name='dniPersona'
                  value={dniPersona}
                  onChange={onInputChange}
                />
                <label htmlFor="">Sexo</label>
                <select
                  name='sexoPersona'
                  value={sexoPersona}
                  onChange={onInputChange}
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
                  name='nacimientoPersona'
                  value={nacimientoPersona}
                  onChange={onInputChange}
                />
                <label htmlFor="">Estado Civil</label>
                <select
                  name='estadoCivilPersona'
                  value={estadoCivilPersona}
                  onChange={onInputChange}
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

                <label htmlFor="">Ocupación</label>
                <input
                  type="text"
                  placeholder='Ingrese su ocupación'
                  name='ocupacionPersona'
                  value={ocupacionPersona}
                  onChange={onInputChange}
                />

                <label htmlFor="">Numero de Telefono</label>
                <input
                  type="text"
                  placeholder='+ 54'
                  name='numeroTelefonoPersona'
                  value={numeroTelefonoPersona}
                  onChange={onInputChange}
                />

              </div>
              <div className='box-inputs-add-persona'>

                <label htmlFor="">País de nacimiento</label>
                <select
                  name='paisNacimiento'
                  value={paisNacimiento}
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
                    value={provinciaNacimiento}
                    onChange={onInputChange}
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
                    value={provinciaNacimiento}
                    onChange={onInputChange}
                  />
                )}
                <label htmlFor="">Ciudad de nacimiento</label>
                <input
                  type="text"
                  // required
                  placeholder='Ingrese la Ciudad de nacimiento'
                  name='ciudadNacimiento'
                  value={ciudadNacimiento}
                  onChange={onInputChange}
                />
                <label htmlFor="">Localidad</label>
                <select
                  name='localidadPersona'
                  value={localidadPersona}
                  onChange={handleLocalidadChange}
                  required
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

                {isFormosa ? (
                  <>
                    <label htmlFor="">Barrio</label>
                    <select
                      name='barrioPersona'
                      value={barrioPersona}
                      onChange={onInputChange}
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
                  // required
                  placeholder='Ingrese la dirección actual'
                  name='direccionPersona'
                  value={direccionPersona}
                  onChange={onInputChange}
                />

                <label htmlFor="">Vota por:</label>
                <select
                  name="partidoPoliticoPersona"
                  value={partidoPoliticoPersona}
                  onChange={onInputChange}
                >
                  <option value="" disabled>
                    Seleccione un Partido Politico
                  </option>
                  <option value="PJ">PJ</option>
                  <option value="UCR">UCR</option>
                  <option value="LLA">LLA</option>
                  <option value="PRO">PRO</option>
                  <option value="Otros">Otros</option>
                </select>

                <button onClick={openSaveUbi} className='boton-borde-ubicacion'><SiGooglemaps /> Ubicación</button>

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
            <p className='boton-close' onClick={closeSaveUbi}><IoIosCloseCircle /></p>
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