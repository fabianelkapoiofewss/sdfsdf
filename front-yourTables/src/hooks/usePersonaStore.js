import { useDispatch } from 'react-redux';
import { personasEncontradas } from '../store/tables/datosSlice.js'
import yourTablesApi from '../api/yourTablesApi.js';
import { useTablesStore } from './useTableStore.js';

import { toast } from 'sonner';
import { handleApiError } from '../api/handleApiError.js';


export const usePersonaStore = () => {

  const { activePersonas } = useTablesStore();
  const dispatch = useDispatch();

  const crearPersona = async ({
    nombrePersona,
    apellidoPersona,
    dniPersona,
    nacimientoPersona,
    sexoPersona,
    paisNacimiento,
    provinciaNacimiento,
    ciudadNacimiento,
    localidadPersona,
    estadoCivilPersona,
    ocupacionPersona,
    direccionPersona,
    barrioPersona,
    numeroTelefonoPersona,
    partidoPoliticoPersona,
    ubicacion }) => {

    try {

      const { data } = await yourTablesApi.post('/persona', {
        nombre: nombrePersona,
        apellido: apellidoPersona,
        dni: dniPersona,
        fechaNacimiento: nacimientoPersona,
        sexo: sexoPersona,
        provinciaNacimiento: provinciaNacimiento,
        paisNacimiento: paisNacimiento,
        ciudadNacimiento: ciudadNacimiento,
        localidad: localidadPersona,
        estadoCivil: estadoCivilPersona,
        ocupacion: ocupacionPersona,
        direccion: direccionPersona,
        barrio: barrioPersona || null,
        numeroTelefono: numeroTelefonoPersona,
        votaPor: partidoPoliticoPersona,
        ubicacion
      });
      if (data) {
        activePersonas();
        toast.success('Se registró una Persona exitosamente', {
          duration: 2500
        })
      }
      return data.data;
    } catch (error) {
      handleApiError(error, "Error al registrar Persona");
    }
  }

  const eliminarPersona = async (idPersona) => {
    try {
      const { data } = await yourTablesApi.delete(`/persona/${idPersona}`);
      activePersonas();
      toast.success('Se elimino el Registro de Persona', {
        duration: 2500
      });
      console.log('se elimino persona', data);
      return data.data
    } catch (error) {
      console.log('soy un error del front', error);
    }
  }
  const buscarPersonas = async ({ campo, valor }) => {

    try {
      const { data } = await yourTablesApi.post('/persona/buscar', { campo, valor });
      dispatch(personasEncontradas({ personas: data.data }));
      return data.data


    } catch (error) {
      handleApiError(error, "Error al buscar Personas");
    }
  }
  const obtenerPersonaPorId = async (idPersona) => {
    try {
      const { data } = await yourTablesApi.get(`/persona/${idPersona}`);
      return data.data
    } catch (error) {
      console.log('soy un error del front', error)
    }
  }

  const editarPersona = async (persona) => {
    try {
      const { data } = await yourTablesApi.put(`/persona/${persona.id}`, persona);
      if (data) {
        activePersonas();
        toast.success('Se editó una Persona exitosamente', {
          duration: 2500
        })
      }
      return data.data;
    } catch (error) {
      handleApiError(error, "Error al editar Persona");
    }
  }

  return {

    // * Propiedades

    // * Metodos
    crearPersona,
    eliminarPersona,
    buscarPersonas,
    obtenerPersonaPorId,
    editarPersona

  }
}