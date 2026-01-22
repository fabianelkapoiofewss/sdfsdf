import { useForm } from "../../../hooks/useForm";
import { useUiStore } from "../../../hooks/useUiStore";

import { IoIosCloseCircle } from "react-icons/io";
import { GoOrganization } from "react-icons/go";

import { FaRegSave } from "react-icons/fa";
import { useBarrioStore } from "../../../hooks/useBarrioStore";
import '../../css/AddJurisdiccion.css';

const initialBarrio = {
    nombreBarrio: '',
}

export const AddBarrio = () => {

    const { modalAbierto, cerrarModal } = useUiStore();
    const { crearBarrio } = useBarrioStore();

    const {
        nombreBarrio,
        onInputChange,
        onResetForm
    } = useForm(initialBarrio);

    const crearBarrioSumbit = async (e) => {
        e.preventDefault();
        try {
            const response = await crearBarrio({ nombreBarrio });
            if (response) {
                onResetForm();
                cerrarModal();;
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div id='ModalAddBarrio' className={modalAbierto === 'AddBarrio' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>

            <div className='box-modal-add-jurisdiccion'>

                <div className="box-close-modal">
                    <h3><GoOrganization /> Agregar Barrio</h3>
                    <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
                </div>


                <div className='box-form-modal-agregarJurisdiccion'>

                    <form action="" className="form-agregarJurisdiccion" onSubmit={crearBarrioSumbit}>

                        <div className="box-inputs-add-jurisdiccion">

                            <label htmlFor="nombreBarrio">
                                Nombre Barrio
                            </label>
                            <input
                                type="text"
                                name="nombreBarrio"
                                id="nombreBarrio"
                                placeholder="Nombre del Barrio"
                                value={nombreBarrio}
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