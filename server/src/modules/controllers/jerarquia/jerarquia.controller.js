import { coordinadorJurisdiccionModel } from "../../models/coordinadorJurisdiccion.js";
import { dirigenteModel } from "../../models/dirigente.js";
import { adherenteModel } from "../../models/adherente.js";
import { jerarquiaService } from "../../services/jerarquia/jerarquia.service.js";
import { responseHandler } from "../../../utils/responseHandler.js";


export const jerarquiaController = {
    getAllPersonasConCargo: async (req, res, next) => {
        try {
            const personasConCargo = await jerarquiaService.getAllPersonasConCargo([
                coordinadorJurisdiccionModel,
                dirigenteModel,
                adherenteModel
            ]);
            responseHandler(res, 200, personasConCargo);
        } catch (error) {
            next(error);
        }
    },
};