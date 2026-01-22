import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useUiStore } from '../../hooks/useUiStore';
import { useTablesStore } from '../useTableStore';
import { useDirigenteStore } from '../useDirigenteStore';
import { limpiarDatos } from '../../store/tables/datosSlice';
import { toast } from 'sonner';

export const useAddDirigente = () => {
    const dispatch = useDispatch();

    const { modalAbierto, cerrarModal } = useUiStore();
    const { crearDirigente } = useDirigenteStore();

    const { getBarrios } = useTablesStore();

    const [step, setStep] = useState(1);

    const [selectedPersonaId, setSelectedPersonaId] = useState(null);
    const [selectedSuperiores, setSelectedSuperiores] = useState([]);
    const [personasACargo, setPersonasACargo] = useState([]);

    const [barrios, setBarrios] = useState([]);
    const [barriosSeleccionados, setBarriosSeleccionados] = useState([]);

    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    useEffect(() => {
        const fetchBarrios = async () => {
            try {
                const data = await getBarrios();
                setBarrios(data);
            } catch (error) {
                console.error("Error al obtener los barrios:", error);
            }
        };
        if (modalAbierto === "AddDirigente") {
            fetchBarrios();
        }
    }, [modalAbierto]);

    useEffect(() => {
        if (selectedPersonaId) {
            dispatch(limpiarDatos());
        }
    }, [selectedPersonaId]);

    const handleSelectDirigente = (persona) => {
        if (persona.cargo === "Coordinador de Jurisdicción" || persona.cargo === "Adherente") {
            toast.error("Error", {
                description:`${persona.apellido} ${persona.nombre} tiene asignado el cargo de ${persona.cargo}. 
                    Selecciona una persona sin cargo.`,
                duration: 6000
            })
        } else if (persona.cargo === "Dirigente") {
            toast.error("Error", {
                description: `${persona.apellido} ${persona.nombre} ya es Dirigente. 
                    Selecciona una persona sin cargo.`,
                duration: 6000
            })
        } else {
            setSelectedPersonaId(persona._id);
            setStep(step + 1);
        }
    };

    const handleSelectSuperior = (persona) => {
        setSelectedSuperiores((prev) => {
            if (prev.some(p => p._id === persona._id)) {
                toast.error("Este superior ya ha sido agregado.");
                return prev;
            }
            if (persona.cargo !== "Coordinador de Jurisdicción") {
                toast.error("Error", {
                    description: `${persona.apellido}, ${persona.nombre} no es Coordinador de Jurisdicción, no puede ser Superior. Selecciona un Coordinador.`,
                    duration: 6000
                });
                return prev;
            }
            const updated = [...prev, persona];
            setStep(step + 1);
            dispatch(limpiarDatos());
            return updated;
        });
    };

    const handleRemoveBarrio = (index) => {
        setBarriosSeleccionados(prev => prev.filter((_, i) => i !== index));
    }
    
    const handleSelectPersona = (persona) => {
        setPersonasACargo((prev) => {
            if (prev.some(p => p._id === persona._id)) {
                toast.error("Esta persona ya ha sido agregada.");
                return prev;
            }
            if (persona.cargo === "Coordinador de Jurisdicción" || persona.cargo === "Dirigente") {
                toast.error("Error", {
                    description:`${persona.apellido} ${persona.nombre} tiene asignado el cargo de ${persona.cargo}. 
                        Selecciona una persona sin cargo o un Adherente sin Superior.`,
                    duration: 6000
                })
                return prev;
            }
            return [...prev, persona];
        });
    }

    const handleRemovePersona = (persona) => {
        setPersonasACargo(prev => prev.filter(p => p._id !== persona._id));
    }

    const handleAgregarBarrio = (e) => {
        const selectedId = e.target.value;
        const selectedName = barrios.find(barrio => barrio._id === selectedId)?.nombreBarrio;

        if (selectedId && !barriosSeleccionados.some(b => b._id === selectedId)) {
            setBarriosSeleccionados(prev => [...prev, { _id: selectedId, nombreBarrio: selectedName }]);
        }
    };

    const handleCrearDirigente = async (e) => {
        e.preventDefault();
        const response = await crearDirigente({
            persona: selectedPersonaId,
            superioresACargo: selectedSuperiores.map(s => s._id),
            barriosACargo: barriosSeleccionados.map(b => b._id),
            personasACargo: personasACargo.map(persona => persona._id),
            fechaDesde,
            fechaHasta,
        });
        if (response) {
            setSelectedPersonaId(null);
            setBarriosSeleccionados([]);
            setPersonasACargo([]);
            setSelectedSuperiores([]);
            setFechaDesde("");
            setFechaHasta("");
            cerrarModal();
            setStep(1);
        }
    };

    const handleNext = () => {
        if (step === 3 && barriosSeleccionados.length === 0) {
            toast.error("Seleccione al menos un Barrio.");
            return;
        } else if (step === 3 && barriosSeleccionados.length > 0) {
            setStep(step + 1);
        } else if (step === 4 && personasACargo.length === 0) {
            toast.error("Seleccione al menos una persona a cargo.");
            return;
        } else if (step === 4 && personasACargo.length > 0) {
            setStep(step + 1);
        }
    }

    const handlePrevious = () => {
        if (step > 2) {
            setStep(step - 1);
        }
    }

    return {
        modalAbierto, cerrarModal,
        handleNext, handlePrevious,
        barrios, selectedPersonaId,
        selectedSuperiores, step,
        barriosSeleccionados,
        handleAgregarBarrio,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        handleSelectDirigente, handleSelectSuperior,
        handleSelectPersona, personasACargo,
        handleCrearDirigente,
        handleRemoveBarrio, handleRemovePersona
    }
}