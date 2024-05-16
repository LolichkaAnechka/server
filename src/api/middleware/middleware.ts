import { Response, NextFunction, Request } from "express";
const jwt = require("jsonwebtoken");
import { Role } from "@prisma/client";
declare global {
	namespace Express {
		interface Request {
			user: { id: number; username: string; role: Role };
		}
	}
}

export const cookieJWTAuth = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log("MiddlewareAccesed");

	const token = req.cookies.token;
	try {
		const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.user = user;
		next();
	} catch (error) {
		res.clearCookie("token");
		return res.status(403).json({ redirect: "/login" });
	}
};
