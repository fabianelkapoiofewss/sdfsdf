import { useState } from 'react';
import { Header } from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';

import { AddAccion, AddPersona, AddAdherente, AddCoordinador, AddDirigente, AddInstitucion, AddEvento, AddJurisdiccion, AddBarrio, AddLocalidad } from '../components/modales/registros';
import { EditEvento, EditDirigente, EditAdherente, EditCoordinador, EditInstitucion, EditPersona, EditBarrio, EditJurisdiccion, EditLocalidad, EditAccion } from '../components/modales/ediciones';
import { ViewArchivos, BuscarEventosPersona, ViewAsistentes, ViewBarrios } from '../components/modales/visual';

import { ConfirmDetele } from '../components/modales/ConfirmDelete.jsx';

import logo from '../assets/compa.jpg';
import './css/Tables.css';

import { FaSearch } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";

import { useUiStore } from '../hooks/useUiStore.js';
import { useTablesStore } from '../hooks/useTableStore.js';

import { useFilteredTable } from '../helpers/filteredTables.js';
import { SearchOnePersona } from '../components/modales/visual/SearchOnePersona.jsx';


export const Tables = () => {

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedRegistroId, setSelectedRegistroId] = useState(null);
  const [selectedJurisdiccionId, setSelectedJurisdiccionId] = useState(null);
  const [eventoFiltro, setEventoFiltro] = useState(''); 

  const {
    activeTable,
    titles,
    currentPage,
    totalPages,
    totalRecords,
    tableContent,
    activePersonas,
    activeLocalidades,
    activeCoordinadores,
    activeBarrios,
    activeJurisdicciones,
    activeDirigentes,
    activeAdherentes,
    activeAcciones,
    activeEventos,
    activeInstituciones,
    getEventosByPersona,
    buscadorPersona
  } = useTablesStore();

  const {
    abrirModalAddPersona,
    abrirModalAddCoordinador,
    abrirModalAddEvento,
    abrirModalAddDirigente,
    abrirModalAddAdherente,
    abrirModalAddInstitucion,
    abrirModalAddAccion,
    abrirModalAddLocalidad,
    abrirModalViewAsistentes,
    abrirModalViewArchivos,
    abrirModalViewBarrios,
    abrirModalConfirmDelete,
    abrirModalBuscarPersona,
    abrirModalBuscarEventosPersona,
    abrirModalEditDirigente,
    abrirModalEditAdherente,
    abrirModalEditCoordinador,
    abrirModalEditPersona,
    abrirModalEditBarrio,
    abrirModalEditJurisdiccion,
    abrirModalEditInstitucion,
    abrirModalEditLocalidad,
    abrirModalEditAccion,
    abrirModalEditEvento,
    abrirModalAddJurisdiccion,
    abrirModalAddBarrio
  } = useUiStore();

  const excludedFields = ["ubicacion", "_id", "__v", "createdAt", "updatedAt", "created at", "updated at"];

  const { filteredTableContent, filteredTitlesWithActions } = useFilteredTable(titles, tableContent, excludedFields);


  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      switch (activeTable) {
        case 'personas':
          activePersonas(newPage);
          break;
        case 'barrios':
          activeBarrios(newPage);
          break;
        case 'localidades':
          activeLocalidades(newPage);
          break;
        case 'instituciones':
          activeInstituciones(newPage);
          break;
        case 'jurisdicciones':
          activeJurisdicciones(newPage)
          break;
        case 'eventos':
          activeEventos(newPage);
          break;
        case 'coordinadores':
          activeCoordinadores(newPage);
          break;
        case 'dirigentes':
          activeDirigentes(newPage);
          break;
        case 'adherentes':
          activeAdherentes(newPage);
          break;
        case 'acciones':
          activeAcciones(newPage);
          break;
        default:
          break;
      }
    }
  }

  const agregarRegistro = () => {
    switch (activeTable) {
      case 'personas':
        abrirModalAddPersona();
        break;
      case 'coordinadores':
        abrirModalAddCoordinador();
        break;
      case 'eventos':
        abrirModalAddEvento();
        break;
      case 'dirigentes':
        abrirModalAddDirigente();
        break;
      case 'instituciones':
        abrirModalAddInstitucion();
        break;
      case 'acciones':
        abrirModalAddAccion();
        break;
      case 'adherentes':
        abrirModalAddAdherente();
        break;
      case 'jurisdicciones':
        abrirModalAddJurisdiccion();
        break;
      case 'barrios':
        abrirModalAddBarrio();
        break;
      case 'localidades':
        abrirModalAddLocalidad();
      default:
        break;
    }
  };

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
    abrirModalViewArchivos();
  }

  const handleJurisdiccionClick = (jurisId) => {
    setSelectedJurisdiccionId(jurisId);
    abrirModalViewBarrios();
  }

  const handleEventAsistentesClick = (eventId) => {
    setSelectedEventId(eventId);
    abrirModalViewAsistentes();
  }

  const handleModalConfirmDelete = (registroId) => {
    setSelectedRegistroId(registroId);
    abrirModalConfirmDelete();
  }

  const handleModalEditRegistro = (registroId) => {
    switch (activeTable) {
      case 'dirigentes':
        setSelectedRegistroId(registroId);
        abrirModalEditDirigente();
        break;
      case 'adherentes':
        setSelectedRegistroId(registroId);
        abrirModalEditAdherente();
        break;
      case 'coordinadores':
        setSelectedRegistroId(registroId);
        abrirModalEditCoordinador();
        break;
      case 'personas':
        setSelectedRegistroId(registroId);
        abrirModalEditPersona();
        break;
      case 'Personas Encontradas':
        setSelectedRegistroId(registroId);
        abrirModalEditPersona();
        break;
      case 'instituciones':
        setSelectedRegistroId(registroId);
        abrirModalEditInstitucion();
        break;
      case 'barrios':
        setSelectedRegistroId(registroId);
        abrirModalEditBarrio();
        break;
      case 'jurisdicciones':
        setSelectedRegistroId(registroId);
        abrirModalEditJurisdiccion();
        break;
      case 'localidades':
        setSelectedRegistroId(registroId);
        abrirModalEditLocalidad();
        break;
      case 'acciones':
        setSelectedRegistroId(registroId);
        abrirModalEditAccion();
        break;
      case 'eventos':
        setSelectedRegistroId(registroId);
        abrirModalEditEvento();
        break;
      default:
        break;
    }
  }

  const handleBuscarEventosPorPersona = (idPersona) => {
    getEventosByPersona(idPersona);
  };

  const handleVerPersona = (idPersona) => {
    buscadorPersona(idPersona);
  }

  const handleEventoFiltroChange = (e) => {
    setEventoFiltro(e.target.value);
  };

  const filteredTableContentEventos = activeTable === 'eventos'
  ? filteredTableContent.filter(evento => 
      evento.accion?.nombreAccion?.toLowerCase().includes(eventoFiltro.toLowerCase())
    )
  : filteredTableContent;


  return (
    <>
      <div id='box-body-tables'>

        <Header />
        <div id='box-main-tables'>

          <div id='box-names-tables'>

            <div id='name-tables'>

              <div id='name-tables-buttons-first'>
                <button onClick={activePersonas}>Personas</button>
                <button onClick={activeInstituciones}>Instituciones</button>
              </div>

              <div id='name-tables-buttons-second'>
                <button onClick={activeCoordinadores}>Coordinador Jurisdicción</button>
                <button onClick={activeDirigentes}>Dirigentes</button>
                <button onClick={activeAdherentes}>Adherentes</button>
                {/* <button onClick={activeAsistentes}>Asistentes</button> */}
              </div>

              <div id='name-tables-buttons-third'>
                <button onClick={activeAcciones}>Acciones</button>
                <button onClick={activeEventos}>Eventos</button>
              </div>

              <div id='name-tables-buttons-fourth'>
                <button onClick={activeLocalidades}>Localidades</button>
                <button onClick={activeJurisdicciones}>Jurisdicciones</button>
                <button onClick={activeBarrios}>Barrios</button>
              </div>



            </div>

          </div>

          <div id='box-filters-tables'>

            <div id='box-acciones-registro'>
              <p onClick={agregarRegistro}><MdAddBox /> Agregar Registro</p>
            </div>

            <div id='box-text-activeTable'>
              {activeTable === 'usuarios' ? (
                <h3>Tabla activa: "NO HAY TABLA"</h3>
              ) : (
                <h3>Tabla activa: "{activeTable.toUpperCase()}"</h3>
              )}
            </div>

            <div id='box-search-registro'>
              {activeTable === 'personas' && (
                <p onClick={() => abrirModalBuscarPersona('BuscarPersona')}><FaSearch /> Buscar Persona</p>
              )}
              {['personas', 'eventos'].includes(activeTable) && (
                <button onClick={
                  () => abrirModalBuscarEventosPersona('BuscarEventosPersona')}
                  className='boton-naranja'>Buscar Eventos por Persona</button>
              )}
              {activeTable === 'eventos' && (
                <div id="box-filter-evento-tables">
                  <input 
                    type="text"
                    placeholder="Filtrar eventos por acción..."
                    value={eventoFiltro}
                    onChange={handleEventoFiltroChange}
                  />
                </div>
              )}

            </div>
          </div>

          <div id="box-table-details">
            {tableContent.length === 0 && activeTable === 'EventosPersona' ? (
              <h3>No existen eventos para esta persona...</h3>
            ) : tableContent.length === 0 && activeTable !== 'No hay tabla' ? (
              <h3>No existen datos en esta tabla...</h3>
            ) : activeTable === 'usuarios' || tableContent.length === 0 && activeTable === 'No hay tabla' ? (
              <div id='box-empty-table'>
                <img src={logo} alt="Logo" />
                <h2>Seleccione una tabla para ver</h2>
              </div>
            ) : (
              <table>

                <thead>
                  <tr>
                    {filteredTitlesWithActions.map((title, index) => (
                      <th key={index}>
                        {title === 'archivos'
                          ? 'imágenes'
                          : title === 'numero telefono'
                            ? 'teléfono'
                            : title === 'beneficiarios o asistentes'
                              ? 'beneficiarios/asistentes'
                              : title
                        }
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTableContentEventos.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {filteredTitlesWithActions.map((title, colIndex) => (
                        <td key={colIndex}>
                          {/* Manejo personalizado de claves existentes */}
                          {title === 'jurisdiccion a cargo' && Array.isArray(row[title]) ? (
                            <ul>
                              {row[title].map((item, itemIndex) => (
                                <li key={itemIndex}>{item.nombreJurisdiccion}</li>
                              ))}
                            </ul>
                          ) : title === 'personas a cargo' && Array.isArray(row[title]) ? (
                            <ul>
                              {row[title].map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  {item.dni} - {item.nombre} {item.apellido}, {item.cargo}
                                </li>
                              ))}
                            </ul>
                          ) : title === 'barrios' && Array.isArray(row[title]) ? (
                            <button className='botonCeleste-borde-blanco'
                              onClick={() => handleJurisdiccionClick(tableContent[rowIndex]._id)}
                            >
                              Ver Barrios
                            </button>
                            // <ul>
                            //   {row[title].map((item, itemIndex) => (
                            //     <li key={itemIndex}>{item.nombreBarrio}</li>
                            //   ))}
                            // </ul>
                            ) : title === 'barrios a cargo' && Array.isArray(row[title]) ? (
                            <ul>
                              {row[title].map((item, itemIndex) => (
                              <li key={itemIndex}>- {item.nombreBarrio} - {item.jurisdiccionDelBarrio}</li>
                              ))}
                            </ul>
                            ) : title === 'superiores a cargo' && Array.isArray(row[title]) ? (
                            <ul>
                              {row[title].map((item, itemIndex) => (
                              <li key={itemIndex}>
                                {item.nombre} {item.apellido} - {item.cargo},
                                <br />
                                {item.Coordinador ? `${item.Coordinador.nombre} ${item.Coordinador.apellido}, ${item.Coordinador.cargo}` : ''}
                              </li>
                              ))}
                            </ul>

                            ) : title === 'beneficiarios o asistentes' && Array.isArray(row[title]) ? (
                            activeTable === 'EventosPersona' ? (
                              row[title].length > 0 ? (
                              <ul>
                                {row[title].map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  {item.referencia?.dni}, {item.referencia?.nombre} {item.referencia?.apellido}
                                </li>
                                ))}
                              </ul>
                              ) : (
                              <button
                                className='botonCeleste-borde-blanco'
                                onClick={() => handleEventAsistentesClick(tableContent[rowIndex]._id)}
                              >
                                Ver Beneficiarios/Asistentes
                              </button>
                              )
                            ) : (
                              <button
                              className='botonCeleste-borde-blanco'
                              onClick={() => handleEventAsistentesClick(tableContent[rowIndex]._id)}
                              >
                              Ver Beneficiarios/Asistentes
                              </button>
                            )

                            ) : title === 'organizador del evento' && Array.isArray(row[title]) ? (
                            <ul>
                              {row[title].map((item, itemIndex) => (
                              <li key={itemIndex}>
                                {item.nombre} {item.apellido} - {item.cargo || 'Sin cargo'}
                              </li>
                              ))}
                            </ul>

                            ) : title === 'persona' && row[title] && typeof row[title] === 'object' ? (
                            `${row[title].nombre} ${row[title].apellido} - ${row[title].dni}`
                            )
                            /* Nuevas condiciones para beneficiario, involucrados y acción */
                            : title === 'beneficiario' && row[title] && typeof row[title] === 'object' ? (
                              `${row[title].nombre} ${row[title].apellido}`
                            ) : title === 'involucrados' && Array.isArray(row[title]) ? (
                              <ul>
                                {row[title].map((involucrado, index) => (
                                  <li key={index}>
                                    {involucrado.nombre} {involucrado.apellido}
                                  </li>
                                ))}
                              </ul>
                            ) : title === 'accion' && row[title] && typeof row[title] === 'object' ? (
                              row[title].nombreAccion
                            ) : title === 'localidad' && row[title] && typeof row[title] === 'object' ? (
                              row[title].nombreLocalidad
                            ) : title === 'barrio' && row[title] && typeof row[title] === 'object' ? (
                              row[title].nombreBarrio
                            ) : title === 'jurisdiccion' && row[title] && typeof row[title] === 'object' ? (
                              row[title].nombreJurisdiccion
                            ) : title === 'jurisdiccion' && row[title] ? (
                              row[title]
                            ) : title === 'archivos' && Array.isArray(row[title]) ? (
                              <button className='botonCeleste-borde-blanco'
                                onClick={() => handleEventClick(tableContent[rowIndex]._id)}>Ver Imágenes</button>
                            ) : title === 'numero telefono' ? (
                              <p>{row[title]}</p>
                            ) : title === 'fechaHasta' ? (
                              row[title] === null || row[title] === '' ? <p></p> : <p>{row[title]}</p>
                            ) : title === 'acciones' ? (
                              <div className='casilla-acciones'>
                                <div id='casilla-accion-edit' onClick={() => handleModalEditRegistro(tableContent[rowIndex]._id)}>
                                  <CiEdit size={23} />
                                </div>
                                <div id='casilla-accion-delete' onClick={() => handleModalConfirmDelete(tableContent[rowIndex]._id)}>
                                  <AiOutlineDelete size={22} />
                                </div>
                              </div>
                            ) : (
                              row[title]
                            )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>


              </table>
            )}

          </div>

          <div id='box-footer-tables'>
            {activeTable !== 'usuarios' && tableContent.length !== 0 && (
              <>
                <div id='box-result-tables'>
                  <h4>Datos totales: {totalRecords}</h4>
                </div>
                <div id='box-pagination-tables'>

                  <button
                    className='boton-borde-naranja fondo-rojo'
                    onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span id='current-page'>Página {currentPage} de {totalPages}</span>
                  <button
                    className='boton-borde-naranja fondo-verde'
                    onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>

                </div>
              </>
            )}
          </div>


        </div>
        <Footer />
      </div>

      <AddPersona />
      <AddCoordinador />
      <AddEvento />
      <AddDirigente />
      <AddAdherente />
      <AddInstitucion />
      <AddAccion />
      <AddJurisdiccion />
      <AddBarrio />
      <AddLocalidad />

      <EditCoordinador idRegistro={selectedRegistroId} />
      <EditDirigente idRegistro={selectedRegistroId} />
      <EditAdherente idRegistro={selectedRegistroId} />
      <EditPersona idRegistro={selectedRegistroId} />
      <EditInstitucion idRegistro={selectedRegistroId} />
      <EditBarrio idRegistro={selectedRegistroId} />
      <EditJurisdiccion idRegistro={selectedRegistroId} />
      <EditLocalidad idRegistro={selectedRegistroId} />
      <EditAccion idRegistro={selectedRegistroId} />
      <EditEvento idRegistro={selectedRegistroId} />

      <ViewArchivos eventoId={selectedEventId} />
      <ViewBarrios jurisId={selectedJurisdiccionId} />
      <ViewAsistentes eventoId={selectedEventId} />

      <ConfirmDetele idRegistro={selectedRegistroId} />
      <BuscarEventosPersona onSelectPersona={handleBuscarEventosPorPersona} />
      <SearchOnePersona onSelectPersona={handleVerPersona} />
    </>
  )
}