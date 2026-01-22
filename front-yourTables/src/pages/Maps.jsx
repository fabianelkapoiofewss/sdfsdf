import './css/Maps.css';
import { useState, useEffect } from 'react';

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

import { Header } from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';

import { useTablesStore } from '../hooks/useTableStore.js';

import { TbLogout } from "react-icons/tb";
import { TbLogout2 } from "react-icons/tb";
import { FaSearch } from 'react-icons/fa';
import { useFiltroMapaPersona } from '../hooks/filters-maps/useFiltroMapaPersona.js';
import { useModalPersonaMapa } from '../hooks/modals/useModalPersonaMapa.js';
import { useModalInstitucionMapa } from '../hooks/modals/useModalInstitucionMapa.js';
import { useUiStore } from '../hooks/useUiStore.js';
import { ViewArchivos, ViewBarrios } from '../components/modales/visual';
import { useModalEstructuraMapa } from '../hooks/modals/useModalEstructuraMapa.js';
import { iconMarkerJerarquia, iconMarkerPartido, jerarquiaColores, votaPorColores } from '../hooks/constants/filtersColors.js';
import { ViewPersonaCargo, ViewEvento, ViewInstitucion, ViewPersona } from '../components/modales/mapa';

const apiKeyMaps = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const libraries = ['places'];

const mapContainerStyle = {
  width: '99%',
  height: '98%',
  border: '2px solid #B0C4DE',
};

