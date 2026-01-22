import { fileURLToPath } from 'url';
import { dirname } from 'node:path';

export const getDirname = () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    return __dirname
}