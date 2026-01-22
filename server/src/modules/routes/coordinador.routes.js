import { Router } from "express";
import { coordinadorJurisdiccionController } from "../controllers/coordinadorJurisdiccion.controller.js";

const coordinadorRouter = Router();

coordinadorRouter.post('/', coordinadorJurisdiccionController.crearCoordinadorJurisdiccion);
coordinadorRouter.get('/', coordinadorJurisdiccionController.getAllCoordinadoresJurisdiccion);
coordinadorRouter.get('/by-page', coordinadorJurisdiccionController.getAllCoordinadoresByPage);
coordinadorRouter.get('/:id', coordinadorJurisdiccionController.getCoordinadorJurisdiccionById);
// coordinadorRouter.get('/:id', coordinadorJurisdiccionController.obtenerCoordinador);
coordinadorRouter.delete('/:id', coordinadorJurisdiccionController.eliminarCoordinadorJurisdiccion);
coordinadorRouter.put('/:coordinadorId', coordinadorJurisdiccionController.editarCoordinador);
coordinadorRouter.get('/con-personas-a-cargo/:dni', coordinadorJurisdiccionController.obtenerCoordinadorConPersonasACargo);

export { coordinadorRouter }