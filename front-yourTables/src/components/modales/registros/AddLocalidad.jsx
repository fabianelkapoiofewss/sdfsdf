import { useForm } from "../../../hooks/useForm";
import { useUiStore } from "../../../hooks/useUiStore";

import { IoIosCloseCircle } from "react-icons/io";
import { GoOrganization } from "react-icons/go";

import { FaRegSave } from "react-icons/fa";
import { useLocalidadStore } from "../../../hooks/useLocalidadStore";
import '../../css/AddJurisdiccion.css';

const initialLocalidad = {
    nombreLocalidad: '',
    departamento: ''
}

export const AddLocalidad = () => {

    const { modalAbierto, cerrarModal } = useUiStore();
    const { crearLocalidad } = useLocalidadStore();

    const {
        nombreLocalidad,
        departamento,
        onInputChange,
        onResetForm
    } = useForm(initialLocalidad);

    const crearLocalidadSumbit = async (e) => {
        e.preventDefault();
        try {
            const response = await crearLocalidad({ nombreLocalidad, departamento });
            if (response) {
                onResetForm();
                cerrarModal();;
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div id='ModalAddLocalidad' className={modalAbierto === 'AddLocalidad' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>

            <div className='box-modal-add-jurisdiccion'>

                <div className="box-close-modal">
                    <h3><GoOrganization /> Agregar Localidad</h3>
                    <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
                </div>


                <div className='box-form-modal-agregarJurisdiccion'>

                    <form action="" className="form-agregarJurisdiccion" onSubmit={crearLocalidadSumbit}>

                        <div className="box-inputs-add-jurisdiccion">

                            <label htmlFor="nombreLocalidad">
                                Nombre Localidad
                            </label>
                            <input
                                type="text"
                                name="nombreLocalidad"
                                id="nombreLocalidad"
                                placeholder="Nombre de la Localidad"
                                value={nombreLocalidad}
                                onChange={onInputChange}
                                required
                            />

                            <label htmlFor="departamento">
                                Departamento
                            </label>
                            <select name="departamento" id="" value={departamento} onChange={onInputChange} required>
                                <option disabled value="">Seleccione el departamento</option>
                                <option value="Bermejo">Bermejo</option>
                                <option value="Formosa">Formosa</option>
                                <option value="Laishí">Laishí</option>
                                <option value="Matacos">Matacos</option>
                                <option value="Patiño">Patiño</option>
                                <option value="Pilagás">Pilagás</option>
                                <option value="Pilcomayo">Pilcomayo</option>
                                <option value="Pirané">Pirané</option>
                                <option value="Ramón Lista">Ramón Lista</option>
                            </select>

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