import '../../css/ViewBarrios.css';
import { useJurisdiccionStore } from '../../../hooks/useJurisdiccionStore';
import { useUiStore } from "../../../hooks/useUiStore";
import { IoIosCloseCircle } from "react-icons/io";
import { FaUsers } from "react-icons/fa6";
import PulseLoader from 'react-spinners/PulseLoader';
import { useEffect, useState } from "react"

export const ViewBarrios = ({ jurisId }) => {

    const { modalAbierto, cerrarModal } = useUiStore();
    const { obtenerJurisdiccionPorId } = useJurisdiccionStore();
    const [jurisdiccion, setJurisdiccion] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (jurisId) {
                setLoading(true);
                const data = await obtenerJurisdiccionPorId(jurisId)
                setJurisdiccion(data);
                setLoading(false);
            }
        }
        if (jurisId) {
            fetchData();
        }
    }, [jurisId])

    return (
        <div id='ModalViewBarrios' className={modalAbierto === 'ViewBarrios' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>
            <div className="box-modal-view-barrios">

                <div className="box-close-modal">
                    <h3><FaUsers /> Barrios Asociados</h3>
                    <p className='boton-close' onClick={cerrarModal}><IoIosCloseCircle /></p>
                </div>

                <div className="box-body-view-barrios">
                    {loading ? (
                        <div className='box-loading-barrios-juris'>
                            <p>Cargando lista...</p>
                            <PulseLoader color="white" size={8} />
                        </div>
                    ) : (
                        jurisdiccion?.barrios?.length > 0 ? (
                            <ul>
                                {jurisdiccion.barrios.map((barrio) => (
                                    <li key={barrio._id}>
                                        {barrio.nombreBarrio}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay barrios registrados para esta Jurisdicción.</p>
                        )
                    )}
                </div>
            </div>
        </div >
    )
}