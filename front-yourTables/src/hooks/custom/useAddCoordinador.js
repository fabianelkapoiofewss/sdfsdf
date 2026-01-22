import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useUiStore } from '../useUiStore.js';
import { useCoordinadorStore } from '../useCoordinadorStore.js';
import { usePersonaStore } from '../usePersonaStore.js';
import { limpiarDatos } from '../../store/tables/datosSlice.js'

import { toast } from 'sonner';

export const useAddCoordinador = () => {
    const dispatch = useDispatch();

    const { modalAbierto, cerrarModal } = useUiStore();

    const { crearCoordinador } = useCoordinadorStore();

    const [step, setStep] = useState(1);

    const [selectedPersonaId, setSelectedPersonaId] = useState(null);
    const [personasACargo, setPersonasACargo] = useState([]);

    const [jurisdiccionACargo, setJurisdiccionACargo] = useState([]);
    const [jurisdiccionesSeleccionadas, setJurisdiccionesSeleccionadas] = useState([]);
    const [fechaDesde, setFechaDesde] = useState("");

    useEffect(() => {
        if (selectedPersonaId) {
            dispatch(limpiarDatos()); // Limpia los datos en Redux
        }
    }, [selectedPersonaId]);

    const handleSelectCoordinador = (persona) => {
        if (persona.cargo === "Dirigente" || persona.cargo === "Adherente") {
            toast.error("Error", {
                description:`${persona.apellido} ${persona.nombre} tiene asignado el cargo de ${persona.cargo}. 
                    Selecciona una persona sin cargo.`,
                duration: 6000
            })
        } else if (persona.cargo === "Coordinador de Jurisdicción") {
            toast.error("Error", {
                description: `${persona.apellido} ${persona.nombre} ya es Coordinador de Jurisdicción. 
                    Selecciona una persona sin cargo.`,
                duration: 6000
            })
        } else {
            setSelectedPersonaId(persona._id);
            setStep(step + 1);
        }
    };

    const handleRemoveJurisdiccion = (index) => {
        setJurisdiccionesSeleccionadas(prev => prev.filter((_, i) => i !== index));
        setJurisdiccionACargo(prev => prev.filter((_, i) => i !== index));
    };    

    const handleSelectPersona = (persona) => {
        setPersonasACargo((prev) => {
            if (prev.some(p => p._id === persona._id)) {
                toast.error("Esta persona ya ha sido agregada.");
                return prev;
            }
            if (persona.cargo === "Coordinador de Jurisdicción" || persona.cargo === "Adherente") {
                toast.error("Error", {
                    description:`${persona.apellido} ${persona.nombre} tiene asignado el cargo de ${persona.cargo}. 
                        Selecciona una persona sin cargo on Dirigente sin Superior`,
                    duration: 6000
                })
                return prev;
            }
            return [...prev, persona];
        });
    };

    const handleRemovePersona = (persona) => {
        setPersonasACargo(prev => prev.filter(p => p._id !== persona._id));
    }

    const handleCrearCoordinador = async (e) => {
        e.preventDefault();
        try {
            const response = await crearCoordinador({
                persona: selectedPersonaId,
                jurisdiccionACargo,
                personasACargo: personasACargo.map(persona => persona._id),
                fechaDesde,
            });
            if (response) {
                setSelectedPersonaId(null);
                setJurisdiccionACargo([]);
                setJurisdiccionesSeleccionadas([]);
                setPersonasACargo([]);
                setFechaDesde("");
                cerrarModal();
                setStep(1);
            }
        } catch (error) {
            console.log("Error al crear coordinador", error)
        }

    };

    const handleNext = () => {
        if (step === 2 && jurisdiccionesSeleccionadas.length === 0) {
            toast.error("Seleccione al menos una jurisdicción.");
            return;
        } else if (step === 2 && jurisdiccionesSeleccionadas.length > 0) {
            setStep(step + 1);
        } else if (step === 3 && personasACargo.length === 0) {
            toast.error("Seleccione al menos una persona a cargo.");
            return;
        } else if (step === 3 && personasACargo.length > 0) {
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
        step, handleNext, handlePrevious,
        selectedPersonaId, setJurisdiccionACargo,
        jurisdiccionesSeleccionadas, setJurisdiccionesSeleccionadas,
        handleRemoveJurisdiccion,
        handleRemovePersona,
        handleSelectCoordinador, handleSelectPersona,
        fechaDesde, setFechaDesde,
        personasACargo, handleCrearCoordinador,
    }
}