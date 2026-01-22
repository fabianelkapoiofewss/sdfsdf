import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUiStore } from '../../hooks/useUiStore';
import { usePersonaStore } from '../usePersonaStore';
import { useTablesStore } from '../useTableStore';
import { useAdherenteStore } from '../useAdherenteStore';


export const useEditAdherente = (id) => {

    const { modalAbierto, cerrarModal } = useUiStore();
    const { editarAdherente, obtenerAdherente } = useAdherenteStore();
    const { getBarrios } = useTablesStore();
    const { buscarPersonas } = usePersonaStore();

    const { personas } = useSelector(state => state.datos);
    const [dirigenteData, setDirigenteData] = useState(null);

    const [step, setStep] = useState(1);
    const [selectedButton, setSelectedButton] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [searchPerformed, setSearchPerformed] = useState(false);

    const [selectedPersonaId, setSelectedPersonaId] = useState(null);
    const [selectedSuperiores, setSelectedSuperiores] = useState([]);

    const [barrios, setBarrios] = useState([]);
    const [barriosSeleccionados, setBarriosSeleccionados] = useState([]);

    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    const handleButtonClick = (type) => {
        setSelectedButton(type);
        setInputValue("");
        setSearchPerformed(false);
    };

    const fetchAdherente = async () => {
        try {
            const data = await obtenerAdherente(id);
            setDirigenteData(data);
            setSelectedPersonaId(data.persona._id);
            setSelectedSuperiores(data.superioresACargo);
            setBarriosSeleccionados(data.barriosACargo);
            setFechaDesde(data.fechaDesde ? new Date(data.fechaDesde).toISOString().split("T")[0] : "");
            setFechaHasta(data.fechaHasta ? new Date(data.fechaHasta).toISOString().split("T")[0] : "");
            console.log(data);
        } catch (error) {
            console.error("Error al obtener el adherente:", error);
        }
    };

    useEffect(() => {
        if (modalAbierto === 'EditAdherente' && id) {
            console.log("Ejecutando fetchAdherente con ID:", id);
            fetchAdherente();
        }
    }, [modalAbierto, id]);

    
    useEffect(() => {
        const fetchBarrios = async () => {
            try {
                const data = await getBarrios();
                setBarrios(data);
            } catch (error) {
                console.error("Error al obtener los barrios:", error);
            }
        };
        if (modalAbierto === 'EditAdherente' && id) {
            fetchBarrios();
        }
    }, [modalAbierto, id]);

    const handleRemoveBarrio = (barrio) => {
        setBarriosSeleccionados(prev => prev.filter(b => b._id !== barrio._id));
    };

    const handleEditarAdherente = async (e) => {
        e.preventDefault();
        const response = await editarAdherente({
            id,
            persona: selectedPersonaId,
            superioresACargo: selectedSuperiores.map(s => s._id),
            barriosACargo: barriosSeleccionados.map(b => b._id),
            fechaDesde,
            fechaHasta,
        });
        if (response) {
            setSelectedPersonaId(null);
            setSelectedSuperiores([]);
            setBarriosSeleccionados([]);
            setFechaDesde("");
            setFechaHasta("");
            cerrarModal();
            setStep(1);
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

    return {
        modalAbierto, cerrarModal,
        handleEditarAdherente,
        step, setStep,
        handleNext, handlePrevious,
        barrios, setBarriosSeleccionados, barriosSeleccionados,
        personas, selectedPersonaId, setSelectedPersonaId,
        selectedSuperiores, setSelectedSuperiores,
        inputValue, setInputValue,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        selectedButton, setSelectedButton,
        searchPerformed,
        handleRemoveBarrio,
        fetchAdherente,
        handleButtonClick
    }
};