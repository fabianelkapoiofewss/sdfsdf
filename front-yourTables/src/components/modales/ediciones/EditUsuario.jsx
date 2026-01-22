import { IoIosCloseCircle } from "react-icons/io";
import { GoOrganization } from "react-icons/go";
import { FaRegSave } from "react-icons/fa";
import { useEditUsuario } from "../../../hooks/custom/useEditUsuario";
import "../../css/AddJurisdiccion.css";

export const EditUsuario = ({ idRegistro }) => {

    const {
        modalAbierto,
        cerrarModal,
        handleEditUsuario,
        nombreUsuario,
        setNombreUsuario,
        contrasena,
        setContrasena
    } = useEditUsuario(idRegistro);

    return (
        <div id="ModalEditUsuario" className={modalAbierto === "EditUsuario" ? "modalMostrarActivo" : "modalMostrarInactivo"}>
            <div className="box-modal-add-jurisdiccion">
                <div className="box-close-modal">
                    <h3>
                        <GoOrganization /> Editar Usuario
                    </h3>
                    <p className="boton-close" onClick={cerrarModal}>
                        <IoIosCloseCircle />
                    </p>
                </div>

                <div className="box-form-modal-agregarJurisdiccion">
                    <form className="form-agregarJurisdiccion" onSubmit={handleEditUsuario}>
                        <div className="box-inputs-add-jurisdiccion">

                            <label htmlFor="nombreUsuarioEdit">
                                Nombre Usuario
                            </label>
                            <input
                                type="text"
                                name="nombreUsuario"
                                id="nombreUsuarioEdit"
                                placeholder="Nombre del Usuario"
                                value={nombreUsuario}
                                onChange={(e) => setNombreUsuario(e.target.value)}
                                required
                            />

                            <label htmlFor="contrasenaEdit">
                                Contraseña
                            </label>
                            <input
                                type="text"
                                name="contrasena"
                                id="contrasenaEdit"
                                placeholder="Contraseña"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
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