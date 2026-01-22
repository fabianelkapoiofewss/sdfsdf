import { personaService } from "../services/persona.service.js";
import { responseHandler } from "../../utils/responseHandler.js";
import { AppError } from "../../utils/handleError.js"


export const personaController = {

    registrarPersona: async (req, res, next) => {
        try {
            const persona = await personaService.registrarPersona(req.body);
            responseHandler(res, 201, persona);
        } catch (error) {
            next(error);
        }
    },

    getAllPersonas: async (req, res, next) => {
        try {
            const personas = await personaService.obtenerPersonas();
            responseHandler(res, 200, personas);
        } catch (error) {
            next(error);
        }
    },

    getPersonaById: async (req, res, next) => {
        const { id } = req.params;
        try {
            const persona = await personaService.obtenerPersonaPorId(id);
            responseHandler(res, 200, persona);
        } catch (error) {
            next(error);
        }
    },

    editarPersona: async (req, res, next) => {
        try {
            const editPersona = await personaService.editarRegistroPersona(req.params.id, req.body);
            responseHandler(res, 200, editPersona);
        } catch (error) {
            next(error);
        }
    },

    eliminarPersona: async (req, res, next) => {
        try {
            const persona = await personaService.eliminarRegistroPersona(req.params.id);
            responseHandler(res, 204, 'Registro Eliminado');
        } catch (error) {
            next(error);
        }
    },

    listarPersonasBarrios: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const personas = await personaService.listarPersonasBarrios(page);
            responseHandler(res, 200, personas);
        } catch (error) {
            next(error)
        }
    },

    listarPersonas: async (req, res, next) => {
        try {
            const personas = await personaService.listarPersonas();
            if (!personas.length) {
                res.status(404).json({ mensaje: "No se encontraron personas." });
            }
            responseHandler(res, 200, personas);
        } catch (error) {
            next(error);
        }
    },

    getPersonasConCargo: async (req, res, next) => {
        try {
            const personas = await personaService.getPersonasConCargo();
            responseHandler(res, 200, personas);
        } catch (error) {
            next(error);
        }
    },

    buscarPersonas: async (req, res, next) => {
        try {
            const { campo, valor } = req.body;

            if (!campo || !valor) {
                throw new AppError("El campo y el valor son requeridos.", 400);
            }

            const resultados = await personaService.buscarPorCampo(campo, valor);

            responseHandler(res, 200, resultados);
        } catch (error) {
            next(error);
        }
    },

    encontrarPersona: async (req, res, next) => {
        try {
            const personas = await personaService.encontrarPersona(req.params.id);
            responseHandler(res, 200, personas);
        } catch (error) {
            next(error);
        }
    },

    buscarEventosPersona: async (req, res, next) => {
        try {
            const { id } = req.params;
            const eventos = await personaService.listarEventosPersona(id);
            responseHandler(res, 200, eventos);
        } catch (error) {
            next(error);
        }
    },

    listarEventosOrganizador: async (req, res, next) => {
        try {
            const { id } = req.params;
            const eventos = await personaService.listarEventosOrganizados(id);

            if (!eventos.length) {
                res.status(404).json({ mensaje: "No se encontraron eventos." });
            }

            responseHandler(res, 200, eventos);
        } catch (error) {
            next(error);
        }
    },

    filtroPersonas: async (req, res, next) => {
        try {
            const filtros = req.body;
            const resultados = await personaService.filtrarRegistros(filtros);

            if (!resultados.length) {
                res.status(404).json({ mensaje: "No se encontraron registros." });
            }

            responseHandler(res, 200, resultados );
        } catch (error) {
            next(error);
        }
    }
}