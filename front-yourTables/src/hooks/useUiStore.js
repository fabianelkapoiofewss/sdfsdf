import { useSelector, useDispatch } from 'react-redux';

import { openModalAddPersona, 
  openModalAddCoordinador, 
  openModalAddEvento, 
  openModalAddDirigente, 
  openModalAddAdherente, 
  openModalAddInstitucion, 
  openModalAddAccion, 
  openModalViewAsistentes, 
  openModalViewArchivos, 
  openModalViewBarrios, 
  openModalConfirmDelete, 
  openModalBuscarEventosPersona, 
  openModalEditDirigente, 
  openModalEditAdherente, 
  openModalEditCoordinador, 
  openModalEditPersona, 
  openModalEditInstitucion, 
  openModalAddJurisdiccion ,
  closeModal,
  openModalAddBarrio,
  openModalEditBarrio,
  openModalEditJurisdiccion,
  openModalAddLocalidad,
  openModalEditLocalidad,
  openModalEditAccion,
  openModalBuscarPersona,
  openModalAddUsuario,
  openModalEditUsuario,
  openModalEditEvento
} from '../store/ui/uiSlice';


export const useUiStore = () => {

  const dispatch = useDispatch();

  const { isModalOpen, modalAbierto } = useSelector(state => state.ui)

  const abrirModalAddPersona = () => {
    dispatch( openModalAddPersona() );
  }
  const abrirModalAddCoordinador = () => {
    dispatch( openModalAddCoordinador() );
  }
  const abrirModalAddEvento = () => {
    dispatch( openModalAddEvento() );
  }
  const abrirModalAddDirigente = () => {
    dispatch( openModalAddDirigente() );
  }
  const abrirModalEditDirigente = () => {
    dispatch( openModalEditDirigente() );
  }
  const abrirModalAddAdherente = () => {
    dispatch( openModalAddAdherente() );
  }
  const abrirModalEditAdherente = () => {
    dispatch( openModalEditAdherente());
  };
  const abrirModalAddJurisdiccion = () => {
    dispatch( openModalAddJurisdiccion() );
  }
  const abrirModalAddBarrio = () => {
    dispatch( openModalAddBarrio() );
  }
  const abrirModalAddInstitucion = () => {
    dispatch( openModalAddInstitucion() );
  }
  const abrirModalAddAccion = () => {
    dispatch( openModalAddAccion() );
  }
  const abrirModalAddLocalidad = () => {
    dispatch( openModalAddLocalidad() );
  }
  const abrirModalViewAsistentes = () => {
    dispatch( openModalViewAsistentes() );
  }
  const abrirModalViewArchivos = () => {
    dispatch( openModalViewArchivos() );
  }
  const abrirModalViewBarrios = () => {
    dispatch( openModalViewBarrios ());
  }
  const abrirModalConfirmDelete = () => {
    dispatch( openModalConfirmDelete() );
  }
  const abrirModalAddUsuario = () => {
    dispatch( openModalAddUsuario() );
  }
  const abrirModalBuscarPersona = () => {
    dispatch( openModalBuscarPersona() )
  }
  const abrirModalBuscarEventosPersona = () => {
    dispatch( openModalBuscarEventosPersona() );
  }
  const abrirModalEditCoordinador = () => {
    dispatch( openModalEditCoordinador() );
  }
  const abrirModalEditPersona = () => {
    dispatch( openModalEditPersona() );
  }
  const abrirModalEditInstitucion = () => {
    dispatch( openModalEditInstitucion() );
  }
  const abrirModalEditBarrio = () => {
    dispatch( openModalEditBarrio() );
  }
  const abrirModalEditJurisdiccion = () => {
    dispatch( openModalEditJurisdiccion() );
  }
  const abrirModalEditLocalidad = () => {
    dispatch( openModalEditLocalidad() );
  }
  const abrirModalEditAccion = () => {
    dispatch( openModalEditAccion() );
  }
  const abrirModalEditUsuario = () => {
    dispatch( openModalEditUsuario() );
  }
  const abrirModalEditEvento = () => {
    dispatch( openModalEditEvento() );
  }
  const cerrarModal = () => {
    dispatch( closeModal() );
  }

  return {

    // * Propiedades
    isModalOpen,
    modalAbierto,

    // * Metodos
    abrirModalAddPersona,
    abrirModalAddUsuario,
    abrirModalAddCoordinador,
    abrirModalAddEvento,
    abrirModalAddDirigente,
    abrirModalEditDirigente,
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
    abrirModalEditAdherente,
    abrirModalEditCoordinador,
    abrirModalEditPersona,
    abrirModalEditInstitucion,
    abrirModalEditBarrio,
    abrirModalEditJurisdiccion,
    abrirModalEditLocalidad,
    abrirModalEditAccion,
    abrirModalAddJurisdiccion,
    abrirModalAddBarrio,
    abrirModalEditUsuario,
    abrirModalEditEvento,
    cerrarModal

  }
}