import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { IoIosCloseCircle } from "react-icons/io"
import { BiSolidInstitution } from "react-icons/bi";
import { FaRegSave } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";

import { useUiStore } from "../../../hooks/useUiStore";
import { useTablesStore } from "../../../hooks/useTableStore";
import { useInstitucionStore } from "../../../hooks/useInstitucionStore";
import { useForm } from "../../../hooks/useForm";

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
const apiKeyMaps = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

import '../../css/AddInstitucion.css';

const initialInstitucion = {
    nombreInstitucion: '',
    encargadoInstitucion: '',
    localidadInstitucion: '',
    barrioInstitucion: '',
    direccionInstitucion: '',
    ubicacion: {}
};


export const AddInstitucion = () => {

    const { crearInstitucion } = useInstitucionStore();
    const { getBarrios, getLocalidades } = useTablesStore();
    const { modalAbierto, cerrarModal } = useUiStore();

    const [barrios, setBarrios] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [modalMapa, setModalMapa] = useState(false);
    const [isFormosa, setIsFormosa] = useState(true);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const dataBarrio = await getBarrios();
                setBarrios(dataBarrio);
                const dataLocalidades = await getLocalidades();
                setLocalidades(dataLocalidades);
            } catch (error) {
                console.log('Error al obtener los datos:', error);
            }
        };

        if (modalAbierto === 'AddInstitucion') {
            fetchDatos();
        }
    }, [modalAbierto]);

    const { nombreInstitucion,
        encargadoInstitucion,
        localidadInstitucion,
        barrioInstitucion,
        direccionInstitucion,
        onInputChange,
        onResetForm
    } = useForm(initialInstitucion)

    const handleLocalidadChange = (event) => {
        const { value } = event.target;
        onInputChange(event);
        const localidadSeleccionada = localidades.find(localidad => localidad._id === value);
        setIsFormosa(localidadSeleccionada?.nombreLocalidad === 'Ciudad de Formosa');
    };

    const crearInstitucionSubmit = (event) => {
        event.preventDefault();
        const ubicacion = selectedLocation
            ? {
                type: "Point",
                coordenadas: [selectedLocation.lng, selectedLocation.lat], // lng, lat
            }
            : {
                type: "Point",
                coordenadas: [0, 0], // valores por defecto
            };
        console.log('desde crear institucion', ubicacion);

        const barrioFinal = isFormosa ? barrioInstitucion : null;

        try {
            crearInstitucion({
                nombreInstitucion,
                encargadoInstitucion,
                localidadInstitucion,
                barrioInstitucion: barrioFinal,
                direccionInstitucion,
                ubicacion
            })
            onResetForm(); // Limpia el formulario
            setSelectedLocation(null); // Reinicia la ubicación seleccionada
            cerrarModal();
        } catch (error) {
            console.log(error);
        }
    }

    // const libraries = useMemo(() => ['places'], []);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKeyMaps,
        libraries,
        language: 'es',
    });

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

    const onMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setSelectedLocation({ lat, lng });
    };

    useEffect(() => {
        if (selectedLocation) {
            console.log('Ubicación seleccionada:', selectedLocation);
        }
    }, [selectedLocation]);

    if (loadError) return <p>Error al cargar el mapa</p>;
    if (!isLoaded) return <p>Cargando...</p>;

    return (
        <div id='ModalAddInstitucion' className={modalAbierto === 'AddInstitucion' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>
            {!modalMapa ? (
                <div id="box-datos-add-institucion" className="box-modal-add-institucion">

                    <div className='box-close-modal'>
                        <h3><BiSolidInstitution /> Agregar Institucion</h3>
                        <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
                    </div>
                    
                    <div className='box-form-modal-add-institucion'>
                        <form id='form-create-institucion' onSubmit={crearInstitucionSubmit}>
                            <div className='box-inputs-add-institucion'>
                                <label htmlFor="">Nombre de la Institución</label>
                                <input
                                    type="text"
                                    placeholder='Ingrese nombre de la institución'
                                    required
                                    name='nombreInstitucion'
                                    value={nombreInstitucion}
                                    onChange={onInputChange}

                                />
                                <label htmlFor="">Encargado/Director</label>
                                <input
                                    type="text"
                                    placeholder='Ingrese el nombre del Encargado o Director'
                                    required
                                    name='encargadoInstitucion'
                                    value={encargadoInstitucion}
                                    onChange={onInputChange}
                                />
                                <label htmlFor="">Localidad</label>
                                <select
                                    name='localidadInstitucion'
                                    required
                                    value={localidadInstitucion}
                                    onChange={handleLocalidadChange}
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
                                            name='barrioInstitucion'
                                            value={barrioInstitucion}
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
                                    required
                                    placeholder='Ingrese la dirección actual'
                                    name='direccionInstitucion'
                                    value={direccionInstitucion}
                                    onChange={onInputChange}
                                />
                                <button onClick={openSaveUbi} className='boton-borde-ubicacion'><SiGooglemaps /> Ubicación</button>
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