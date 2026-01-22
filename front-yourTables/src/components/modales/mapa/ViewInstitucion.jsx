

export const ViewInstitucion = ({ institucion, closeModal }) => {
    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={closeModal}>
                    &times;
                </button>
                <h3>{institucion.nombreInstitucion}</h3>
                <p>
                    <strong>Encargado/Director:</strong> {institucion.encargadoODirector}
                </p>
                <p>
                    <strong>Direccion:</strong> {institucion.direccion}
                </p>
                <p>
                    <strong>Barrio:</strong> {institucion.barrio ? institucion.barrio.nombreBarrio : 'Sin Barrio'}
                </p>
                <p>
                    <strong>Jurisdiccion:</strong> {institucion.jurisdiccion ? institucion.jurisdiccion : 'Sin Jurisdicción'}
                </p>
            </div>
        </div>
    )
}