import { handleApiError } from '../api/handleApiError.js';
import yourTablesApi from '../api/yourTablesApi.js';
import { useTablesStore } from '../hooks/useTableStore.js';

import { toast } from 'sonner';
import { useUiStore } from './useUiStore.js';


export const useEventoStore = () => {

  const { activeEventos } = useTablesStore();

  const crearEvento = async ({
    fechaEvento,
    accionSeleccionada,
    localidadSeleccionada,
    barrioSeleccionado,
    direccion,
    detalle,
    beneficiariosAsistentes,
    organizador,
    ubicacion,
    archivos


  }) => {
    const formData = new FormData();

    organizador.forEach((persona, index) => {
      formData.append(`organizadorDelEvento[${index}]`, persona._id);
    });

    formData.append('fecha', fechaEvento);
    formData.append('accion', accionSeleccionada);
    formData.append('localidad', localidadSeleccionada);
    formData.append('barrio', barrioSeleccionado ?? '');
    formData.append('direccion', direccion);
    formData.append('detalle', detalle);

    beneficiariosAsistentes.forEach((asistente, index) => {
      formData.append(`beneficiariosOAsistentes[${index}][tipo]`, asistente.tipo);
      formData.append(`beneficiariosOAsistentes[${index}][referencia]`, asistente.referencia);
    });

    archivos.forEach((archivo) => {
      console.log('Archivo enviado:', archivo);
      formData.append('archivos', archivo);
    });

    formData.append('ubicacion[type]', ubicacion.type);
    formData.append('ubicacion[coordenadas][0]', ubicacion.coordenadas[0]);
    formData.append('ubicacion[coordenadas][1]', ubicacion.coordenadas[1]);

    const promise = async () => {
      const { data } = await yourTablesApi.post('/evento', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      activeEventos();
      return data;
    }

    toast.promise(promise, {
      loading: 'Registrando evento...',
      success: () => 'Evento registrado exitosamente',
      error: (error) => {
        handleApiError(error, 'Hubo un problema al crear el evento.');
      }
    });

  };

  const editarEvento = async ({
    id,
    organizadorDelEvento,
    fecha,
    accion,
    localidad,
    barrio,
    direccion,
    detalle,
    beneficiariosOAsistentes,
    ubicacion,
    archivosNuevos,
    imagenesMantener = []
  }) => {
    const formData = new FormData();

    organizadorDelEvento.forEach((persona, index) => {
      formData.append(`organizadorDelEvento[${index}]`, persona._id);
    });

    formData.append('fecha', fecha);
    formData.append('accion', accion);
    formData.append('localidad', localidad);
    formData.append('barrio', barrio ?? '');
    formData.append('direccion', direccion);
    formData.append('detalle', detalle);

    beneficiariosOAsistentes.forEach((asistente, index) => {
      formData.append(`beneficiariosOAsistentes[${index}][tipo]`, asistente.tipo);
      formData.append(`beneficiariosOAsistentes[${index}][referencia]`, asistente.referencia);
    });

    if (!ubicacion || !Array.isArray(ubicacion.coordenadas) || ubicacion.coordenadas.length !== 2) {
      toast.error("Ubicación inválida. Por favor, seleccioná un punto en el mapa.");
      return;
    }

    formData.append('ubicacion[type]', ubicacion.type);
    formData.append('ubicacion[coordenadas][0]', ubicacion.coordenadas[0]);
    formData.append('ubicacion[coordenadas][1]', ubicacion.coordenadas[1]);
    console.log("Ubicación a enviar:", ubicacion);

    archivosNuevos.forEach((archivo) => {
      formData.append('archivos', archivo);
    });

    imagenesMantener.forEach((url) => {
      formData.append('imagenesMantener[]', url);
    });

    const promise = async () => {
      const { data } = await yourTablesApi.put(`/evento/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      activeEventos();
      return data.data;

    };

    toast.promise(promise, {
      loading: 'Actualizando evento...',
      success: () => 'Evento actualizado correctamente',
      error: (error) => {
        console.log(error);
        handleApiError(error, 'Error al editar el evento.');
      },
    });
  };

  const eliminarEvento = async (eventoId) => {
    try {
      const { data } = await yourTablesApi.delete(`/evento/${eventoId}`);
      activeEventos();
      toast.success('Se elimino el Registro de Evento', {
        duration: 2500
      });
      console.log('se elimino evento');
      return data.data;
    } catch (error) {
      console.log('soy un error del front', error);
    }
  }

  const obtenerArchivos = async (eventoId) => {
    try {
      const { data } = await yourTablesApi.get(`/evento/archivos/${eventoId}`);
      // console.log('Archivos del evento', data.data);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  }

  const obtenerEventoPorId = async (id) => {
    try {
      const { data } = await yourTablesApi.get(`/evento/${id}`);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  }

  const obtenerEventosPersona = async (personaId) => {
    try {
      const { data } = await yourTablesApi.get(`/persona/buscar-persona/${personaId}`);

      return data.data;
    } catch (error) {
      console.log(error);
    }
  }

  return {

    // * Propiedades

    // * Metodos
    crearEvento,
    eliminarEvento,
    obtenerArchivos,
    obtenerEventoPorId,
    obtenerEventosPersona,
    editarEvento

  }
}