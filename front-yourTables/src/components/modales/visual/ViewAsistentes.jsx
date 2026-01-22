import '../../css/ViewAsistentes.css';
import { useUiStore } from "../../../hooks/useUiStore";
import { IoIosCloseCircle } from "react-icons/io";
import { useEffect, useState } from "react"
import { useEventoStore } from '../../../hooks/useEventoStore';
import { FaUsers } from "react-icons/fa6";
import PulseLoader from 'react-spinners/PulseLoader';

export const ViewAsistentes = ({ eventoId }) => {

    const { modalAbierto, cerrarModal } = useUiStore();
    const { obtenerEventoPorId } = useEventoStore();
    const [evento, setEvento] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAsistentes = async () => {
            if (eventoId) {
                setLoading(true);
                const data = await obtenerEventoPorId(eventoId)
                setEvento(data);
                setLoading(false);
            }
        }
        fetchAsistentes()
    }, [eventoId])

    return (
        <div id='ModalViewAsistentes' className={modalAbierto === 'ViewAsistentes' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>
            <div className="box-modal-view-asistentes">

                <div className="box-close-modal">
                    <h3><FaUsers /> Beneficiarios/Asistentes</h3>
                    <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
                </div>

                <div className="box-body-view-asistentes">
                    {loading ? (
                        <div className='box-loading-asistentes-event'>
                            <p>Cargando lista...</p>
                            <PulseLoader color="white" size={8} />
                        </div>
                    ) : (
                        evento?.beneficiariosOAsistentes?.length > 0 ? (
                            <ul>
                                {evento.beneficiariosOAsistentes.map((asistente) => (
                                    <li key={asistente._id}>
                                        {asistente.referencia ? 
                                            asistente.referencia.nombreInstitucion 
                                                ? `${asistente.referencia.nombreInstitucion}`
                                                : `${asistente.referencia.dni} - ${asistente.referencia.nombre} ${asistente.referencia.apellido} `
                                        : 'Esta persona no se encuentra o ha sido eliminada.'}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay beneficiarios/asistentes registrados para este evento.</p>
                        )
                    )}
                </div>
            </div>
        </div >
    )
}