// src/utils/hash.js
import bcrypt from "bcryptjs";

export const hashPassword = async (plain) => {
    // 10 "salt rounds" es un estándar seguro
    return await bcrypt.hash(plain, 10);
};

export const comparePassword = async (plain, hashed) => {
    return await bcrypt.compare(plain, hashed);
};