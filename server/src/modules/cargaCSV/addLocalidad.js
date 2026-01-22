import { localidadModel } from "../models/localidad.js";
import { getDirname } from "../../utils/getDirname.js";
import fs from 'node:fs';
import path from "node:path";
import csv from 'csv-parser';

export const cargarLocalidades = async () => {
    const localidades = [];
    const csvFilePath = path.join(getDirname(), '../data/LocalidadesFormosa.csv');

    return new Promise((resolve, reject) => {

        if (!fs.existsSync(csvFilePath)) { // verificamos que el archivo exista
            return reject(new Error("El archivo CSV no existe o la ruta es incorrecta."));
        }

        // leemos y procesamos el csv
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                // validamos datos antes de agregarlos
                if (
                    row.nombreLocalidad &&
                    typeof row.nombreLocalidad === 'string' &&
                    row.departamento &&
                    [
                        'Bermejo',
                        'Formosa',
                        'Laishí',
                        'Matacos',
                        'Patiño',
                        'Pilagás',
                        'Pilcomayo',
                        'Pirané',
                        'Ramón Lista',
                    ].includes(row.departamento.trim())
                ) {
                    localidades.push({
                        nombreLocalidad: row.nombreLocalidad.trim(),
                        departamento: row.departamento.trim(),
                    });
                } else {
                    console.warn(`Fila ignorada por datos inválidos: ${JSON.stringify(row)}`);
                }
            })
            .on('end', async () => {
                try {
                    if (localidades.length === 0) {
                        console.log('No se encontraron datos válidos en el archivo CSV.');
                        return resolve();
                    }

                    // eliminamos duplicados antes de insertar
                    const uniqueLocalidades = [
                        ...new Map(localidades.map(item => [item.nombreLocalidad + item.departamento, item])).values(),
                    ];

                    // insertamos documentos en la colección
                    await localidadModel.insertMany(uniqueLocalidades, { ordered: true }); // aseguramos que los documentos se inserten en el orden especificado
                    console.log('Datos de localidades cargados correctamente.');
                    resolve();
                } catch (error) {
                    console.error('Error al cargar localidades:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error al procesar el archivo CSV:', error);
                reject(error);
            });
    });
};