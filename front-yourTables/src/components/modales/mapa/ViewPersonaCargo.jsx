

export const ViewPersonaCargo = ({ estructura, verBarrios, closeModal }) => {

    // const persona = estructura.persona || estructura;

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={closeModal}>
                    &times;
                </button>
                <h4>
                    {estructura.persona.nombre} {estructura.persona.apellido} ({estructura.persona.cargo})
                    <br />
                    DNI: {estructura.persona.dni}
                </h4>

                {estructura.jurisdiccionACargo && estructura.jurisdiccionACargo.length > 0 && (
                    <p>
                        <strong>Jurisdicción a cargo:{" "}</strong>
                        {estructura.jurisdiccionACargo.map(j => j.nombreJurisdiccion).join(", ")}
                    </p>
                )}

                {estructura.barriosACargo && estructura.barriosACargo.length > 0 && (
                    <p>
                        <strong>Barrios a cargo:{" "}</strong>
                        {estructura.barriosACargo.map(b => b.nombreBarrio).join(", ")}
                    </p>
                )}

                {estructura.superioresACargo && estructura.superioresACargo.length > 0 && (
                    <div>
                        <h4>Superiores a cargo:</h4>
                        <ul>
                            {estructura.superioresACargo.map(s => (
                                <li key={s._id}>
                                    {s.nombre} {s.apellido} - {s.cargo},
                                    <br />
                                    {s.Coordinador ? `${s.Coordinador.nombre} ${s.Coordinador.apellido} - ${s.Coordinador.cargo}` : ''}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {estructura.personasACargo && estructura.personasACargo.length > 0 && (
                    <div className="box-list-personas-a-cargo-modal-estructura">
                        <h4>Personas a cargo:</h4>
                        <ul>
                            {estructura.personasACargo.map((persona, index) => (
                                <li id="list-personas-a-cargo-modal" key={persona._id}>
                                    <strong>{persona.nombre} {persona.apellido}</strong> - {persona.cargo}
                                    <br />
                                    {persona.Adherentes && persona.Adherentes.length > 0 && (
                                        <div>
                                            {/* <strong>Adherentes:</strong> */}
                                            <ul>
                                                {persona.Adherentes.map(adherente => (
                                                    <li key={adherente._id}>
                                                        {adherente.nombre} {adherente.apellido} - {adherente.cargo}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {estructura.Adherentes && estructura.Adherentes.length > 0 && (
                    <div className="box-list-personas-a-cargo-modal-estructura">
                        <h4>Adherentes:</h4>
                        <ul>
                            {estructura.Adherentes.map(adherente => (
                                <li key={adherente._id}>
                                    <strong>{adherente.nombre} {adherente.apellido}</strong> - {adherente.cargo}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {estructura.jurisdiccionACargo && (
                    <div className='box-button-mostrar-barrios-juris'>
                        <button
                            onClick={() => verBarrios(estructura.jurisdiccionACargo[0]._id)}
                            className='botonCeleste-borde-blanco'
                        >
                            Ver Barrios
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}