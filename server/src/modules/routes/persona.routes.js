import { Router } from "express";
import { personaController } from "../controllers/persona.controller.js";
import { personaValidationRules } from "../models/schema/persona.schema.js";
import { validate } from "../../middlewares/validationError.js";
import { validacionFiltros } from "../models/schema/busquedaPersona.schema.js";

const personaRouter = Router();

personaRouter.post('/', personaValidationRules, validate, personaController.registrarPersona);
personaRouter.get('/', personaController.listarPersonasBarrios);
personaRouter.get('/ubiPersonas', personaController.listarPersonas);
personaRouter.get('/con-cargo', personaController.getPersonasConCargo);
personaRouter.get('/:id', personaController.getPersonaById);
personaRouter.get('/buscar-persona/:id', personaController.buscarEventosPersona);
personaRouter.get('/buscar-organizador/:id', personaController.listarEventosOrganizador);
personaRouter.post('/buscar-personas', validacionFiltros, validate, personaController.filtroPersonas);
personaRouter.get('/encontrar/:id', personaController.encontrarPersona);
personaRouter.put('/:id', personaController.editarPersona);
personaRouter.delete('/:id', personaController.eliminarPersona);
personaRouter.post('/buscar', personaController.buscarPersonas);

export { personaRouter}