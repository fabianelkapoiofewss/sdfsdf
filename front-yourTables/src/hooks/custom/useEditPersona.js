import { useState, useEffect } from 'react';
import { useUiStore } from '../../hooks/useUiStore';
import { usePersonaStore } from '../usePersonaStore';
import { useTablesStore } from '../useTableStore';
import { toast } from 'sonner';

export const useEditPersona = (id) => {
    const { modalAbierto, cerrarModal } = useUiStore();
    const { editarPersona, obtenerPersonaPorId } = usePersonaStore();
    const { getBarrios, getLocalidades } = useTablesStore();

    const [personaData, setPersonaData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        fechaNacimiento: '',
        sexo: '',
        paisNacimiento: '',
        provinciaNacimiento: '',
        ciudadNacimiento: '',
        estadoCivil: '',
        ocupacion: '',
        direccion: '',
        localidad: '',
        barrio: '',
        numeroTelefono: '',
        votaPor: '',
        cargo: '',
        ubicacion: {
            type: "Point",
            coordenadas: []
        }
    });
    const [barrios, setBarrios] = useState([]);
    const [localidades, setLocalidades] = useState([])
    const [isArgentina, setIsArgentina] = useState(true);
    const [isFormosa, setIsFormosa] = useState(true);
    const [modalMapa, setModalMapa] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        if (modalAbierto === 'EditPersona' && id) {
            fetchPersona();
        }
    }, [modalAbierto, id]);

    useEffect(() => {
        if (modalAbierto === 'EditPersona') {
            fetchBarrios();
            fetchLocalidades();
        }
    }, [modalAbierto]);

    const fetchPersona = async () => {
        try {
            const data = await obtenerPersonaPorId(id);

            const fecha = new Date(data.fechaNacimiento);
            const fechaFormateada = fecha.toISOString().split('T')[0];

            setPersonaData({ ...data, fechaNacimiento: fechaFormateada });
            setIsArgentina(data.paisNacimiento === 'Argentina');
            if (data.ubicacion?.coordenadas) {
                setSelectedLocation(data.ubicacion.coordenadas);
            }
            // console.log("Datos de la persona:", data);
        } catch (error) {
            console.error("Error al obtener la persona:", error);
        }
    };

    const fetchLocalidades = async () => {
        try {
            const data = await getLocalidades();
            setLocalidades(data);
        } catch (error) {
            console.error("Error al obtener las localidades:", error);
        }
    };

    const fetchBarrios = async () => {
        try {
            const data = await getBarrios();
            setBarrios(data);
        } catch (error) {
            console.error("Error al obtener los barrios:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPersonaData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocalidadChange = (e) => {
        const { value } = e.target;
        const localidadSeleccionada = localidades.find(localidad => localidad._id === value);
        setIsFormosa(localidadSeleccionada?.nombreLocalidad === 'Ciudad de Formosa');
    };

    const handleUbicacionChange = (location) => {
        setSelectedLocation(location);
        setPersonaData(prev => ({
            ...prev, ubicacion: {
                type: "Point",
                coordenadas: [location.lng, location.lat]
            }
        }));
    };

    const handleEditarPersona = async (e) => {
        e.preventDefault();
        if (!id) {
            toast.error("ID de persona no válido.");
            return;
        }


        const formattedData = {
            ...personaData,
            ubicacion: personaData.ubicacion?.coordenadas?.length === 2
                ? {
                    type: "Point",
                    coordenadas: personaData.ubicacion.coordenadas
                }
                : null,
        };

        console.log("Datos a enviar:", { id, ...formattedData });

        try {
            const response = await editarPersona({ id, ...formattedData });
            if (response) {
                cerrarModal();
                setIsFormosa(true);
            }
        } catch (error) {
            console.error("Error al editar la persona:", error);
        }
    };

    return {
        modalAbierto, cerrarModal,
        personaData, handleInputChange,
        handleEditarPersona,
        barrios, isArgentina,
        setIsArgentina,
        modalMapa, setModalMapa,
        selectedLocation, setSelectedLocation, handleUbicacionChange,
        localidades, handleLocalidadChange,
        isFormosa, setIsFormosa,
    };
};