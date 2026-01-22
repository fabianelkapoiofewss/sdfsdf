import { IoIosCloseCircle } from "react-icons/io";
import { GoOrganization } from "react-icons/go";
import { FaRegSave } from "react-icons/fa";
import { useEditBarrio } from "../../../hooks/custom/useEditBarrio";
import "../../css/AddJurisdiccion.css";

export const EditBarrio = ({ idRegistro }) => {
    const {
        modalAbierto,
        cerrarModal,
        handleEditBarrio,
        nombreBarrio,
        setNombreBarrio
    } = useEditBarrio(idRegistro);

    return (
        <div id="ModalEditBarrio" className={modalAbierto === "EditBarrio" ? "modalMostrarActivo" : "modalMostrarInactivo"}>
            <div className="box-modal-add-jurisdiccion">
                <div className="box-close-modal">
                    <h3>
                        <GoOrganization /> Editar Barrio
                    </h3>
                    <p className="boton-close" onClick={cerrarModal}>
                        <IoIosCloseCircle />
                    </p>
                </div>

                <div className="box-form-modal-agregarJurisdiccion">
                    <form className="form-agregarJurisdiccion" onSubmit={handleEditBarrio}> 
                        <div className="box-inputs-add-jurisdiccion">
                            <label htmlFor="nombreBarrio">Nombre Barrio</label>
                            <input
                                type="text"
                                name="nombreBarrio"
                                id="nombreBarrio"
                                placeholder="Nombre del Barrio"
                                value={nombreBarrio}
                                onChange={(e) => setNombreBarrio(e.target.value)}
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