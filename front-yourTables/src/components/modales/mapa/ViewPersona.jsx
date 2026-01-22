
export const ViewPersona = ({ persona, closeModal }) => {
    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={closeModal}>
                    &times;
                </button>
                <h3>{persona.dni} - {persona.nombre} {persona.apellido}</h3>
                <p>
                    <strong>Dirección:</strong> {persona.direccion}
                </p>
                <p>
                    <strong>Barrio:</strong> {persona.barrio ? persona.barrio.nombreBarrio : 'Sin Barrio'}
                </p>
                <p>
                    <strong>Jurisdiccion:</strong> {persona.jurisdiccion ? persona.jurisdiccion : 'Sin Jurisdicción'}
                </p>
                <p>
                    <strong>Cargo:</strong> {persona.cargo ? persona.cargo : 'Sin Cargo'}
                </p>
                <p>
                    <strong>Teléfono:</strong> {persona.numeroTelefono ? persona.numeroTelefono : '-'}
                </p>
                <p>
                    <strong>Partido Politico:</strong> {persona.votaPor ? persona.votaPor : '-'}
                </p>
            </div>
        </div>
    )
}