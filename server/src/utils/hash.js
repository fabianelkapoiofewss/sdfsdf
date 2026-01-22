import bcrypt from 'bcrypt';

export const hash = {
    hashPassword: async (password) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    },
    comparePassword: async (password, hashedPassword) => {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }
};