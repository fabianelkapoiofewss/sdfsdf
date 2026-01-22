import { adherenteService } from "../services/adherente.service.js";
import { responseHandler } from "../../utils/responseHandler.js";


export const adherenteController = {
    getAllAdherentes: async (req, res, next) => {
        try {
            const adherentes = await adherenteService.obtenerAdherentes();
            responseHandler(res, 200, adherentes);
        } catch (error) {
            next(error);
        }
    },

    getAllAdherentesByPage: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const adherentes = await adherenteService.getAllAdherentesByPage(page);
            responseHandler(res, 200, adherentes);
        } catch (error) {
            next(error);
        }
    },

    getAdherenteById: async (req, res, next) => {
        const { id } = req.params;
        try {
            const adherente = await adherenteService.obtenerAdherentePorId(id);
            responseHandler(res, 200, adherente);
        } catch (error) {
            next(error);
        }
    },

    registrarAdherente: async (req, res, next) => {
        try {
            const adherente = await adherenteService.crearAdherente(req.body);
            responseHandler(res, 201, adherente);
        } catch (error) {
            next(error);
        }
    },
    
    eliminarAdherente: async (req, res, next) => {
        try {
            const { id } = req.params;
            const evento = await adherenteService.eliminarAdherentePorId(id)
            responseHandler(res, 204, 'Adherente Eliminado')
        } catch (error) {
            next(error)
        }
    },

    editarAdherente: async (req, res, next) => {
        const { id } = req.params;
        const adherente = req.body;
        try {
            const adherenteActualizado = await adherenteService.actualizarAdherente(id, adherente);
            responseHandler(res, 200, adherenteActualizado);
        } catch (error) {
            next(error);
        }
    },
};