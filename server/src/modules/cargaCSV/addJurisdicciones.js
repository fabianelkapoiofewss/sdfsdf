import { jurisdiccionModel } from "../models/jurisdiccion.js";
import fs from 'node:fs';
import path from 'node:path';

const cargarJurisdicciones = async () => {
    try {
        const count = await jurisdiccionModel.countDocuments();
        if (count > 0) {
            console.log('La colección jurisdicciones ya tiene datos. No se insertará nada.');
            return;
        }

        const filePath = path.resolve('./src/data/jurisdicciones.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        await jurisdiccionModel.insertMany(data);
        console.log('Datos de jurisdicciones insertados correctamente.');
    } catch (error) {
        console.error('Error al cargar jurisdicciones:', error);
    }
};

export default cargarJurisdicciones;
