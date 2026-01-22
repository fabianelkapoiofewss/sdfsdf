import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { useForm } from "../useForm";
import { useUiStore } from '../../hooks/useUiStore';
import { useTablesStore } from '../useTableStore';
import { useEventoStore } from '../useEventoStore';
import { usePersonaStore } from "../usePersonaStore";
import { useInstitucionStore } from "../useInstitucionStore";
import { limpiarDatos } from "../../store/tables/datosSlice";


const initialPersona = {
    nombrePersona: '',
    apellidoPersona: '',
    dniPersona: '',
    direccionPersona: '',
    barrioPersona: '',
    numeroTelefonoPersona: '',
};

export const useEditEvento = (id) => {

    const dispatch = useDispatch();

    const { personas, instituciones } = useSelector(state => state.datos)

    const { modalAbierto, cerrarModal } = useUiStore();

    const { obtenerEventoPorId, editarEvento } = useEventoStore();
    const { buscarPersonas, crearPersona } = usePersonaStore();
    const { buscarInstituciones } = useInstitucionStore();

    const { getAcciones, getBarrios, getLocalidades } = useTablesStore();

    const [eventoData, setEventoData] = useState({});

    const [acciones, setAcciones] = useState([]);
    const [barrios, setBarrios] = useState([]);
    const [localidades, setLocalidades] = useState([]);

    const [step, setStep] = useState(1);

    const [isFormosa, setIsFormosa] = useState(Boolean);

    const [tipoBusqueda, setTipoBusqueda] = useState('');
    const [inputBusqueda, setInputBusqueda] = useState('');
    const [selectedButton, setSelectedButton] = useState(null);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [registrarAsistente, setRegistrarAsistente] = useState(false);

    const [organizadorDelEvento, setOrganizadorDelEvento] = useState([]);

    const [fecha, setFecha] = useState('');
    const [accion, setAccion] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [barrio, setBarrio] = useState('');
    const [direccion, setDireccion] = useState('');
    const [detalle, setDetalle] = useState('');

    const [beneficiariosOAsistentes, setBeneficiariosOAsistentes] = useState([]);
    const [beneficiarioId, setBeneficiarioId] = useState([]);

    const [archivos, setArchivos] = useState([])

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [ubicacion, setUbicacion] = useState({})
    const [selectedLocation, setSelectedLocation] = useState(null);

    const fetchEvento = async () => {
        try {
            const data = await obtenerEventoPorId(id);
            setEventoData(data);
            setOrganizadorDelEvento(data.organizadorDelEvento || []);
            setFecha(data.fecha ? new Date(data.fecha).toISOString().split('T')[0] : '');
            setAccion(data.accion);
            setLocalidad(data.localidad);
            setBarrio(data.barrio);
            setDireccion(data.direccion);
            setDetalle(data.detalle);
            setBeneficiariosOAsistentes(data.beneficiariosOAsistentes || []);
            setBeneficiarioId(data.beneficiariosOAsistentes.map(persona => persona.referencia._id));
            setImages(data.archivos.map((url) => ({
                file: null,
                previewUrl: url,
                isNew: false
            })));
            setUbicacion(data.ubicacion);
            if (data.ubicacion?.coordenadas) {
                setSelectedLocation(data.ubicacion.coordenadas);
            }
        } catch (error) {
            console.log('Error al obtener datos del evento:', error);
        }
    }

    useEffect(() => {
        if (modalAbierto === 'EditEvento' && id) {
            fetchEvento();
        }
    }, [modalAbierto, id]);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const dataAcciones = await getAcciones();
                setAcciones(dataAcciones);
                const dataLocalidades = await getLocalidades();
                setLocalidades(dataLocalidades)
                const dataBarrios = await getBarrios();
                setBarrios(dataBarrios);
            } catch (error) {
                console.log('Error al obtener datos:', error);
            }
        };
        if (modalAbierto === 'EditEvento') {
            fetchDatos();
        }
    }, [modalAbierto]);

    useEffect(() => {
        if (localidad && localidades.length > 0) {
            const localidadSeleccionada = localidades.find(loc => loc._id === localidad);
            const esFormosa = localidadSeleccionada?.nombreLocalidad === 'Ciudad de Formosa';
            setIsFormosa(esFormosa);
        }
    }, [localidad, localidades]);


    useEffect(() => {
        if (beneficiariosOAsistentes && beneficiariosOAsistentes.length > 0) {
            dispatch(limpiarDatos());
            setInputBusqueda("");
            setSelectedButton(null);
        }
    }, [beneficiariosOAsistentes]);


    const handleSelectOrganizador = (persona) => {
        setOrganizadorDelEvento((prev) => {
            if (prev.some(p => p._id === persona._id)) {
                toast.error("Esta persona ya ha sido agregada como Organizador.");
                return prev;
            }
            return [...prev, persona];
        });
    };

    const handleRemoveOrganizador = (persona) => {
        setOrganizadorDelEvento((prev) => prev.filter(p => p._id !== persona._id));
    }

    const handleSelectBeneficiario = (bene) => {
        setBeneficiariosOAsistentes((prev) => {
            if (prev.some((b) => b._id === bene._id)) {
                toast.error("Esta persona ya ha sido agregada.");
                return prev;
            }
            console.log('Beneficiario previo:', bene);
            return [...prev, bene];
        });
        setBeneficiarioId((prevIds) => [...prevIds, bene._id]);
        setSearchPerformed(false);
    };

    const handleRemoveBeneficiario = (persona) => {
        setBeneficiariosOAsistentes((prev) => prev.filter(p => p._id !== persona._id));
    }

    const handleLocalidadChange = (event) => {
        const { value } = event.target;
        setLocalidad(value);
        const localidadSeleccionada = localidades.find(localidad => localidad._id === value);
        const esFormosa = localidadSeleccionada?.nombreLocalidad === 'Ciudad de Formosa';
        setIsFormosa(esFormosa);

        if (!esFormosa) {
            setBarrio('');
        }
    };

    const handleButtonClick = (type) => {
        setSelectedButton(type);
        setInputBusqueda("");
        setSearchPerformed(false);
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
                    toast.info("Por favor complete todos los campos");
                }
            } else if (tipoBusqueda === 'Institucion') {
                e.preventDefault();
                buscarInstituciones({ valor: inputBusqueda.trim() });
                setSearchPerformed(true);
            } else {
                e.preventDefault();
                if (selectedButton && inputBusqueda.trim()) {
                    buscarPersonas({ campo: selectedButton, valor: inputBusqueda.trim() });
                    setSearchPerformed(true);
                } else {
                    toast.info("Por favor complete todos los campos");
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
                handleSelectBeneficiario(nuevaPersona);
                onResetForm();
            }
        } catch (error) {
            console.log(error);
        }
    }

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
            isNew: true
        }));
        setArchivos((prev) => [...prev, ...files]);
        setImages((prev) => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setArchivos((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleUbicacionChange = (location) => {
        setSelectedLocation(location);
        setUbicacion({
            type: "Point",
            coordenadas: [location.lng, location.lat]
        })
    };

    const handleEditarEvento = async (e) => {
        e.preventDefault();

        const archivosNuevos = images
            .filter(img => img.isNew && img.file)
            .map(img => img.file);

        const imagenesMantener = images
            .filter(img => !img.isNew)
            .map(img => img.previewUrl);

        const beneficiariosOAsistentes = beneficiarioId.map(id => ({
            tipo: tipoBusqueda,
            referencia: id
        }));

        const formattedData = {
            organizadorDelEvento,
            fecha,
            accion,
            localidad,
            barrio,
            direccion,
            detalle,
            beneficiariosOAsistentes,
            archivosNuevos,
            imagenesMantener
        }

        const ubicacionFinal = {
            ...formattedData,
            ubicacion: ubicacion?.coordenadas?.length === 2
                ? {
                    type: "Point",
                    coordenadas: ubicacion.coordenadas
                }
                : null,
        };

        try {
            const response = await editarEvento({
                id, ...ubicacionFinal
            });
            cerrarModal();
            setStep(1);
            setIsFormosa(true);

        } catch (error) {
            console.error("Error al editar el evento:", error);
        }
    };


    const handleNext = () => {
        setStep(step + 1);
    }
    const handlePrevious = () => {
        if (step >= 2) {
            setStep(step - 1);
        }
    }

    useEffect(() => {
        return () => {
            images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
        };
    }, [images]);

    return {
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
    }
}