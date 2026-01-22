import { createSlice } from '@reduxjs/toolkit'

export const datosSlice = createSlice({
  name: 'personas',
  initialState: {
    estado: 'no se realizaron busquedas',
    personas: [],
    jurisdicciones: [],
    instituciones: []
  },
  reducers: {
    personasEncontradas: ( state, { payload } ) => {
      state.estado = 'se realizo busqueda de personas'
      state.personas = payload.personas
      state.jurisdicciones = []
      state.instituciones = []
    },
    jurisdiccionesEncontradas: ( state, { payload } ) => {
      state.estado = 'se realizo busqueda de jurisdicciones'
      state.personas = []
      state.jurisdicciones = payload.jurisdicciones
      state.instituciones = []
    },
    institucionesEncontradas: ( state, { payload } ) => {
      state.estado = 'se realizo busqueda de instituciones'
      state.personas = []
      state.jurisdicciones = []
      state.instituciones = payload.instituciones
    },
    limpiarDatos: ( state ) => {
      state.estado = 'limpiamos datos'
      state.personas = []
      state.jurisdicciones = []
      state.instituciones = []
    },
  },
})

// Action creators are generated for each case reducer function
export const { personasEncontradas, jurisdiccionesEncontradas, institucionesEncontradas, limpiarDatos } = datosSlice.actions