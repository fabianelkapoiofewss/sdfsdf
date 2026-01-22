import { useState } from "react";
import { useSelector } from 'react-redux';
import PulseLoader from "react-spinners/PulseLoader";
import { FaSearch } from "react-icons/fa";
import { toast } from "sonner";

import { usePersonaStore } from "../hooks/usePersonaStore";

import './css/BuscarPersonas.css';

export const BuscarPersonas = ({ selectPersona }) => {

    const { personas } = useSelector(state => state.datos);

    const { buscarPersonas } = usePersonaStore();

    const [loading, setLoading] = useState(false);
    const [inputBusqueda, setInputBusqueda] = useState('');
    const [selectedButton, setSelectedButton] = useState(null);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const handleButtonClick = (type) => {
        setSelectedButton(type);
        setInputBusqueda("");
        setSearchPerformed(false);
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

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!selectedButton || !inputBusqueda.trim()) {
            toast.info("Por favor complete todos los campos");
            return;
        }

        setLoading(true);
        setSearchPerformed(true);

        try {
            await buscarPersonas({ campo: selectedButton, valor: inputBusqueda.trim() });
        } catch (error) {
            toast.error("Error al buscar personas");
        } finally {
            setLoading(false);
        }
    };

    const handlePersonaSeleccionada = (persona) => {
        selectPersona(persona);
        setSearchPerformed(false);
        setSelectedButton(null);
        setInputBusqueda('');
    };

    return (
        <>
            <div id='box-modal-add-evento-buttons'>
                {["dni", "apellido", "nombre"].map((tipo) => (
                    <button
                        key={tipo}
                        className={`botonVerde-borde-blanco ${selectedButton === tipo ? "botonActivo" : ""}`}
                        onClick={() => handleButtonClick(tipo)}
                    >
                        Buscar por {tipo === "dni" ? tipo.toUpperCase() : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </button>
                ))}
            </div>


            {selectedButton && (
                <div id='box-modal-add-evento-input'>
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder={getPlaceholder()}
                            value={inputBusqueda}
                            onChange={(e) => setInputBusqueda(e.target.value)} />
                        <button type='submit' className='botonCeleste-borde-blanco'><FaSearch /></button>
                    </form>
                </div>
            )}

            {searchPerformed && (
                <div id='box-modal-add-register-results-search'>
                    {loading ? (
                        <div className='box-loading-results-search-personas'>
                            <p>Buscando persona...</p>
                            <PulseLoader color="white" size={8} />
                        </div>
                    ) : (
                        personas.length > 0 ? (
                            <table className='tabla-resultados'>
                                <thead>
                                    <tr>
                                        <th>Apellido</th>
                                        <th>Nombre</th>
                                        <th>DNI</th>
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
                                                <button onClick={() => handlePersonaSeleccionada(persona)} className='botonCeleste-borde-blanco'>
                                                    Seleccionar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className='box-loading-results-search-personas'>
                                <p>No se encontraron personas.</p>
                            </div>
                        )
                    )}
                </div>
            )}
        </>
    )
}