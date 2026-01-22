import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { dbConnect } from "../database/dbConnection.js";
import { envConfig } from "../config/envConfig.js";
import { router } from "../modules/routes/index.routes.js";

const app = express()
const port = envConfig.PORT
const isProduction = envConfig.NODE_ENV === 'production'
app.use(cors({
    origin: 'https://por-siempre-companero.pages.dev',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))


app.use(morgan('dev'))
app.use(cookieParser())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

export const listen = async () => {
    try {
        await dbConnect();
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    } catch (err) {
        console.log("Unable to connect to the database", err);
    };
};
