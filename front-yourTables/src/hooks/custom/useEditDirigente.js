import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUiStore } from '../../hooks/useUiStore';
import { usePersonaStore } from '../usePersonaStore';
import { useTablesStore } from '../useTableStore';
import { useDirigenteStore } from '../useDirigenteStore';
import { toast } from 'sonner';

export const useEditDirigente = (id) => {

    const { modalAbierto, cerrarModal } = useUiStore();
    const { editarDirigente, obtenerDirigente } = useDirigenteStore();
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
    const [personasACargo, setPersonasACargo] = useState([]);

    const [barrios, setBarrios] = useState([]);
    const [barriosSeleccionados, setBarriosSeleccionados] = useState([]);

    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    const handleButtonClick = (type) => {
        setSelectedButton(type);
        setInputValue("");
        setSearchPerformed(false);
    };

    const handleRemovePersona = (persona) => {
        setPersonasACargo(prev => prev.filter(p => p._id !== persona._id));
    }

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

    const handleSelectPersona = (persona) => {
        setPersonasACargo((prev) => {
            if (prev.some(p => p._id === persona._id)) {
                toast.error("Esta persona ya ha sido agregada.");
                return prev;
            }
            if (persona.cargo === "Coordinador de Jurisdicción" || persona.cargo === "Dirigente") {
                toast.error("Error", {
                    description: `Esta persona ya tiene un cargo asignado: ${persona.cargo}. 
                        Selecciona un Adherente o una persona sin cargo.`,
                    duration: 5000
                })
                return prev;
            }
            return [...prev, persona];
        });
        setSearchPerformed(false);
        setSelectedButton(null);
        setInputValue('');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (selectedButton && inputValue.trim()) {
            buscarPersonas({ campo: selectedButton, valor: inputValue.trim() });
            setSearchPerformed(true);
        } else {
            alert("Por favor complete todos los campos.");
        }
    };

    const fetchDirigente = async () => {
        try {
            const data = await obtenerDirigente(id);
            setDirigenteData(data);
            setSelectedPersonaId(data.persona._id);
            setSelectedSuperiores(data.superioresACargo);
            setPersonasACargo(data.personasACargo);
            setBarriosSeleccionados(data.barriosACargo);
            setFechaDesde(data.fechaDesde ? new Date(data.fechaDesde).toISOString().split("T")[0] : "");
            setFechaHasta(data.fechaHasta ? new Date(data.fechaHasta).toISOString().split("T")[0] : "");
            console.log(data);
        } catch (error) {
            console.error("Error al obtener el dirigente:", error);
        }
    };

    useEffect(() => {
        if (modalAbierto === 'EditDirigente' && id) {
            console.log("Ejecutando fetchDirigente con ID:", id);
            fetchDirigente();
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
        if (modalAbierto === 'EditDirigente' && id) {
            fetchBarrios();
        }
    }, [modalAbierto, id]);

    const handleRemoveBarrio = (barrio) => {
        setBarriosSeleccionados(prev => prev.filter(b => b._id !== barrio._id));
    };

    const handleEditarDirigente = async (e) => {
        e.preventDefault();
        const response = await editarDirigente({
            id,
            persona: selectedPersonaId,
            superioresACargo: selectedSuperiores.map(s => s._id),
            barriosACargo: barriosSeleccionados.map(b => b._id),
            personasACargo: personasACargo.map(p => p._id).filter(id => id),
            fechaDesde,
            fechaHasta,
        });
        if (response) {
            setSelectedPersonaId(null);
            setSelectedSuperiores([]);
            setBarriosSeleccionados([]);
            setPersonasACargo([]);
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
        handleEditarDirigente,
        step, handleNext, handlePrevious,
        barrios, setBarriosSeleccionados, barriosSeleccionados,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        personasACargo, handleRemoveBarrio,
        handleSelectPersona,
        handleRemovePersona
    };
};