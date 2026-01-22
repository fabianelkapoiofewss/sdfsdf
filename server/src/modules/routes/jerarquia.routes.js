import { Router } from "express";
import { jerarquiaController } from "../controllers/jerarquia/jerarquia.controller.js";

const jerarquiaRouter = Router();

jerarquiaRouter.get('/', jerarquiaController.getAllPersonasConCargo);

export { jerarquiaRouter };