import '../css/ConfirmDelete.css';
import { GiConfirmed } from "react-icons/gi";
import { useUiStore } from "../../hooks/useUiStore";
import { IoIosCloseCircle } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useEventoStore } from "../../hooks/useEventoStore";
import { usePersonaStore } from "../../hooks/usePersonaStore";
import { useInstitucionStore } from "../../hooks/useInstitucionStore";
import { useAdherenteStore } from "../../hooks/useAdherenteStore";
import { useAccionStore } from '../../hooks/useAccionStore';
import { useBarrioStore } from '../../hooks/useBarrioStore';
import { useJurisdiccionStore } from '../../hooks/useJurisdiccionStore';
import { useLocalidadStore } from '../../hooks/useLocalidadStore';
import { useDirigenteStore } from '../../hooks/useDirigenteStore';
import { useCoordinadorStore } from '../../hooks/useCoordinadorStore';
import { useUsuarioStore } from '../../hooks/useUsuarioStore';

export const ConfirmDetele = ({ idRegistro }) => {

    const { activeTable } = useSelector(state => state.tables)

    const { modalAbierto, cerrarModal } = useUiStore();
    const { eliminarEvento } = useEventoStore();
    const { eliminarPersona } = usePersonaStore();
    const { eliminarInstitucion } = useInstitucionStore();
    const { eliminarAdherente } = useAdherenteStore();
    const { eliminarDirigente } = useDirigenteStore();
    const { eliminarCoordinador } = useCoordinadorStore();
    const { eliminarAccion } = useAccionStore();
    const { eliminarBarrio } = useBarrioStore();
    const { eliminarJurisdiccion } = useJurisdiccionStore();
    const { eliminarLocalidad } = useLocalidadStore();
    const { eliminarUsuario } = useUsuarioStore();
    // const activeTable = store.getState().tables.activeTable;
    
    const handleDelete = () => {
        switch (activeTable) {
            case 'eventos':
                eliminarEvento(idRegistro);
                cerrarModal();
                break;
            case 'acciones':
                eliminarAccion(idRegistro);
                cerrarModal();
                break;
            case 'personas':
                eliminarPersona(idRegistro);
                cerrarModal();
                break;
            case 'instituciones':
                eliminarInstitucion(idRegistro);
                cerrarModal();
                break;
            case 'coordinadores':
                eliminarCoordinador(idRegistro);
                cerrarModal();
                break;
            case 'dirigentes':
                eliminarDirigente(idRegistro);
                cerrarModal();
                break;
            case 'adherentes':
                eliminarAdherente(idRegistro);
                cerrarModal()
                break;
            case 'barrios':
                eliminarBarrio(idRegistro);
                cerrarModal();
                break;
            case 'jurisdicciones':
                eliminarJurisdiccion(idRegistro);
                cerrarModal();
                break;
            case 'localidades':
                eliminarLocalidad(idRegistro);
                cerrarModal();
                break;
            case 'usuarios':
                eliminarUsuario(idRegistro);
                cerrarModal();
            default:
                break;
        }
    }

    return (
        <div id='ModalConfirmDelete' className={modalAbierto === 'ConfirmDelete' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>
            <div className="box-modal-confirm-delete">

                <div className="box-close-modal">
                    <h3><GiConfirmed /> Confirmar</h3>
                    <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
                </div>

                <div className="box-body-confirm-delete">
                    <h3>¿Estás seguro de que deseas eliminar este registro?</h3>

                    <div className="box-options-delete-confirm">
                        <button className="botonCeleste-borde-blanco" onClick={handleDelete}>Aceptar</button>
                        <button className="botonCancelar" onClick={cerrarModal}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div >
    )
}