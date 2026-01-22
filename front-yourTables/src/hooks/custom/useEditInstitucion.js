import { useState, useEffect } from 'react';
import { useUiStore } from '../../hooks/useUiStore';
import { useTablesStore } from '../useTableStore';
import { useInstitucionStore } from '../useInstitucionStore';
import { toast } from 'sonner';


export const useEditInstitucion = (id) => {

    const { modalAbierto, cerrarModal } = useUiStore();

    const { editarInstitucion, buscarInstitucionPorId } = useInstitucionStore();
    const { getLocalidades, getBarrios } = useTablesStore();

    const [institucionData, setInstitucionData] = useState({
        nombreInstitucion: '',
        encargadoODirector: '',
        localidad: '',
        barrio: '',
        direccion: '',
        ubicacion: {
            type: "Point",
            coordenadas: []
        }
    });
    const [isFormosa, setIsFormosa] = useState(true);

    const [localidades, setLocalidades] = useState([]);
    const [barrios, setBarrios] = useState([]);
    const [modalMapa, setModalMapa] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);


    useEffect(() => {
        if (modalAbierto === 'EditInstitucion' && id) {
            fetchInstitucion();
        }
    }, [modalAbierto, id]);

    useEffect(() => {
        if (modalAbierto === 'EditInstitucion') {
            fetchLocalidades();
            fetchBarrios();
        }
    }, [modalAbierto]);

    const fetchInstitucion = async () => {
        try {
            const institucion = await buscarInstitucionPorId(id);
            setInstitucionData({
                ...institucion
            });
            setIsFormosa(institucion.localidad === 'Ciudad de Formosa');
            if (institucion.ubicacion?.coordenadas) {
                setSelectedLocation(institucion.ubicacion.coordenadas);
            }
            console.log("Institución obtenida:", institucion);
        } catch (error) {
            console.error("Error al obtener la institución:", error);
        }
    };

    const fetchLocalidades = async () => {
        try {
            const data = await getLocalidades();
            setLocalidades(data);
        } catch (error) {
            console.error("Error al obtener localidades:", error);
        }
    };

    const fetchBarrios = async () => {
        try {
            const data = await getBarrios();
            setBarrios(data);
        } catch (error) {
            console.error("Error al obtener barrios:", error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInstitucionData(prev => ({ ...prev, [name]: value }));

        if (name === "localidad") {
            handleLocalidadChange(value);
        }
    };

    const handleLocalidadChange = (value) => {
        const localidadSeleccionada = localidades.find(localidad => localidad._id === value);
        setIsFormosa(localidadSeleccionada?.nombreLocalidad === 'Ciudad de Formosa');
    };

    const handleUbicacionChange = (location) => {
        setSelectedLocation(location);
        setInstitucionData(prev => ({
            ...prev,
            ubicacion: {
                type: "Point",
                coordenadas: [location.lng, location.lat]
            }
        }));
    };

    const handleEditarInstitucion = async (e) => {
        e.preventDefault();
        if (!id) {
            toast.error("ID de institución no válido.");
            return;
        };

        const formattedData = {
            ...institucionData,
            ubicacion: institucionData.ubicacion?.coordenadas?.length === 2
                ? {
                    type: "Point",
                    coordenadas: institucionData.ubicacion.coordenadas
                }
                : null,
        };

        try {
            const response = await editarInstitucion({ id, ...formattedData });
            if (response) {
                cerrarModal();
                setIsFormosa(true);
            }
        } catch (error) {
            console.error("Error al editar la institución:", error);
        }
    };

    return {
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
    };
}