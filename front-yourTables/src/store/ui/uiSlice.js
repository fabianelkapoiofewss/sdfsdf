import { createSlice } from '@reduxjs/toolkit'

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isModalOpen: false,
    modalAbierto: 'ninguno'
  },
  reducers: {
    openModalAddPersona: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'AddPersona'
    },
    openModalAddCoordinador: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'AddCoordinador'
    },
    openModalAddEvento: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'AddEvento'
    },
    openModalAddDirigente: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'AddDirigente'
    },
    openModalAddAdherente: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'AddAdherente'
    },
    openModalAddJurisdiccion: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'AddJurisdiccion'
    },
    openModalAddBarrio: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'AddBarrio'
    },
    openModalEditDirigente: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'EditDirigente'
    },
    openModalEditAdherente: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'EditAdherente'
    },
    openModalAddInstitucion: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'AddInstitucion'
    },
    openModalAddAccion: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'AddAccion'
    },
    openModalAddLocalidad: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'AddLocalidad'
    },
    openModalViewAsistentes: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'ViewAsistentes'
    },
    openModalViewArchivos: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'ViewArchivos'
    },
    openModalViewBarrios: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'ViewBarrios'
    },
    openModalConfirmDelete: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'ConfirmDelete'
    },
    openModalAddUsuario: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'AddUsuario'
    },
    openModalBuscarPersona: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'BuscarPersona'
    },
    openModalBuscarEventosPersona: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'BuscarEventosPersona'
    },
    openModalEditCoordinador: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'EditCoordinador'
    },
    openModalEditPersona: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'EditPersona'
    },
    openModalEditInstitucion: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'EditInstitucion'
    },
    openModalEditBarrio: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'EditBarrio'
    },
    openModalEditJurisdiccion: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'EditJurisdiccion'
    },
    openModalEditLocalidad: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'EditLocalidad'
    },
    openModalEditAccion: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'EditAccion'
    },
    openModalEditUsuario: (state) => {
      state.isModalOpen = true,
      state.modalAbierto = 'EditUsuario'
    },
    openModalEditEvento: (state) => {
      state.isModalOpen = true
      state.modalAbierto = 'EditEvento'
    },
    closeModal: (state) => {
      state.isModalOpen = false
      state.modalAbierto = 'ninguno'
    }
  },
})

// Action creators are generated for each case reducer function
export const { 
  openModalAddPersona, 
  openModalAddCoordinador, 
  openModalAddEvento , 
  openModalAddDirigente,
  openModalEditDirigente,
  openModalAddAdherente,
  openModalAddJurisdiccion,
  openModalAddBarrio,
  openModalAddInstitucion,
  openModalAddAccion,
  openModalAddLocalidad,
  openModalViewAsistentes, 
  openModalViewArchivos,
  openModalViewBarrios,
  openModalConfirmDelete,
  openModalAddUsuario,
  openModalBuscarPersona,
  openModalBuscarEventosPersona,
  openModalEditAdherente,
  openModalEditCoordinador,
  openModalEditPersona,
  openModalEditInstitucion,
  openModalEditBarrio,
  openModalEditJurisdiccion,
  openModalEditLocalidad,
  openModalEditAccion,
  openModalEditUsuario,
  openModalEditEvento,
  closeModal 
} = uiSlice.actions