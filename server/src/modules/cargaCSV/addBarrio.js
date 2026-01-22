import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { barrioModel } from "../models/barrio.js";
import { getDirname } from "../../utils/getDirname.js";

export const cargarBarrios = async () => {
    const barrios = [];
    const csvFilePath = path.join(getDirname(), "../data/barrios.csv");

    return new Promise((resolve, reject) => {

        if (!fs.existsSync(csvFilePath)) {
            return reject(new Error("El archivo CSV no existe o la ruta es incorrecta."));
        }

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on("data", (row) => {
                if (row.nombreBarrio && typeof row.nombreBarrio === "string") {
                    barrios.push({ 
                        _id: new mongoose.Types.ObjectId(row._id.trim()),
                        nombreBarrio: row.nombreBarrio.trim() 
                    });
                } else {
                    console.warn(`Fila ignorada por datos inválidos: ${JSON.stringify(row)}`);
                }
            })
            .on("end", async () => {
                try {
                    if (barrios.length === 0) {
                        console.log("No se encontraron datos válidos en el archivo CSV.");
                        return resolve();
                    }

                    const uniqueBarrios = [
                        ...new Map(barrios.map(item => [item.nombreBarrio, item])).values(),
                    ];

                    await barrioModel.insertMany(uniqueBarrios, { ordered: true });
                    console.log("Datos de barrios cargados correctamente.");
                    resolve();
                } catch (error) {
                    console.error("Error al cargar los barrios:", error);
                    reject(error);
                }
            })
            .on("error", (error) => {
                console.error("Error al procesar el archivo CSV:", error);
                reject(error);
            });
    });
};