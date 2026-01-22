import { create, deleteById, getAll, getAllByPage, getForId, updateById } from "../../utils/getRegisters.js";
import { accionModel } from "../models/accion.js";

export const accionService = {
    async crearAccion(accion) {
        return await create(accionModel, accion)
    },

    async obtenerAcciones() {
        return await getAll(accionModel);
    },

    async getAllAccionesByPage(page = 1) {
        return await getAllByPage(page, accionModel);
    },

    async obtenerAccionPorId(id) {
        return await getForId(accionModel, id);
    },

    async editarAccion(id, accion) {
        return await updateById(accionModel, id, accion);
    },

    async eliminarAccion(id) {
        return await deleteById(accionModel, id);
    }
};