/* eslint-disable import/no-anonymous-default-export */
import { getToken } from "next-auth/jwt";

export default async (req, res, next) => {
    const token = await getToken({
        req,
        secret: process.env.JWT_SECRET,
        secureCookie: process.env.NODE_ENV === "production",
    });
    if (token) {
        req.user = token.sub;
        next();
    } else {
        res.status(401).json({ message: "Not Logged in :" });
    }
    // res.end();
};