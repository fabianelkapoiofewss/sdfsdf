import { useEffect, useState } from "react";
import { useForm } from "../../../hooks/useForm";
import { useTablesStore } from "../../../hooks/useTableStore";
import { useUiStore } from "../../../hooks/useUiStore";

import { IoIosCloseCircle } from "react-icons/io";
import { GoOrganization } from "react-icons/go";

import '../../css/AddJurisdiccion.css';
import { useJurisdiccionStore } from "../../../hooks/useJurisdiccionStore";
import { FaRegSave } from "react-icons/fa";

const initialJurisdiccion = {
    nombreJurisdiccion: '',
    barrios: []
}

export const AddJurisdiccion = () => {

    const { modalAbierto, cerrarModal } = useUiStore();
    const { getBarrios } = useTablesStore();
    const { crearJurisdiccion } = useJurisdiccionStore();

    const [barriosData, setBarriosData] = useState([]);
    const [barriosSeleccionados, setBarriosSeleccionados] = useState([]);

    useEffect(() => {
        const fetchBarrios = async () => {
            try {
                const data = await getBarrios();
                setBarriosData(data);
            } catch (error) {
                console.log('Error al obtener los barrios:', error);
            }
        };

        if (modalAbierto === 'AddJurisdiccion') {
            fetchBarrios();
            setBarriosSeleccionados([]);
        }
    }, [modalAbierto]);


    const {
        nombreJurisdiccion,
        barrios,
        onInputChange,
        onResetForm
    } = useForm(initialJurisdiccion);

    const toggleBarrio = (barrioId) => {
        setBarriosSeleccionados((prev) =>
            prev.includes(barrioId)
                ? prev.filter((id) => id !== barrioId)
                : [...prev, barrioId]
        );
    };

    const crearJurisdiccionSumbit = async (e) => {
        e.preventDefault();
        try {
            const response = await crearJurisdiccion({ 
                nombreJurisdiccion, 
                barrios: barriosSeleccionados 
            });
            if (response) {
                setBarriosSeleccionados([]);
                onResetForm();
                cerrarModal();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div id='ModalAddJurisdiccion' className={modalAbierto === 'AddJurisdiccion' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>

            <div className='box-modal-add-jurisdiccion'>

                <div className="box-close-modal">
                    <h3><GoOrganization /> Agregar Jurisdicción</h3>
                    <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
                </div>


                <div className='box-form-modal-agregarJurisdiccion'>

                    <form action="" className="form-agregarJurisdiccion" onSubmit={crearJurisdiccionSumbit}>

                        <div className="box-inputs-add-jurisdiccion">

                            <label htmlFor="nombreJurisdiccion">
                                Nombre Jurisdicción
                            </label>
                            <input
                                type="text"
                                name="nombreJurisdiccion"
                                id="nombreJurisdiccion"
                                placeholder="Nombre de la Jurisdicción"
                                value={nombreJurisdiccion}
                                onChange={onInputChange}
                                required
                            />


                            <label htmlFor="barrios">Barrios de la Jurisdicción</label>
                            <div className="checkbox-container">
                                {barriosData.map((barrio) => (
                                    <label key={barrio._id} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            value={barrio._id}
                                            checked={barriosSeleccionados.includes(barrio._id)}
                                            onChange={() => toggleBarrio(barrio._id)}
                                        />
                                        {barrio.nombreBarrio}
                                    </label>
                                ))}
                            </div>

                        </div>

                        <div className='box-inputs-add-jurisdiccion'>

                            <h3>Barrios seleccionados</h3>
                            <ul id="box-list-barrios-seleccionados-jurisdiccion">
                                {barriosSeleccionados.length > 0 ? (
                                    barriosSeleccionados.map((id) => {
                                        const barrio = barriosData.find((b) => b._id === id);
                                        return <li key={id}>{barrio?.nombreBarrio}</li>;
                                    })
                                ) : (
                                    <li>Ningún barrio seleccionado</li>
                                )}
                            </ul>
                        </div>

                        <div className='box-form-button-save-juris'>
                            <button type='submit' className='botonCeleste-borde-blanco'><FaRegSave /> Guardar</button>
                        </div>


                    </form>

                </div>




            </div>
        </div>
    );
}