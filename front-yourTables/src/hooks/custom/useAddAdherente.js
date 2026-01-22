import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useUiStore } from '../../hooks/useUiStore';
import { useTablesStore } from '../useTableStore';
import { useAdherenteStore } from '../useAdherenteStore';
import { limpiarDatos } from '../../store/tables/datosSlice';
import { toast } from 'sonner';

export const useAddAdherente = () => {
    const dispatch = useDispatch();

    const { modalAbierto, cerrarModal } = useUiStore();
    const { crearAdherente } = useAdherenteStore();

    const { getBarrios } = useTablesStore();

    const [step, setStep] = useState(1);

    const [selectedPersonaId, setSelectedPersonaId] = useState(null);
    const [selectedSuperiores, setSelectedSuperiores] = useState([]);

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
        if (modalAbierto === 'AddAdherente') {
            fetchBarrios();
        }
    }, [modalAbierto]);


    useEffect(() => {
        if (selectedPersonaId) {
            dispatch(limpiarDatos());
        }
    }, [selectedPersonaId]);

    const handleSelectAdherente = (persona) => {
        if (persona.cargo === "Coordinador de Jurisdicción" || persona.cargo === "Dirigente") {
            toast.error("Error", {
                description: `${persona.apellido} ${persona.nombre} tiene asignado el cargo de ${persona.cargo}. 
                    Selecciona una persona sin cargo.`,
                duration: 6000
            })
        } else if (persona.cargo === "Adherente") {
            toast.error("Error", {
                description: `${persona.apellido} ${persona.nombre} ya es Adherente. 
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
            if (persona.cargo !== "Dirigente") {
                toast.error("Error", {
                    description: `${persona.apellido}, ${persona.nombre} no es Dirigente, no puede ser Superior. Selecciona un Dirigente.`,
                    duration: 6000
                });
                return prev;
            }
            const updated = [...prev, persona];
            setStep(step + 1);
            dispatch(limpiarDatos());
            return updated;
        });
    }

    const handleAgregarBarrio = (e) => {
        const selectedId = e.target.value;
        const selectedName = barrios.find(barrio => barrio._id === selectedId)?.nombreBarrio;

        if (selectedId && !barriosSeleccionados.some(b => b._id === selectedId)) {
            setBarriosSeleccionados(prev => [...prev, { _id: selectedId, nombreBarrio: selectedName }]);
        }
    };

    const handleRemoveBarrio = (index) => {
        setBarriosSeleccionados(prev => prev.filter((_, i) => i !== index));
    }

    const handleCrearAdherente = async (e) => {
        e.preventDefault();

        const response = await crearAdherente({
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
        if (step === 3 && barriosSeleccionados.length === 0) {
            toast.error("Seleccione al menos un Barrio.");
            return;
        } else if (step === 3 && barriosSeleccionados.length > 0) {
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
        handleSelectAdherente, handleSelectSuperior,
        handleCrearAdherente,
        handleRemoveBarrio
    }
}