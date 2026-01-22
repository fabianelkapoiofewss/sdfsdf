

export const ViewEvento = ({ evento, parteAsistentes, toggleParteAsistentes, closeModal, verImagen }) => {
    const mostrarBarrio = evento.barrio === null || evento.barrio === '' || evento.barrio === 'null' ? 'Sin Barrio' : evento.barrio.nombreBarrio
    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={closeModal}>
                    &times;
                </button>
                <h3>{evento.accion.nombreAccion}</h3>
                <p>
                    <strong>Organizado por:</strong>{' '}
                    {evento.organizadorDelEvento.map((org, index) => (
                        <span key={index}>
                            {org.nombre} {org.apellido} ({org.cargo ? org.cargo : 'Sin Cargo'})
                            {org.dni ? ` - DNI: ${org.dni}` : ''}
                            {index !== evento.organizadorDelEvento.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </p>

                <p>
                    <strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString()}
                </p>
                <p>
                    <strong>Barrio:</strong> {mostrarBarrio}
                </p>
                <p>
                    <strong>Dirección:</strong> {evento.direccion}
                </p>
                <p>
                    <strong>Jurisdiccion:</strong> {evento.jurisdiccion ? evento.jurisdiccion : 'Sin Jurisdicción'}
                </p>
                <p>
                    <strong>Detalle:</strong> {evento.detalle}
                </p>
                <div className='box-button-mostrar-asist-imagenes'>
                    <button onClick={toggleParteAsistentes} className="botonCeleste-borde-blanco">
                        {parteAsistentes ? "Ocultar Benef/Asist" : "Ver Benef/Asist"}
                    </button>
                    <button onClick={() => verImagen(evento._id)} className='botonCeleste-borde-blanco'>
                        Ver Imágenes
                    </button>
                </div>
                {parteAsistentes && (
                    <div className='box-parte-mostrar-asistentes'>
                        <p>
                            <strong>Beneficiarios/Asistentes:</strong>
                        </p>
                        {evento?.beneficiariosOAsistentes?.length > 0 ? (
                            <ul>
                                {evento.beneficiariosOAsistentes.map((asistente) => (
                                    <li key={asistente._id}>
                                        {asistente.referencia ? (
                                            asistente.tipo === "Persona" ?
                                                `${asistente.referencia.dni} - ${asistente.referencia.nombre} ${asistente.referencia.apellido}` :
                                                `${asistente.referencia.nombreInstitucion}`
                                        ) : (
                                            'Esta persona o institución no se encuentra o ha sido eliminada'
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay beneficiarios/asistentes registrados para este evento.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}