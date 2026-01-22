import { Router } from "express";
import { jurisdiccionController } from "../controllers/jurisdiccion.controller.js";

const jurisdiccionRouter = Router();

jurisdiccionRouter.get('/', jurisdiccionController.getAllJurisdicciones);
jurisdiccionRouter.get('/by-page', jurisdiccionController.getAllJurisdiccionesByPage);
jurisdiccionRouter.get('/:id', jurisdiccionController.obtenerJurisdiccionPorId);
jurisdiccionRouter.post('/', jurisdiccionController.registrarJurisdiccion);
jurisdiccionRouter.put('/:id', jurisdiccionController.editarJurisdiccion);
jurisdiccionRouter.delete('/:id', jurisdiccionController.eliminarJurisdiccion);

export { jurisdiccionRouter }