import { Router } from "express";
import { validate } from "../../middlewares/validationError.js";
import { eventoController } from "../controllers/evento.controller.js";
import { eventoValidationRules } from "../models/schema/evento.schema.js";
import { upload } from "../../helpers/multerConfig.js";

const eventoRouter = Router();

eventoRouter.post('/', eventoValidationRules, validate, upload, eventoController.registrarEvento);
eventoRouter.get('/', eventoController.listarEventos);
eventoRouter.get('/by-page', eventoController.getAllEventosByPage);
eventoRouter.get('/:id', eventoController.listarEventoPorId);
eventoRouter.get('/:accionId', eventoController.getEventosPorAccion);
eventoRouter.get('/archivos/:eventoId', eventoController.obtenerArchivos);
eventoRouter.put('/:id', eventoValidationRules, validate, upload, eventoController.editarEvento);
eventoRouter.delete('/:id', eventoController.eliminarEvento);

export { eventoRouter }