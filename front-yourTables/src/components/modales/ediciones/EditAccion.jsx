import { IoIosCloseCircle } from "react-icons/io";
import { GoOrganization } from "react-icons/go";
import { FaRegSave } from "react-icons/fa";
import { useEditAccion } from "../../../hooks/custom/useEditAccion";
import "../../css/AddJurisdiccion.css";

export const EditAccion = ({ idRegistro }) => {
    const {
        modalAbierto,
        cerrarModal,
        handleEditAccion,
        nombreAccion,
        setNombreAccion
    } = useEditAccion(idRegistro);

    return (
        <div id="ModalEditBarrio" className={modalAbierto === "EditAccion" ? "modalMostrarActivo" : "modalMostrarInactivo"}>
            <div className="box-modal-add-jurisdiccion">
                <div className="box-close-modal">
                    <h3>
                        <GoOrganization /> Editar Acción
                    </h3>
                    <p className="boton-close" onClick={cerrarModal}>
                        <IoIosCloseCircle />
                    </p>
                </div>

                <div className="box-form-modal-agregarJurisdiccion">
                    <form className="form-agregarJurisdiccion" onSubmit={handleEditAccion}> 
                        <div className="box-inputs-add-jurisdiccion">
                            <label htmlFor="nombreBarrio">Nombre Acción</label>
                            <input
                                type="text"
                                name="nombreBarrio"
                                id="nombreBarrio"
                                placeholder="Nombre de la Acción"
                                value={nombreAccion}
                                onChange={(e) => setNombreAccion(e.target.value)}
                                required
                            />
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