export const Maps = () => {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKeyMaps,
    libraries,
    language: 'es',
  });

  const { handleOptionClick, handleBuscar,
    getPlaceholder, inputBusqueda,
    setInputBusqueda, resultadoBusqueda,
    searchPerformed, selectedOption,
    filtroPartPolitico, selectedPartPolitico,
    setSelectedPartPolitico, personas, setPersonas } = useFiltroMapaPersona();

  const { getUbiEventos, getInstituciones, getAcciones, getAllPersonas, getPersonasConCargo } = useTablesStore();
  const { isOpenModalPersona, selectedPersona, openModalPersona, closeModalPersona } = useModalPersonaMapa();
  const { isOpenModalInstitucion, selectedInstitucion, openModalInstitucion, closeModalInstitucion } = useModalInstitucionMapa();
  const { isOpenModalEstructura, selectedEstructura, openModalEstructura, closeModalEstructura } = useModalEstructuraMapa()
  const { abrirModalViewArchivos, abrirModalViewBarrios } = useUiStore();

  const [selectEstructuraId, setSelectEstructuraId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [activeFiltros, setActiveFiltros] = useState(false);
  const [filtroDatos, setFiltroDatos] = useState('Eventos');
  const [isReferenciaVisible, setReferenciaVisible] = useState(true);

  const [eventos, setEventos] = useState([])
  const [personasConCargo, setPersonasConCargo] = useState([])
  const [instituciones, setInstituciones] = useState([])
  const [accionesData, setAccionesData] = useState([])

  const [selectedEvento, setSelectedEvento] = useState(null);
  const [selectedBarrios, setSelectedBarrios] = useState([]);
  const [selectedAnios, setSelectedAnios] = useState([]);
  const [selectedTipos, setSelectedTipos] = useState([]);
  const [selectedJuris, setSelectedJuris] = useState([]);

  const [selectedCoordinadores, setSelectedCoordinadores] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parteAsistentes, setParteAsistentes] = useState(false);

  const [inputBusquedaInstitucion, setInputBusquedaInstitucion] = useState('');

  const [searchDNI, setSearchDNI] = useState('');

  const handleFiltroChange = (e) => {
    setFiltroDatos(e.target.value);
  };

  const openModal = (evento) => {
    setSelectedEvento(evento);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvento(null);
    setIsModalOpen(false);
    setParteAsistentes(false)
  };

  const fetchData = async () => {
    try {
      if (filtroDatos === 'Eventos') {
        const data = await getUbiEventos();
        setEventos(data);
        const accionesData = await getAcciones();
        setAccionesData(accionesData)
        const institucionesData = await getInstituciones();
        setInstituciones(institucionesData);
      } else if (filtroDatos === 'Personas' && !searchPerformed) {
        const data = await getAllPersonas();
        setPersonas(data);
      } else if (filtroDatos === 'Instituciones') {
        const data = await getInstituciones();
        setInstituciones(data);
      } else if (filtroDatos === 'Estructura') {
        const data = await getPersonasConCargo();
        setPersonasConCargo(data);
      }

    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filtroDatos, searchPerformed]);

  const personasParaMostrar = searchPerformed && resultadoBusqueda.length > 0
    ? resultadoBusqueda
    : (selectedPartPolitico.length > 0 ? filtroPartPolitico : personas);

  const validateCoordinates = (lat, lng) => {
    return typeof lat === 'number' && typeof lng === 'number';
  };

  const estructuraFiltrada = personasConCargo.flatMap((estructura) => {
    const cumpleJuris =
      selectedJuris.length > 0
        ? selectedJuris.includes(estructura.jurisdiccion)
        : true;

    if (selectedCoordinadores.length > 0) {
      const esCoordinador = estructura.persona.cargo === "Coordinador de Jurisdicción";
      const esSeleccionado = selectedCoordinadores.includes(estructura.persona.dni);

      if (esCoordinador && esSeleccionado) {
        const subordinados = personasConCargo.filter((persona) => {
          const esDirigente = persona.persona.cargo === "Dirigente" &&
            persona.superioresACargo?.some(sup => sup.dni === estructura.persona.dni);

          const esAdherente = persona.persona.cargo === "Adherente" &&
            persona.superioresACargo?.some(sup => sup.Coordinador?.dni === estructura.persona.dni);

          return esDirigente || esAdherente;
        });

        return cumpleJuris ? [estructura, ...subordinados] : [];
      }

      return [];
    }

    if (searchDNI) {
      const esCoordinador = estructura.persona.cargo === "Coordinador de Jurisdicción";
      const esElCoordinadorBuscado = esCoordinador && estructura.persona.dni.includes(searchDNI);

      if (esElCoordinadorBuscado) {
        const subordinados = personasConCargo.filter((persona) => {
          const esDirigente = persona.persona.cargo === "Dirigente" &&
            persona.superioresACargo?.some(sup => sup.dni === estructura.persona.dni);

          const esAdherente = persona.persona.cargo === "Adherente" &&
            persona.superioresACargo?.some(sup => sup.Coordinador?.dni === estructura.persona.dni);

          return esDirigente || esAdherente;
        });

        return [estructura, ...subordinados];
      }

      const personaCoincide = estructura.persona?.dni?.includes(searchDNI);

      const personaACargoCoincide = estructura.personasACargo?.some(dir => {
        const dirigenteCoincide = dir.dni.includes(searchDNI);
        const adherenteCoincide = dir.Adherentes?.some(adh => adh.dni.includes(searchDNI));
        return dirigenteCoincide || adherenteCoincide;
      });

      return cumpleJuris && (personaCoincide || personaACargoCoincide) ? [estructura] : [];
    }

    return cumpleJuris ? [estructura] : [];
  });


  const eventosFiltrados = eventos.filter((evento) => {
    const cumpleBarrio =
      selectedBarrios.length > 0
        ? selectedBarrios.includes(evento.barrio ? evento.barrio.nombreBarrio : 'Sin Barrio')
        : true;

    const cumpleAnio =
      selectedAnios.length > 0
        ? selectedAnios.includes(new Date(evento.fecha).getFullYear().toString())
        : true;

    const cumpleTipo =
      selectedTipos.length > 0
        ? selectedTipos.includes(evento.accion.nombreAccion)
        : true;

    const cumpleJuris =
      selectedJuris.length > 0
        ? selectedJuris.includes(evento.jurisdiccion)
        : true;
    const cumpleOrganizador =
      inputBusqueda.trim().length > 0
        ? evento.organizadorDelEvento.some((organizador) =>
          `${organizador.nombre} ${organizador.apellido} ${String(organizador.dni)}`
            .toLowerCase()
            .includes(inputBusqueda.toLowerCase())
        ) ||
        evento.beneficiariosOAsistentes?.some((asistente) =>
          `${asistente.referencia?.nombre} ${asistente.referencia?.apellido} ${String(asistente.referencia?.dni)}`
            .toLowerCase()
            .includes(inputBusqueda.toLowerCase())
        )
        : true;

    return cumpleBarrio && cumpleAnio && cumpleTipo && cumpleJuris && cumpleOrganizador;
  });


  const institucionesFiltradas = instituciones.filter((institucion) => {
    const cumpleJuris =
      selectedJuris.length > 0
        ? selectedJuris.includes(institucion.jurisdiccion)
        : true;

    const cumpleBarrio =
      selectedBarrios.length > 0
        ? selectedBarrios.includes(institucion.barrio ? institucion.barrio.nombreBarrio : 'Sin Barrio')
        : true;

    const cumpleNombreInstitucion =
      inputBusquedaInstitucion.trim().length > 0
        ? institucion.nombreInstitucion.toLowerCase().includes(inputBusquedaInstitucion.toLowerCase())
        : true;

    return cumpleJuris && cumpleBarrio && cumpleNombreInstitucion;
  })

  // función para manejar los checkboxes
  const handleCheckboxChange = (setSelected, value) => {
    setSelected((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value]
    );
  };

  const toggleParteAsistentes = () => {
    setParteAsistentes(!parteAsistentes);
  };

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
    abrirModalViewArchivos();
  }

  const handleEstructuraClick = (personaId) => {
    setSelectEstructuraId(personaId);
    abrirModalViewBarrios();
  }

  const handleBuscarInstitucion = (e) => {
    e.preventDefault();
    setInputBusquedaInstitucion(inputBusquedaInstitucion.trim())
  };

  const handleBuscarOrganizador = (e) => {
    e.preventDefault();
    setInputBusqueda(inputBusqueda.trim());
  };

  const handleSearchChange = (e) => {
    setSearchDNI(e.target.value);
  };


  if (loadError) return <p>Error al cargar el mapa</p>;
  if (!isLoaded) return <p>Cargando mapa...</p>;

  return (
    <>
      <div id='box-body-main-maps'>
        <Header />

        <div className='box-padre-mapa'>

          <div
            className='box-container-referencia-filtro-activo'
            id={isReferenciaVisible ? 'box-referencia-filtro-colors-eventos-activo' : 'box-referencia-filtro-colors-eventos-inactivo'}
          >
            <div id='caja-icon-cierre-box-referencia' onClick={() => setReferenciaVisible(!isReferenciaVisible)}>
              <TbLogout2 size={22} id='icono-cierre' />
            </div>
            {isReferenciaVisible && (
              <>
                <div className='box-filtro-activo-mapa'>
                  {filtroDatos === 'Eventos' ? (
                    <>
                      <h3>Filtro Activo: Eventos</h3>
                      <ul>
                        <li><strong>Jurisdicción: </strong> {selectedJuris.join(', ')}</li>
                        <hr />
                        <li><strong>Barrio: </strong> {selectedBarrios.join(', ')}</li>
                        <hr />
                        <li><strong>Accion: </strong> {selectedTipos.join(', ')}</li>
                        <hr />
                        <li><strong>Año: </strong> {selectedAnios.join(', ')}</li>
                        <hr />
                      </ul>
                    </>
                  ) : filtroDatos === 'Instituciones' ? (
                    <>
                      <h3>Filtro Activo: Instituciones</h3>
                      <ul>
                        <li><strong>Jurisdicción: </strong> {selectedJuris.join(', ')}</li>
                        <hr />
                        <li><strong>Barrio: </strong> {selectedBarrios.join(', ')}</li>
                        <hr />
                      </ul>
                    </>
                  ) : filtroDatos === 'Personas' ? (
                    <>
                      <h3>Filtro Activo: Personas</h3>
                      <ul>
                        {Object.entries(votaPorColores).map(([partido, color]) => (
                          <li key={partido} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{
                              width: "15px",
                              height: "15px",
                              backgroundColor: color,
                              borderRadius: "50%",
                              display: "inline-block"
                            }}></span>
                            <strong>{partido}</strong>
                          </li>

                        ))}
                        <hr />
                      </ul>
                      <ul>
                        <strong>Vota por: </strong>{selectedPartPolitico.join(', ')}
                        <hr />
                      </ul>
                    </>
                  ) : (
                    <>
                      <h3>Filtro Activo: Estructura</h3>
                      <ul>
                        {Object.entries(jerarquiaColores).map(([nombre, color]) => (
                          <li key={nombre} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{
                              width: "15px",
                              height: "15px",
                              backgroundColor: color,
                              borderRadius: "50%",
                              display: "inline-block"
                            }}></span>
                            <strong>{nombre}</strong>
                          </li>
                        ))}
                        <hr />
                      </ul>
                      <ul>
                        <li><strong>Jurisdicción: </strong> {selectedJuris.join(', ')}</li>
                        <hr />
                      </ul>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          {!isReferenciaVisible && (
            <div id="icono-mostrar-referencia" onClick={() => setReferenciaVisible(true)}>
              <TbLogout size={22} id='icono-open-referencia' />
            </div>
          )}

          <div id='box-main-maps'>

            <div id='box-opciones-map-up'>

              {activeFiltros && (
                <div className="filtro-container">

                  <div className='box-filtro-select-options'>

                    <select
                      id="filtro-select"
                      value={filtroDatos}
                      onChange={handleFiltroChange}
                    >
                      <option value="" disabled>
                        Seleccione un Filtro
                      </option>
                      <option value="Eventos">Eventos</option>
                      <option value="Personas">Personas</option>
                      <option value="Instituciones">Instituciones</option>
                      <option value="Estructura">Estructura Política</option>
                    </select>

                  </div>

                  {filtroDatos === 'Eventos' ? (
                    <div id="filters-container-eventos">

                      <div className='box-form-search-organizador'>
                        <form action="" id='form-search-organizador' onSubmit={handleBuscarOrganizador}>
                          <input
                            type="text"
                            name="organizadorInput"
                            placeholder="Buscar Persona por DNI..."
                            value={inputBusqueda}
                            onChange={(e) => setInputBusqueda(e.target.value)}
                          />
                          {/* <button type='submit' className='botonCeleste-borde-blanco'><FaSearch /></button> */}
                        </form>
                      </div>

                      <label htmlFor="jurisdicción">Jurisdicción:</label>
                      <div className="dropdown">
                        <button className="dropdown-button">Seleccione</button>
                        <div className="dropdown-content">
                          {Array.from(new Set(eventos.map((evento) => evento.jurisdiccion))).map((jurisdiccion) => (
                            <label key={jurisdiccion}>
                              <input
                                type="checkbox"
                                value={jurisdiccion}
                                checked={selectedJuris.includes(jurisdiccion)}
                                onChange={() => handleCheckboxChange(setSelectedJuris, jurisdiccion)}
                              />
                              {jurisdiccion ? jurisdiccion : 'Sin Jurisdicción'}
                            </label>
                          ))}
                        </div>
                      </div>

                      <label htmlFor="barrio">Barrio:</label>
                      <div className="dropdown">
                        <button className="dropdown-button">Seleccione</button>
                        <div className="dropdown-content">
                          {Array.from(new Set(eventos.map((evento) => evento.barrio ? evento.barrio.nombreBarrio : 'Sin Barrio'))).map((barrio) => (
                            <label key={barrio}>
                              <input
                                type="checkbox"
                                value={barrio}
                                checked={selectedBarrios.includes(barrio)}
                                onChange={() => handleCheckboxChange(setSelectedBarrios, barrio)}
                              />
                              {barrio}
                            </label>
                          ))}
                        </div>
                      </div>

                      <label htmlFor="anio">Año:</label>
                      <div className="dropdown">
                        <button className="dropdown-button">Seleccione</button>
                        <div className="dropdown-content">
                          {Array.from(new Set(eventos.map((evento) => new Date(evento.fecha).getFullYear()))).map((anio) => (
                            <label key={anio}>
                              <input
                                type="checkbox"
                                value={anio}
                                checked={selectedAnios.includes(anio.toString())}
                                onChange={() => handleCheckboxChange(setSelectedAnios, anio.toString())}
                              />
                              {anio}
                            </label>
                          ))}
                        </div>
                      </div>

                      <label htmlFor="tipo">Acción:</label>
                      <div className="dropdown">
                        <button className="dropdown-button">Seleccione</button>
                        <div className="dropdown-content">
                          {Array.from(new Set(eventos.map((evento) => evento.accion.nombreAccion))).map((tipo) => (
                            <label key={tipo}>
                              <input
                                type="checkbox"
                                value={tipo}
                                checked={selectedTipos.includes(tipo)}
                                onChange={() => handleCheckboxChange(setSelectedTipos, tipo)}
                              />
                              {tipo}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : filtroDatos === 'Personas' ? (
                    <div id="filters-container-personas">

                      <div className='box-select-option-search-persona'>
                        <label htmlFor="">Buscar por:</label>
                        <select name="" id="" value={selectedOption} onChange={(e) => handleOptionClick(e.target.value)}>
                          <option value="" disabled>
                            Seleccione una opción
                          </option>
                          <option value="dni">DNI</option>
                          <option value="apellido">Apellido</option>
                          <option value="nombre">Nombre</option>
                        </select>

                      </div>

                      <div className='box-form-search-persona'>
                        <form action="" id='form-search-persona' onSubmit={handleBuscar}>
                          <input
                            type="text" placeholder={getPlaceholder()}
                            value={inputBusqueda}
                            onChange={(e) => setInputBusqueda(e.target.value)}
                          />
                          <button type='submit' className='botonCeleste-borde-blanco'><FaSearch /></button>
                        </form>
                      </div>

                      <div className='box-select-filtro-partido-politico'>
                        <label htmlFor="">Vota por:</label>
                        <div className="dropdown">
                          <button className="dropdown-button">Seleccione</button>
                          <div className="dropdown-content">
                            {["PJ", "UCR", "LLA", "PRO", "Otros"].map((partido) => (
                              <label key={partido}>
                                <input
                                  type="checkbox"
                                  checked={selectedPartPolitico.includes(partido)}
                                  onChange={() => handleCheckboxChange(setSelectedPartPolitico, partido)}
                                />
                                {partido}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : filtroDatos === 'Instituciones' ? (
                    <div id='filters-container-instituciones'>

                      <label htmlFor="jurisdicción">Jurisdicción:</label>
                      <div className="dropdown">
                        <button className="dropdown-button">Seleccione</button>
                        <div className="dropdown-content">
                          {Array.from(new Set((instituciones ?? []).map((institucion) => institucion.jurisdiccion))).map((jurisdiccion) => (
                            <label key={jurisdiccion}>
                              <input
                                type="checkbox"
                                value={jurisdiccion}
                                checked={selectedJuris.includes(jurisdiccion)}
                                onChange={() => handleCheckboxChange(setSelectedJuris, jurisdiccion)}
                              />
                              {jurisdiccion ? jurisdiccion : 'Sin Jurisdicción'}
                            </label>
                          ))}
                        </div>
                      </div>

                      <label htmlFor="barrio">Barrio:</label>
                      <div className="dropdown">
                        <button className="dropdown-button">Seleccione</button>
                        <div className="dropdown-content">
                          {Array.from(new Set(instituciones.map((institucion) => institucion.barrio ? institucion.barrio.nombreBarrio : 'Sin Barrio'))).map((barrio) => (
                            <label key={barrio}>
                              <input
                                type="checkbox"
                                value={barrio}
                                checked={selectedBarrios.includes(barrio)}
                                onChange={() => handleCheckboxChange(setSelectedBarrios, barrio)}
                              />
                              {barrio}
                            </label>
                          ))}
                        </div>
                      </div>

                      <label htmlFor="">Buscar:</label>
                      <div className='box-form-search-institucion'>
                        <form action="" id='form-search-institucion' onSubmit={handleBuscarInstitucion}>
                          <input
                            type="text" placeholder="Ingrese nombre..."
                            value={inputBusquedaInstitucion}
                            onChange={(e) => setInputBusquedaInstitucion(e.target.value)}
                          />
                          {/* <button type='submit' className='botonCeleste-borde-blanco'><FaSearch /></button> */}
                        </form>
                      </div>
                    </div>
                  ) : filtroDatos === 'Estructura' ? (
                    <div id='filters-container-estructura'>

                      <label htmlFor="">Jurisdicción:</label>
                      <div className="dropdown">
                        <button className="dropdown-button">Seleccione</button>
                        <div className="dropdown-content">
                          {Array.from(new Set(personasConCargo.map((persona) => persona.jurisdiccion))).map((jurisdiccion) => (
                            <label key={jurisdiccion}>
                              <input
                                type="checkbox"
                                value={jurisdiccion}
                                checked={selectedJuris.includes(jurisdiccion)}
                                onChange={() => handleCheckboxChange(setSelectedJuris, jurisdiccion)}
                              />
                              {jurisdiccion}
                            </label>
                          ))}
                        </div>
                      </div>


                      <label>Coordinadores:</label>
                      <div className="dropdown">
                        <button className="dropdown-button">Seleccione</button>
                        <div className="dropdown-content">
                          {(() => {
                            const coordinadoresFiltrados = personasConCargo.filter(
                              (persona) =>
                                persona.persona.cargo === "Coordinador de Jurisdicción" &&
                                (selectedJuris.length === 0 || selectedJuris.includes(persona.jurisdiccion))
                            );

                            if (coordinadoresFiltrados.length === 0) {
                              return <div className="sin-coordinadores">No hay coordinadores en esta jurisdicción</div>;
                            }

                            return coordinadoresFiltrados.map((coordinador) => (
                              <label key={coordinador.persona.dni}>
                                <input
                                  type="checkbox"
                                  value={coordinador.persona.dni}
                                  checked={selectedCoordinadores.includes(coordinador.persona.dni)}
                                  onChange={() => handleCheckboxChange(setSelectedCoordinadores, coordinador.persona.dni)}
                                />
                                {coordinador.persona.apellido} {coordinador.persona.nombre}
                              </label>
                            ));
                          })()}
                        </div>
                      </div>

                      <div className='box-form-search-coordinador'>
                        <form action="" id='form-search-coordinador'>
                          <input
                            type="text"
                            name="coordinadorInput"
                            placeholder="Buscar Coordinador por DNI..."
                            value={searchDNI}
                            onChange={handleSearchChange}
                          />
                          {/* <button type='submit' className='botonCeleste-borde-blanco'><FaSearch /></button> */}
                        </form>
                      </div>

                    </div>
                  ) : (
                    null
                  )}
                </div>
              )}

              <div id='box-titulo-maps' className={activeFiltros ? 'box-titulo-maps-filtros' : ''}>
                <button
                  className='botonCeleste-borde-blanco'
                  onClick={() => setActiveFiltros(!activeFiltros)}
                >
                  Filtros
                </button>
              </div>

            </div>

            <div id='box-map'>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={{ lat: -26.1849, lng: -58.1731 }}
              >
                {filtroDatos === 'Eventos' && (eventos.length > 0 || institucionesFiltradas.length > 0) ? (
                  <>
                    {eventosFiltrados.map((evento) =>
                      validateCoordinates(evento.ubicacion.coordenadas[1], evento.ubicacion.coordenadas[0]) && (
                        <Marker
                          key={evento._id}
                          position={{
                            lat: evento.ubicacion.coordenadas[1],
                            lng: evento.ubicacion.coordenadas[0],
                          }}
                          title={`Organizado por: ${evento.organizadorDelEvento.map(org => `${org.nombre} ${org.apellido}`).join(', ')}\n${evento.detalle}`}
                          onClick={() => openModal(evento)}
                          icon={{
                            url: `/icons/acciones/${evento.accion.colorMarcador}.png`,
                            scaledSize: new window.google.maps.Size(52, 52),
                          }}
                        />
                      ))}
                      {institucionesFiltradas.map((institucion) =>
                        validateCoordinates(institucion.ubicacion?.coordenadas?.[1], institucion.ubicacion?.coordenadas?.[0]) && (
                          <Marker
                            key={institucion._id}
                            position={{
                              lat: institucion.ubicacion.coordenadas[1],
                              lng: institucion.ubicacion.coordenadas[0],
                            }}
                            title={institucion.nombreInstitucion}
                            onClick={() => openModalInstitucion(institucion)}
                          />
                        )
                      )}
                  </>
                ) : filtroDatos === 'Personas' && personasParaMostrar ? (
                  personasParaMostrar.map((persona) =>
                    validateCoordinates(
                      persona.ubicacion && persona.ubicacion.coordenadas && persona.ubicacion.coordenadas.length === 2
                        ? persona.ubicacion.coordenadas[1]
                        : null,
                      persona.ubicacion && persona.ubicacion.coordenadas && persona.ubicacion.coordenadas.length === 2
                        ? persona.ubicacion.coordenadas[0]
                        : null
                    ) && (
                      <Marker
                        key={persona._id}
                        position={{
                          lat: persona.ubicacion.coordenadas[1],
                          lng: persona.ubicacion.coordenadas[0],
                        }}
                        icon={iconMarkerPartido(persona.votaPor)}
                        title={`${persona.nombre} ${persona.apellido} - ${persona.dni}`}
                        onClick={() => openModalPersona(persona)}
                      />
                    ))
                ) : filtroDatos === 'Instituciones' && institucionesFiltradas.length > 0 ? (
                  institucionesFiltradas.map((institucion) =>
                    validateCoordinates(institucion.ubicacion.coordenadas[1], institucion.ubicacion.coordenadas[0]) && (
                      <Marker
                        key={institucion._id}
                        position={{
                          lat: institucion.ubicacion.coordenadas[1],
                          lng: institucion.ubicacion.coordenadas[0],
                        }}
                        title={institucion.nombreInstitucion}
                        onClick={() => openModalInstitucion(institucion)}
                      />
                    ))
                ) : filtroDatos === 'Estructura' && personasConCargo.length > 0 ? (
                  estructuraFiltrada.map((jerarquia) => (
                    validateCoordinates(
                      jerarquia.persona?.ubicacion?.coordenadas?.[1] ?? null,
                      jerarquia.persona?.ubicacion?.coordenadas?.[0] ?? null
                    ) && (
                      <Marker
                        key={jerarquia._id}
                        position={{
                          lat: jerarquia.persona.ubicacion.coordenadas[1],
                          lng: jerarquia.persona.ubicacion.coordenadas[0],
                        }}
                        icon={iconMarkerJerarquia(jerarquia.persona.cargo)}
                        title={`${jerarquia.persona.nombre} ${jerarquia.persona.apellido} - ${jerarquia.persona.dni}`}
                        onClick={() => openModalEstructura(jerarquia)}
                      />
                    )
                  ))
                ) : (
                  <></>
                )}

                {isModalOpen && selectedEvento ? (
                  <ViewEvento
                    evento={selectedEvento} verImagen={handleEventClick}
                    parteAsistentes={parteAsistentes} toggleParteAsistentes={toggleParteAsistentes}
                    closeModal={closeModal}
                  />
                ) : isOpenModalPersona && selectedPersona ? (
                  <ViewPersona
                    persona={selectedPersona}
                    closeModal={closeModalPersona}
                  />
                ) : isOpenModalInstitucion && selectedInstitucion ? (
                  <ViewInstitucion
                    institucion={selectedInstitucion}
                    closeModal={closeModalInstitucion}
                  />
                ) : isOpenModalEstructura && selectedEstructura ? (
                  <ViewPersonaCargo
                    estructura={selectedEstructura}
                    verBarrios={handleEstructuraClick}
                    closeModal={closeModalEstructura}
                  />
                ) : null}
              </GoogleMap>

            </div>
            <div id='box-opciones-map-down'></div>
          </div>
        </div>


        <Footer />

      </div >
      <ViewArchivos eventoId={selectedEventId} />
      <ViewBarrios jurisId={selectEstructuraId} />
    </>
  )
}