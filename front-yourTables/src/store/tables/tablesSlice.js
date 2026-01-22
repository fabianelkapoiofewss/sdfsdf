import { createSlice } from '@reduxjs/toolkit'

export const tablesSlice = createSlice({
  name: 'tables',
  initialState: {
    activeTable: 'No hay tabla',
    titles: [],
    tableContent: [],
    currentPage: 1,
    totalPages: undefined,
    totalRecords: undefined,
    errorMessage: undefined
  },
  reducers: {
    nothingTable: ( state ) => {
      state.status = 'No hay tabla'
      state.titles = {}
      state.tableContent = {}
      state.errorMessage = undefined
    },
    localidades: ( state, { payload } ) => {
      state.activeTable = 'localidades'
      state.titles = payload.titles
      state.tableContent = payload.tableContent 
      state.currentPage = payload.currentPage
      state.totalPages = payload.totalPages
      state.totalRecords = payload.totalRecords
      state.errorMessage = payload.errorMessage
    },
    usuarios: ( state, { payload } ) => {
      state.activeTable = 'usuarios'
      state.titles = payload.titles
      state.tableContent = payload.tableContent 
      state.currentPage = payload.currentPage
      state.totalPages = payload.totalPages
      state.totalRecords = payload.totalRecords
      state.errorMessage = payload.errorMessage
    },
    personas: ( state, { payload } ) => {
      state.activeTable = 'personas'
      state.titles = payload.titles
      state.tableContent = payload.tableContent 
      state.currentPage = payload.currentPage
      state.totalPages = payload.totalPages
      state.totalRecords = payload.totalRecords
      state.errorMessage = payload.errorMessage
    },
    coordinadores: ( state, { payload } ) => {
      state.activeTable = 'coordinadores'
      state.titles = payload.titles
      state.tableContent = payload.tableContent
      state.currentPage = payload.currentPage
      state.totalPages = payload.totalPages
      state.totalRecords = payload.totalRecords
      state.errorMessage = payload.errorMessage
    },
    barrios: ( state, { payload } ) => {
      state.activeTable = 'barrios'
      state.titles = payload.titles
      state.tableContent = payload.tableContent 
      state.currentPage = payload.currentPage
      state.totalPages = payload.totalPages
      state.totalRecords = payload.totalRecords
      state.errorMessage = payload.errorMessage
    },
    jurisdicciones: ( state, { payload } ) => {
      state.activeTable = 'jurisdicciones'
      state.titles = payload.titles
      state.tableContent = payload.tableContent 
      state.currentPage = payload.currentPage
      state.totalPages = payload.totalPages
      state.totalRecords = payload.totalRecords
      state.errorMessage = payload.errorMessage
    },
    dirigentes: ( state, { payload } ) => {
      state.activeTable = 'dirigentes'
      state.titles = payload.titles
      state.tableContent = payload.tableContent
      state.currentPage = payload.currentPage
      state.totalPages = payload.totalPages
      state.totalRecords = payload.totalRecords 
      state.errorMessage = payload.errorMessage
    },
    adherentes: ( state, { payload } ) => {
      state.activeTable = 'adherentes'
      state.titles = payload.titles
      state.tableContent = payload.tableContent
      state.currentPage = payload.currentPage
      state.totalPages = payload.totalPages
      state.totalRecords = payload.totalRecords 
      state.errorMessage = payload.errorMessage
    },
    asistentes: ( state, { payload } ) => {
      state.activeTable = 'asistentes'
      state.titles = payload.titles
      state.tableContent = payload.tableContent 
      state.errorMessage = payload.errorMessage
    },
    acciones: ( state, { payload } ) => {
      state.activeTable = 'acciones'
      state.titles = payload.titles
      state.tableContent = payload.tableContent
      state.currentPage = payload.currentPage
      state.totalPages = payload.totalPages
      state.totalRecords = payload.totalRecords 
      state.errorMessage = payload.errorMessage
    },
    eventos: ( state, { payload } ) => {
      state.activeTable = 'eventos'
      state.titles = payload.titles
      state.tableContent = payload.tableContent
      state.currentPage = payload.currentPage
      state.totalPages = payload.totalPages
      state.totalRecords = payload.totalRecords 
      state.errorMessage = payload.errorMessage
    },
    instituciones: ( state, { payload } ) => {
      state.activeTable = 'instituciones'
      state.titles = payload.titles
      state.tableContent = payload.tableContent
      state.currentPage = payload.currentPage
      state.totalPages = payload.totalPages
      state.totalRecords = payload.totalRecords 
      state.errorMessage = payload.errorMessage
    },
    EventosPersona: ( state, { payload } ) => {
      state.activeTable = 'EventosPersona'
      state.titles = payload.titles
      state.tableContent = payload.tableContent
      state.currentPage = payload.currentPage
      state.totalPages = payload.totalPages
      state.totalRecords = payload.totalRecords
      state.errorMessage = payload.errorMessage
    },
    PersonasEncontradas: ( state, { payload } ) => {
      state.activeTable = 'Personas Encontradas'
      state.titles = payload.titles
      state.tableContent = payload.tableContent
      state.currentPage = payload.currentPage
      state.totalPages = payload.totalPages
      state.totalRecords = payload.totalRecords
      state.errorMessage = payload.errorMessage
    }
  },
})

// Action creators are generated for each case reducer function
export const { nothingTable, localidades, personas, usuarios, coordinadores, barrios, jurisdicciones, dirigentes, adherentes, asistentes, acciones, eventos, instituciones, EventosPersona, PersonasEncontradas } = tablesSlice.actions