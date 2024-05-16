import { Router, Request, Response } from "express";
import { userController, UniqueConstraintError } from "./userController";
const jwt = require("jsonwebtoken");

const userRouter = Router();

import * as bcrypt from "bcrypt";
import { cookieJWTAuth } from "../../middleware/middleware";
import { Role } from "@prisma/client";

async function verifyPassword(
	password: string,
	hashedPassword: string
): Promise<boolean> {
	return bcrypt.compare(password, hashedPassword);
}

userRouter.post("/register", async (req: Request, res: Response) => {
	try {
		const user = await userController.register(req.body);
		res.status(200).json({ message: "User registered" });
	} catch (e) {
		if (e instanceof UniqueConstraintError) {
			res.status(404).json({ error: e.message });
		}
	}
});

userRouter.get("/logout", async (req: Request, res: Response) => {
	res.clearCookie("token");
	return res.status(200).json({ message: "LOOL" });
});

userRouter.post("/login", async (req: Request, res: Response) => {
	const user = await userController.authorise(req.body);

	if (!user) {
		res
			.status(404)
			.json({ error: `No user with ${req.body.email} email found.` });
	} else {
		const isPasswordValid = await verifyPassword(
			req.body.password,
			user.password
		);
		if (!isPasswordValid) {
			res.status(404).json({
				error: `Provided invalid password for user with ${req.body.email} email`,
			});
			return;
		}
		const newuser = {
			id: user.id,
			username: user.username,
			role: user.role,
		};

		const token = jwt.sign(newuser, process.env.JWT_SECRET_KEY, {
			expiresIn: "1d",
		});

		return res
			.cookie("token", token, {
				httpOnly: true,
			})
			.json({ message: "Login successful, you will now be redirected" });
	}
});

userRouter.get("/checkLogIn", async (req: Request, res: Response) => {
	return res.status(200);
});

userRouter.post(
	"/addToDepartament",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		if (req.user.role == Role.ADMIN) {
			try {
				const user = await userController.addToDepartament(req.body);

				if (user) {
					const returnUser = {
						id: user.id,
						username: user.username,
						role: user.role,
					};
					res.status(200).json(returnUser);
					return;
				}
				res.status(404).json({ error: "Something went wrong" });
				return;
			} catch (e) {
				if (e instanceof UniqueConstraintError) {
					res.status(404).json({ error: e.message });
					return;
				}
			}
		}
		res.status(403).json({ error: "You are not admin" });
		return;
	}
);

userRouter.post(
	"/deleteFromDepartament",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		if (req.user.username == req.body.username) {
			res.status(404).json({ error: "Bruh... Dont delete yourself" });
			return;
		}
		if (req.user.role == Role.ADMIN) {
			const user = await userController.deleteFromDepartament(req.body);

			if (user) {
				const returnUser = {
					id: user.id,
					username: user.username,
					role: user.role,
				};
				res.status(200).json(returnUser);
				return;
			}
			res.status(404).json({ error: "Something went wrong" });
			return;
		}
		res.status(403).json({ error: "You are not admin" });
		return;
	}
);

userRouter.post(
	"/delete",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		if (req.user.role == Role.ADMIN) {
			res.json(await userController.delete(req.body));
		}
	}
);

export { userRouter };
