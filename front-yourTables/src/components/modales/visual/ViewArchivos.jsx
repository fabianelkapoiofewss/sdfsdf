import { useEventoStore } from '../../../hooks/useEventoStore';
import { useUiStore } from '../../../hooks/useUiStore';

import { useEffect, useRef, useState } from 'react';

import { IoIosCloseCircle } from "react-icons/io";
import { IoCloudUploadSharp, IoImagesOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { TbFileUpload } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCloudRain } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import PulseLoader from "react-spinners/PulseLoader";

import '../../css/ViewArchivos.css';
import { FaDeleteLeft } from 'react-icons/fa6';

export const ViewArchivos = ({ eventoId }) => {

    const { modalAbierto, cerrarModal } = useUiStore();
    const { obtenerArchivos } = useEventoStore();
    const [archivos, setArchivos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArchivos = async () => {
            if (eventoId) {
                setLoading(true);
                const data = await obtenerArchivos(eventoId);
                setArchivos(data);
                setLoading(false);
            }
        };
        fetchArchivos();
    }, [eventoId]);

    const handleNext = () => {
        if (currentIndex < archivos.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(archivos.length - 1);
        }
    };

    const handleCerrarModal = () => {
        cerrarModal();
        setCurrentIndex(0);
    }

    const fileInputRef = useRef(null);
    const handleFileUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            console.log("Archivos seleccionados:", files);
        }
    };

    return (
        <div id='ModalViewArchivos' className={modalAbierto === 'ViewArchivos' ? 'modalMostrarActivo' : 'modalMostrarInactivo'}>
            <div className="box-modal-view-archivos">

                <div className="box-close-modal">
                    <h3><IoImagesOutline /> Imágenes </h3>
                    <p className='boton-close' onClick={handleCerrarModal}><IoIosCloseCircle /></p>
                </div>

                {/* {archivos.length > 0 ? (
                    <div className='box-options-archivos'>
                        <p id='option-item-archivo' onClick={handleFileUploadClick}>
                            <IoCloudUploadSharp size={20} />&nbsp;Subir Nuevo Archivo
                        </p>
                        <p id='option-item-archivo'><FaDeleteLeft size={20} />&nbsp;Eliminar Archivo</p>
                    </div>
                ) : null}

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                /> */}

                <div id='box-archivos'>
                    {loading ? (
                        <div className='box-loading-archivos-event'>
                            <p>Cargando archivos...</p>
                            <PulseLoader color="white" size={8} />
                        </div>
                    ) : (
                        <div id='caja-principal-archivos'>
                            {archivos.length > 0 ? (
                                <>
                                    <div className='boton-carrusel-prev' onClick={handlePrev}>
                                        <IoIosArrowBack />
                                    </div>
                                    <div className="box-archivo">
                                        <img src={archivos[currentIndex]} alt={`Archivo ${currentIndex + 1}`} className="imagen-archivo" />
                                    </div>
                                    <div className='boton-carrusel-next' onClick={handleNext}>
                                        <IoIosArrowForward />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3>No hay archivos para este evento <FaCloudRain /></h3>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className='box-numero-archivos'>
                    {!loading && <p>{currentIndex + 1} de {archivos.length}</p>}
                </div>
            </div>
        </div >
    )
}