import { useState } from "react";
import '../../css/AddAccion.css';

import { IoIosCloseCircle } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";

import { useUiStore } from '../../../hooks/useUiStore.js';
import { useAccionStore } from "../../../hooks/useAccionStore.js";

export const AddAccion = () => {

    const { modalAbierto, cerrarModal } = useUiStore();
    const { crearAccion } = useAccionStore();

    const [nombreAccion, setNombreAccion] = useState('');

    const handleNombreAccion = (e) => {
        setNombreAccion(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        crearAccion({
            nombreAccion,
        });
        cerrarModal();
    };

    return (
        <div id='ModalAddAccion' className={modalAbierto === 'AddAccion' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>

            <div id='box-modal-add-accion'>

                <div className="box-close-modal">
                    <h3><FaRegUser />Agregar Acción</h3>
                    <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
                </div>

                <div className='box-form-modal-agregarAccion'>

                    <form action="" className="form-agregarAccion" onSubmit={handleSubmit}>

                        <div className="box-inputs-add-accion">

                            <label htmlFor="nombreAccion">
                                Nombre Acción
                            </label>
                            <input
                                type="text"
                                placeholder="Nombre de la Acción"
                                value={nombreAccion}
                                onChange={handleNombreAccion}
                            />

                        </div>

                        <div className="box-form-button-save-accion">
                            <button type="submit" className='botonCeleste-borde-blanco'>Agregar</button>
                        </div>

                    </form>

                </div>

            </div>
        </div>
    );
}