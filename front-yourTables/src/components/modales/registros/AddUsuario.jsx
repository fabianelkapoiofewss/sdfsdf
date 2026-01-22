import { useForm } from "../../../hooks/useForm";
import { useUiStore } from "../../../hooks/useUiStore";

import { IoIosCloseCircle } from "react-icons/io";
import { GoOrganization } from "react-icons/go";

import { FaRegSave, FaUser } from "react-icons/fa";
import { useUsuarioStore } from "../../../hooks/useUsuarioStore";
import '../../css/AddJurisdiccion.css';

const initialUsuario = {
    nombreUsuario: '',
    contrasena: '',
}

export const AddUsuario = () => {

    const { modalAbierto, cerrarModal } = useUiStore();
    const { crearUsuario } = useUsuarioStore();

    const {
        nombreUsuario,
        contrasena,
        onInputChange,
        onResetForm
    } = useForm(initialUsuario);

    const crearUsuarioSumbit = async (e) => {
        e.preventDefault();
        try {
            const response = await crearUsuario({ nombreUsuario, contrasena });
            if (response) {
                onResetForm();
                cerrarModal();;
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div id='ModalAddUsuario' className={modalAbierto === 'AddUsuario' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>

            <div className='box-modal-add-jurisdiccion'>

                <div className="box-close-modal">
                    <h3><FaUser /> Agregar Usuario al Sistema</h3>
                    <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
                </div>


                <div className='box-form-modal-agregarJurisdiccion'>

                    <form action="" className="form-agregarJurisdiccion" onSubmit={crearUsuarioSumbit}>

                        <div className="box-inputs-add-jurisdiccion">

                            <label htmlFor="nombreUsuario">
                                Nombre de Usuario
                            </label>
                            <input
                                type="text"
                                name="nombreUsuario"
                                id="nombreUsuario"
                                placeholder="Nombre del Usuario"
                                value={nombreUsuario}
                                onChange={onInputChange}
                                required
                            />

                            <label htmlFor="contrasena">
                                Contraseña
                            </label>
                            <input
                                type="text"
                                name="contrasena"
                                id="contrasena"
                                placeholder="Contraseña"
                                value={contrasena}
                                onChange={onInputChange}
                                required
                            />

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