import { IoIosCloseCircle } from "react-icons/io";
import { GoOrganization } from "react-icons/go";
import { FaRegSave } from "react-icons/fa";
import { useEditJurisdiccion } from "../../../hooks/custom/useEditJurisdiccion";

import '../../css/AddJurisdiccion.css';

export const EditJurisdiccion = ({ idRegistro }) => {
    const {
        modalAbierto,
        cerrarModal,
        nombreJurisdiccion,
        setNombreJurisdiccion,
        barriosData,
        barriosSelect,
        toggleBarrio,
        handleEditJurisdiccion
    } = useEditJurisdiccion(idRegistro);

    return (
        <div id='ModalEditJurisdiccion' className={modalAbierto === 'EditJurisdiccion' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>
            <div className='box-modal-add-jurisdiccion'>

                <div className="box-close-modal">
                    <h3><GoOrganization /> Editar Jurisdicción </h3>
                    <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
                </div>

                <div className='box-form-modal-agregarJurisdiccion'>
                    <form action="" className="form-agregarJurisdiccion" onSubmit={handleEditJurisdiccion}>

                        <div className="box-inputs-add-jurisdiccion">
                            <label htmlFor="nombreJurisdiccion">Nombre Jurisdicción</label>
                            <input
                                type="text"
                                name="nombreJurisdiccion"
                                id="nombreJurisdiccion"
                                placeholder="Nombre de la Jurisdicción"
                                value={nombreJurisdiccion}
                                onChange={(e) => setNombreJurisdiccion(e.target.value)}
                                required
                            />

                            <label htmlFor="barrios">Barrios de la Jurisdicción</label>
                            <div className="checkbox-container">
                                {barriosData.map((barrio) => (
                                    <label key={barrio._id} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            value={barrio._id}
                                            checked={barriosSelect.includes(barrio._id)}
                                            onChange={() => toggleBarrio(barrio._id)}
                                        />
                                        {barrio.nombreBarrio}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className='box-inputs-add-jurisdiccion' id="box-barrios-seleccionados">

                            <h3>Barrios seleccionados</h3>

                            <ul id="box-list-barrios-seleccionados-jurisdiccion">
                                {barriosSelect.length > 0 ? (
                                    barriosSelect.map((id) => {
                                        const barrio = barriosData.find((b) => b._id === id);
                                        return barrio ? <li key={id}>{barrio.nombreBarrio}</li> : null;
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
};
