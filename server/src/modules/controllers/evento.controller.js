import { AppError } from "../../utils/handleError.js";
import { errorHandler, responseHandler } from "../../utils/responseHandler.js";
import { eventoService } from "../services/evento.service.js";


export const eventoController = {
    registrarEvento: async (req, res, next) => {
        try {
            console.log('Body recibido:', req.body);
            const files = req.files;
            const body = req.body;
            const evento = await eventoService.crearEvento(body, files);
            responseHandler(res, 201, evento);
        } catch (error) {
            console.error('Error en el controlador registrarEvento:', error);
            next(error);
        }
    },

    obtenerArchivos: async (req, res, next) => {
        try {
            const { eventoId } = req.params;
            const archivos = await eventoService.obtenerArchivos(eventoId);
            responseHandler(res, 200, archivos);
        } catch (error) {
            next(error);
        }
    },

    getAllEventosByPage: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const eventos = await eventoService.getAllEventosByPage(page);
            responseHandler(res, 200, eventos);
        } catch (error) {
            next(error);
        }
    },

    listarEventos: async (req, res, next) => {
        try {
            const eventos = await eventoService.obtenerEventos();
            // console.log(eventos)
            responseHandler(res, 200, eventos)
        } catch (error) {
            next(error);
        };
    },

    listarEventoPorId: async (req, res, next) => {
        try {
            const { id } = req.params;
            const evento = await eventoService.obtenerEventoPorId(id);
            responseHandler(res, 200, evento);
        } catch (error) {
            next(error);
        };
    },

    getEventosPorAccion: async (req, res, next) => {
        try {
            const { accionId } = req.params;

            if (!accionId) {
                throw new AppError('El parámetro accionId es requerido.', 400);
            }

            const eventos = await eventoService.buscarEventosPorAccion(accionId);

            if (eventos.length === 0) {
                errorHandler(res, 404, 'No se encontraron eventos para la acción proporcionada.');
            }
            responseHandler(res, 200, eventos)
        } catch (error) {
            next(error); // Pasar el error al middleware de manejo de errores
        }
    },

    editarEvento: async (req, res, next) => {
        try {
            console.log("Datos recibidos del evento a editar", req.body)
            const { id } = req.params;
            const files = req.files;
            const body = req.body;

            const eventoActualizado = await eventoService.editarEvento(id, body, files);
            console.log("Evento actualizado", eventoActualizado)

            responseHandler(res, 200, eventoActualizado);
        } catch (error) {
            console.error('Error en el controlador editarEvento:', error);
            next(error);
        }
    },

    eliminarEvento: async (req, res, next) => {
        try {
            const { id } = req.params;
            const evento = await eventoService.eliminarEvento(id);
            responseHandler(res, 204, 'Evento Eliminado');
        } catch (error) {
            next(error);
        }
    }
}