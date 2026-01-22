import '../../css/AddEvento.css';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { GrWorkshop } from "react-icons/gr";
import { IoIosCloseCircle } from "react-icons/io";
import { FaSearch, FaTimes } from "react-icons/fa";
import { FaRegSave } from "react-icons/fa";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";

import { useUiStore } from '../../../hooks/useUiStore.js';
import { useTablesStore } from '../../../hooks/useTableStore.js';
import { usePersonaStore } from '../../../hooks/usePersonaStore.js';
import { useInstitucionStore } from '../../../hooks/useInstitucionStore.js';

import { limpiarDatos } from '../../../store/tables/datosSlice.js'
import { useEventoStore } from '../../../hooks/useEventoStore.js';

import { useForm } from '../../../hooks/useForm.js';

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { BuscarPersonas } from '../../BuscarPersonas.jsx';

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
  direccionPersona: '',
  barrioPersona: '',
  numeroTelefonoPersona: '',
};

export const AddEvento = () => {

  const dispatch = useDispatch();

  const { crearEvento } = useEventoStore();

  const { personas, instituciones } = useSelector(state => state.datos)

  const { modalAbierto, cerrarModal } = useUiStore();
  const { getAcciones, getBarrios, getLocalidades } = useTablesStore();

  const { buscarPersonas, crearPersona } = usePersonaStore();
  const { buscarInstituciones } = useInstitucionStore();

  const [primeraParte, setPrimeraParte] = useState(false);
  const [parteImagenes, setParteImagenes] = useState(false);
  const [parteBeneficiario, setParteBeneficiario] = useState(false);

  const [fechaEvento, setFechaEvento] = useState('');
  const [accionSeleccionada, setAccionSeleccionada] = useState('');
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState('')
  const [barrioSeleccionado, setBarrioSeleccionado] = useState(null);
  const [direccion, setDireccion] = useState('');
  const [detalle, setDetalle] = useState('');

  const [acciones, setAcciones] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [isFormosa, setIsFormosa] = useState(true);

  const [archivos, setArchivos] = useState([])

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [organizador, setOrganizador] = useState([]); // Array para almacenar las personas seleccionadas
  const [verMapa, setVerMapa] = useState(false)

  // lógica para búsqueda
  const [tipoBusqueda, setTipoBusqueda] = useState(''); // 'persona' o 'institucion'
  const [inputBusqueda, setInputBusqueda] = useState('');

  const [beneficiarios, setBeneficiarios] = useState([]);
  const [beneficiarioId, setBeneficiarioId] = useState([]);

  // Buscar Persona
  const [selectedButton, setSelectedButton] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false); // Indica si se realizó una búsqueda

  // formulario para registrar persona a cargo del evento
  // en caso de que no esté previamente cargada
  const [registrarAsistente, setRegistrarAsistente] = useState(false);

  const { nombrePersona,
    apellidoPersona,
    dniPersona,
    direccionPersona,
    barrioPersona,
    numeroTelefonoPersona,
    onInputChange,
    onResetForm
  } = useForm(initialPersona);

  const crearPersonaSubmit = async (event) => {
    event.preventDefault();
    try {
      const nuevaPersona = await crearPersona({
        nombrePersona,
        apellidoPersona,
        dniPersona,
        direccionPersona,
        barrioPersona,
        numeroTelefonoPersona,
      })
      if (nuevaPersona) {
        // console.log('Nueva persona creada:', nuevaPersona);
        handleSelectBeneficiario(nuevaPersona);
        onResetForm();
      }
      // setRegistrarAsistente(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchAccBarr = async () => {
      try {
        const dataAcciones = await getAcciones(); // Espera a que la promesa se resuelva
        setAcciones(dataAcciones); // Guarda los barrios en el estado
        const dataBarrios = await getBarrios(); // Espera a que la promesa se resuelva
        setBarrios(dataBarrios); // Guarda los barrios en el estado
        const dataLocalidades = await getLocalidades();
        setLocalidades(dataLocalidades)

      } catch (error) {
        console.log('Error al obtener los barrios:', error);
      }
    };
    if (modalAbierto === 'AddEvento') {
      fetchAccBarr();
    }
  }, [modalAbierto]);

  const handleSelectPersona = (persona) => {
    setOrganizador((prev) => {
      if (prev.some(p => p._id === persona._id)) {
        toast.error("Esta persona ya ha sido agregada.");
        return prev;
      }
      console.log('Organizador previo:', persona);
      return [...prev, persona];
    });
  };

  const handleSelectBeneficiario = (bene) => {
    setBeneficiarios((prev) => {
      // Evitar duplicados verificando si el ID ya está en la lista
      if (prev.some((b) => b._id === bene._id)) {
        toast.error("Esta persona ya ha sido agregada.");
        return prev;
      }
      return [...prev, bene]; // Agregar nuevo beneficiario sin borrar los anteriores
    });
    setBeneficiarioId((prevIds) => [...prevIds, bene._id]);
    setSearchPerformed(false);
  };

  const eliminarBeneficiario = (beneficiario) => {
    setBeneficiarios((prev) => prev.filter(bene => bene._id !== beneficiario._id));
  };

  const handleButtonClick = (type) => {
    setSelectedButton(type); // Establece el botón seleccionado
    setInputBusqueda(""); // Limpia el input al cambiar el botón
    setSearchPerformed(false); // Resetea el estado de búsqueda
  };

  const handleBuscar = async (e) => {
    try {
      if (tipoBusqueda === 'Persona') {
        e.preventDefault();
        if (selectedButton && inputBusqueda.trim()) {
          const resultadoBusqueda = await buscarPersonas({ campo: selectedButton, valor: inputBusqueda.trim() });
          if (resultadoBusqueda.length > 0) {
            setInputBusqueda('')
            setSearchPerformed(true)
          } else {
            setRegistrarAsistente(true);
            setInputBusqueda('');
            setSelectedButton(null);
          }
        } else {
          alert("Por favor complete todos los campos.");
        }
      } else if (tipoBusqueda === 'Institucion') {
        e.preventDefault();
        buscarInstituciones({ valor: inputBusqueda.trim() });
        setSearchPerformed(true); // Marca que se realizó una búsqueda
      } else {
        e.preventDefault();
        if (selectedButton && inputBusqueda.trim()) {
          buscarPersonas({ campo: selectedButton, valor: inputBusqueda.trim() });
          setSearchPerformed(true); // Marca que se realizó una búsqueda
        } else {
          alert("Por favor complete todos los campos.");
        }
      }
    } catch (error) {
      console.error('Error al buscar:', error);
    }
  };

  const getPlaceholder = () => {
    switch (selectedButton) {
      case "dni":
        return "Ingrese DNI";
      case "apellido":
        return "Ingrese Apellido";
      case "nombre":
        return "Ingrese Nombre";
      default:
        return "Ingrese valor";
    }
  };

  const handleRemovePersona = (persona) => {
    setOrganizador((prev) => prev.filter(p => p._id !== persona._id));
  }
  // Efecto para limpiar y permitir nuevas búsquedas
  useEffect(() => {
    if (beneficiarios && beneficiarios.length > 0) {
      dispatch(limpiarDatos());
      setInputBusqueda("");
      setSelectedButton(null);
      console.log('beneficiario', beneficiarios);
    }
  }, [beneficiarios]);


  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKeyMaps,
    libraries,
    language: 'es',
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      setError("Puedes subir un máximo de 10 imágenes.");
      return;
    }
    setError(null);
    const newImages = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setArchivos((prev) => [...prev, ...files]);
    setImages((prev) => [...prev, ...newImages]);
  };
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setArchivos((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const [selectedLocation, setSelectedLocation] = useState(null);

  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
  };

  const handleLocalidadChange = (event) => {
    const { value } = event.target;
    setLocalidadSeleccionada(value);
    const localidadObj = localidades.find(localidad => localidad._id === value);
    const esFormosa = localidadObj?.nombreLocalidad === 'Ciudad de Formosa';
    setIsFormosa(esFormosa);
    if (!esFormosa) {
      setBarrioSeleccionado(null);
    }
  };

  const saveUbi = async () => {

    const ubicacion = selectedLocation
      ? {
        type: "Point",
        coordenadas: [selectedLocation.lng, selectedLocation.lat], // lng, lat
      }
      : {
        type: "Point",
        coordenadas: [0, 0], // valores predeterminados
      };

    console.log("Ubicación guardada:", ubicacion);

    const beneficiariosAsistentes = beneficiarioId.map(id => ({
      tipo: tipoBusqueda,
      referencia: id
    }));

    const barrioFinal = isFormosa ? barrioSeleccionado : null;

    try {
      const response = await crearEvento({
        organizador,
        fechaEvento,
        accionSeleccionada,
        localidadSeleccionada,
        barrioSeleccionado: barrioFinal,
        direccion,
        detalle,
        beneficiariosAsistentes,
        ubicacion,
        archivos
      })

      setVerMapa(false);
      setOrganizador([]);
      setFechaEvento("");
      setAccionSeleccionada("");
      setLocalidadSeleccionada("");
      setBarrioSeleccionado(null);
      setDireccion("");
      setDetalle("");
      setBeneficiarios([]);
      setBeneficiarioId([]);
      setSelectedLocation(null);
      setTipoBusqueda("");
      setInputBusqueda("");
      setSelectedButton(null);
      setSearchPerformed(false);
      setArchivos([]);
      setImages([]);
      setVerMapa(false);
      setPrimeraParte(false);
      setParteImagenes(false);
      cerrarModal();


    } catch (error) {
      setBeneficiarios([]);
      console.log(error);
      toast.error("Error al crear el evento");
    }

  };

  useEffect(() => {
    if (selectedLocation) {
      console.log('Ubicación seleccionada:', selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [images]);


  if (loadError) return <p>Error al cargar el mapa</p>;
  if (!isLoaded) return <p>Cargando...</p>;

  return (
    <div id='ModalAddEvento' className={modalAbierto === 'AddEvento' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>

      <div className='box-modal-add-evento'>

        <div className='box-close-modal'>
          <h3><GrWorkshop /> Agregar Evento</h3>
          <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
        </div>

        {!primeraParte ? (
          <>
            <div id='primera-caja-prin-addEvento'>

              <div id='primera-caja-prin-addEvento-first'>

                <h3>Organizado por:</h3>

                <BuscarPersonas selectPersona={handleSelectPersona} />

              </div>
              <div id='primera-caja-prin-addEvento-second'>
                <h3>Organizador del Evento:</h3>
                <ul>
                  {organizador.map((persona, index) => (
                    <li id='box-li-add-organizador-evento' key={index}>{persona.apellido}, {persona.nombre} - {persona.cargo} &nbsp;
                      <p><FaTimes id='boton-remove-organizador' onClick={() => handleRemovePersona(persona)} /></p>
                    </li>
                  ))}
                </ul>

              </div>

            </div>
            <div id='box-primer-parte-siguiente-addEvento'>
              <button onClick={() => setPrimeraParte(true)} className='botonCeleste-borde-blanco'>
                Cargar cabecera <FaCircleArrowRight size={16} />
              </button>
            </div>
          </>
        ) : primeraParte && !parteBeneficiario && !verMapa && !parteImagenes ? (
          <>
            <div id='primera-caja-prin-addEvento'>

              <div id='primera-caja-prin-addEvento-first'>
                <h3>Fecha del Evento</h3>
                <input
                  type="date"
                  value={fechaEvento}
                  onChange={(e) => setFechaEvento(e.target.value)}
                />
                <h3>Seleccionar Acción realizada</h3>
                <select
                  value={accionSeleccionada}
                  onChange={(e) => setAccionSeleccionada(e.target.value)}
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
                  value={localidadSeleccionada}
                  onChange={handleLocalidadChange}
                  required
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
                        value={barrioSeleccionado}
                        onChange={(e) => setBarrioSeleccionado(e.target.value)}
                        required
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
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                  <label htmlFor="detalle">Descripción</label>
                  <textarea
                    type="text"
                    placeholder='Puedes dejar algún detalle del evento'
                    name='detalle'
                    value={detalle}
                    onChange={(e) => setDetalle(e.target.value)}
                  />
                </div>
              </div>

            </div>
            <div className='box-botons-prev-next-event'>
              <div id='box-atras-addEvento'>
                <button onClick={() => setPrimeraParte(false)} className='botonCeleste-borde-blanco'>
                  <FaCircleArrowLeft size={16} /> Volver a Organizador
                </button>
              </div>
              <div id='box-siguiente-addEvento'>
                <button onClick={() => setParteBeneficiario(true)} className='botonCeleste-borde-blanco'>
                  Cargar Benef/Asist <FaCircleArrowRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : parteBeneficiario && primeraParte && !parteImagenes && !verMapa ? (
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
                                // required
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
                                // required
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
                    {beneficiarios.length > 0 ? (
                      beneficiarios.map((bene) => (
                        <li id='box-li-asistente-evento' key={bene._id}>{bene.nombreInstitucion || `${bene.dni} - ${bene.apellido} ${bene.nombre}`}&nbsp;
                          {/* <p><FaTimes id='boton-remove-asitente' onClick={() => eliminarBeneficiario(bene)} /></p> */}
                        </li>
                      ))
                    ) : (
                      <p>No hay beneficiarios/asistentes seleccionados.</p>
                    )}
                  </ul>
                </>

              </div>
            </div>
            <div className='box-botons-prev-next-event'>
              <div id='box-atras-addEvento'>
                <button onClick={() => setParteBeneficiario(false)} className='botonCeleste-borde-blanco'>
                  <FaCircleArrowLeft size={16} /> Volver a cabecera
                </button>
              </div>
              <div id='box-siguiente-addEvento'>
                <button onClick={() => setParteImagenes(true)} className='botonCeleste-borde-blanco'>
                  Cargar imagen/mapa <FaCircleArrowRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : !verMapa && parteImagenes && primeraParte ? (
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
                <button onClick={() => setParteImagenes(false)} className='botonCeleste-borde-blanco'>
                  <FaCircleArrowLeft size={16} /> Volver a Benif/Asist
                </button>
              </div>
              <div id='box-siguiente-addEvento'>
                <button onClick={() => setVerMapa(true)} className='botonCeleste-borde-blanco'>
                  Cargar mapa <FaCircleArrowRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : verMapa ? (
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
                {selectedLocation && selectedLocation.lat && selectedLocation.lng && (
                  <Marker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
                )}
              </GoogleMap>
            </div>
            <div id='box-seleccione-ubicacion-boton-addEvento'>
              <button onClick={() => setVerMapa(false)} className='botonCeleste-borde-blanco' id='button-volver-ubicacion'>
                <FaCircleArrowLeft size={16} /> Volver a imágenes
              </button>
              <button onClick={saveUbi} className='botonCeleste-borde-blanco' id='button-guardar-ubicacion'>
                <FaRegSave /> Guardar
              </button>
            </div>
          </>
        ) : (
          null
        )}

      </div>

    </div>
  )
}