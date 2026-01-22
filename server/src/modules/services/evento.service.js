import { eventoModel } from "../models/evento.js";
import { accionModel } from "../models/accion.js";
import { deleteById, getForId } from "../../utils/getRegisters.js";
import { AppError, mongooseErrorHandler } from "../../utils/handleError.js";
import { subirArchivosCloudinary } from '../../helpers/cloudinary.js';
import { jurisdiccionModel } from "../models/jurisdiccion.js";
import { obtenerJurisdiccionPorBarrio } from "../../helpers/obtenerJurisdiccion.js";
import { v2 as cloudinary } from 'cloudinary';

export const eventoService = {
    async crearEvento(data, files) {
        try {
            const urls = await subirArchivosCloudinary(files);
            const barrioConvertido = data.barrio === 'null' || data.barrio === '' ? null : data.barrio;
            const eventoData = {
                ...data,
                barrio: barrioConvertido,
                archivos: urls
            };

            return await eventoModel.create(eventoData);
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async editarEvento(eventoId, data, files) {
        try {
            const evento = await getForId(eventoModel, eventoId);
    
            const imagenesMantener = data.imagenesMantener || [];
            const imagenesEliminar = evento.archivos.filter(url => !imagenesMantener.includes(url));
    
            for (const url of imagenesEliminar) {
                const parts = url.split('/');
                const filename = parts.pop();
                const publicId = filename.split('.')[0];
                await cloudinary.uploader.destroy(`yourtables/${publicId}`);
            }
    
            const nuevasImagenes = files?.length > 0 ? await subirArchivosCloudinary(files) : [];
            const archivosActualizados = [...imagenesMantener, ...nuevasImagenes];

            const barrioConvertido = data.barrio === 'null' || data.barrio === '' ? null : data.barrio;
    
            const camposActualizables = {
                accion: data.accion,
                fecha: data.fecha,
                localidad: data.localidad,
                barrio: barrioConvertido,
                direccion: data.direccion,
                detalle: data.detalle,
                archivos: archivosActualizados,
            };
    
            if (data.ubicacion?.type === 'Point' && Array.isArray(data.ubicacion.coordenadas)) {
                camposActualizables.ubicacion = {
                    type: 'Point',
                    coordenadas: data.ubicacion.coordenadas,
                };
            }
    
            if (Array.isArray(data.organizadorDelEvento)) {
                camposActualizables.organizadorDelEvento = data.organizadorDelEvento;
            }
    
            if (Array.isArray(data.beneficiariosOAsistentes)) {
                const beneficiariosValidos = data.beneficiariosOAsistentes.filter(b => 
                    ['Persona', 'Institucion'].includes(b.tipo) && b.referencia
                );
                camposActualizables.beneficiariosOAsistentes = beneficiariosValidos;
            }
    
            const eventoActualizado = await eventoModel.findByIdAndUpdate(
                eventoId,
                camposActualizables,
                { new: true }
            );
    
            return eventoActualizado;
    
        } catch (error) {
            console.error('Error al editar el evento:', error);
            mongooseErrorHandler(error);
        }
    },

    async obtenerArchivos(eventoId) {
        try {
            const evento = await getForId(eventoModel, eventoId);
            return evento.archivos;
        } catch (error) {
            console.log('Error al obtener los archivos:', error);
            mongooseErrorHandler(error);
        }
    },

    async obtenerEventos() {
        try {
            const eventos = await eventoModel
                .find()
                .sort({ _id: -1 })
                .populate({
                    path: 'accion',
                    select: 'nombreAccion colorMarcador -_id'
                })
                .populate({
                    path: 'localidad',
                    select: 'nombreLocalidad -_id'
                })
                .populate({
                    path: 'barrio',
                    select: 'nombreBarrio',
                    model: 'Barrio'
                })
                .populate({
                    path: 'beneficiariosOAsistentes.referencia',
                    select: 'nombre apellido dni nombreInstitucion'
                })
                .populate({
                    path: 'organizadorDelEvento',
                    select: ['nombre', 'apellido', 'cargo', '-_id', 'dni']
                })
                .lean()

            const eventosConJurisdiccion = await obtenerJurisdiccionPorBarrio(eventos);
            return eventosConJurisdiccion;
        } catch (error) {
            mongooseErrorHandler(error)
        }
    },

    async getAllEventosByPage(page = 1) {
        try {
            const PAGE_SIZE = 10;
            const skip = (page - 1) * PAGE_SIZE;

            const eventos = await eventoModel
                .find()
                .skip(skip)
                .limit(PAGE_SIZE)
                .sort({ _id: -1 })
                .populate({
                    path: 'accion',
                    select: 'nombreAccion colorMarcador -_id'
                })
                .populate({
                    path: 'localidad',
                    select: 'nombreLocalidad -_id'
                })
                .populate({
                    path: 'barrio',
                    select: 'nombreBarrio',
                    model: 'Barrio'
                })
                .populate({
                    path: 'beneficiariosOAsistentes.referencia',
                    select: 'nombre apellido dni nombreInstitucion'
                })
                .populate({
                    path: 'organizadorDelEvento',
                    select: ['nombre', 'apellido', 'cargo', '-_id', 'dni']
                })
                .lean()

            const eventosConJurisdiccion = await obtenerJurisdiccionPorBarrio(eventos);
            const totalEventos = await eventoModel.countDocuments();
            return {
                data: eventosConJurisdiccion,
                currentPage: page,
                totalPages: Math.ceil(totalEventos / PAGE_SIZE),
                totalRecords: totalEventos
            };
        } catch (error) {
            mongooseErrorHandler(error)
        }
    },

    async obtenerEventoPorId(eventoId) {
        try {
            const evento = await eventoModel
                .findById(eventoId)
                .populate([
                    { path: 'beneficiariosOAsistentes.referencia', select: 'nombre apellido dni nombreInstitucion' },
                    { path: 'organizadorDelEvento', select: 'nombre apellido cargo' }
                ]);
            if (!evento) {
                throw new AppError('Evento no encontrado', 400);
            }
            return evento;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async buscarEventosPorAccion(accionId) {
        try {
            const accion = await getForId(accionModel, accionId);

            const eventos = await eventoModel
                .find({ accion: accionId })
                .populate({
                    path: 'accion',
                    select: 'nombreAccion -_id',
                })
                .populate({
                    path: 'beneficiario',
                    select: 'nombre apellido -_id',
                })
                .populate({
                    path: 'involucrados',
                    select: 'nombre apellido -_id',
                });

            return eventos;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async eliminarEvento(eventoId) {
        return await deleteById(eventoModel, eventoId);
    }
}