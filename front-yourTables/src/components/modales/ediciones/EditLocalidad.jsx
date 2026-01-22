import { IoIosCloseCircle } from "react-icons/io";
import { GoOrganization } from "react-icons/go";
import { FaRegSave } from "react-icons/fa";
import { useEditLocalidad } from "../../../hooks/custom/useEditLocalidad";
import "../../css/AddJurisdiccion.css";

export const EditLocalidad = ({ idRegistro }) => {
    const {
        modalAbierto,
        cerrarModal,
        handleEditLocalidad,
        nombreLocalidad,
        setNombreLocalidad,
        departamento,
        setDepartamento
    } = useEditLocalidad(idRegistro);

    return (
        <div id="ModalEditLocalidad" className={modalAbierto === "EditLocalidad" ? "modalMostrarActivo" : "modalMostrarInactivo"}>
            <div className="box-modal-add-jurisdiccion">
                <div className="box-close-modal">
                    <h3>
                        <GoOrganization /> Editar Localidad
                    </h3>
                    <p className="boton-close" onClick={cerrarModal}>
                        <IoIosCloseCircle />
                    </p>
                </div>

                <div className="box-form-modal-agregarJurisdiccion">

                    <form className="form-agregarJurisdiccion" onSubmit={handleEditLocalidad}>

                        <div className="box-inputs-add-jurisdiccion">

                            <label htmlFor="nombreBarrio">Nombre Localidad</label>
                            <input
                                type="text"
                                name="nombreLocalidad"
                                id="nombreLocalidad"
                                placeholder="Nombre de la Localidad"
                                value={nombreLocalidad}
                                onChange={(e) => setNombreLocalidad(e.target.value)}
                                required
                            />

                            <label htmlFor="departamento">
                                Departamento
                            </label>
                            <select name="departamento" id="" value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
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

                        <div className="box-form-button-save-juris">
                            <button type="submit" className="botonCeleste-borde-blanco">
                                <FaRegSave /> Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};