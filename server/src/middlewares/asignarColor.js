import { accionModel } from "../modules/models/accion.js";
import fs from 'fs';
import path from 'path';

export const asignarColor = async function (next) {
    try {
        const iconDir = path.resolve('public/icons/acciones');
        const coloresDisponibles = fs
            .readdirSync(iconDir)
            .filter(f => f.endsWith('.png'))
            .map(f => path.basename(f, '.png'));

        const acciones = await accionModel.find();
        const coloresAsignados = acciones.map(a => a.colorMarcador).filter(Boolean);
        const coloresDisponiblesFiltrados = coloresDisponibles.filter(color => !coloresAsignados.includes(color));

        if (coloresDisponiblesFiltrados.length === 0) {
            throw new Error('No hay colores disponibles');
        }

        this.colorMarcador = coloresDisponiblesFiltrados[0];
        next();
    } catch (error) {
        next(error);
    }
};