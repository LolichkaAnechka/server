import { Router, Request, Response } from "express";
import {
	UniqueConstraintError,
	departamentController,
} from "./departamentController";
const jwt = require("jsonwebtoken");

const departamentRouter = Router();

import { cookieJWTAuth } from "../../middleware/middleware";
import { Role } from "@prisma/client";

departamentRouter.post(
	"/create",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		if (req.user.role == Role.ADMIN) {
			try {
				const departament = await departamentController.create({
					id: req.user.id,
					name: req.body.name,
					description: req.body.description,
				});
				res.status(200).json({ ...departament });
				return;
			} catch (e) {
				if (e instanceof UniqueConstraintError) {
					res.status(404).json({ error: e.message });
					return;
				}
			}
		}
		res.status(404).json({ error: "You are not admin" });
		return;
	}
);

departamentRouter.get(
	"/getDepartamentDataFromUser",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		const departament = await departamentController.getDepartamentDataFromUser(
			req.user.id
		);
		if (departament) {
			res.status(200).json(departament);
			return;
		}
		res.status(403).json({ error: "User does not have departaments" });
	}
);

departamentRouter.post(
	"/getDepartamentFromId",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		const departament = await departamentController.getDepartamentData(
			req.body.id
		);
		if (departament) {
			res.status(200).json(departament);
			return;
		}
		res.status(403).json({ error: "No such departament" });
		return;
	}
);

departamentRouter.get(
	"/getDepartamentLecturers",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		const departament = await departamentController.getAllDepartamentLecturers(
			req.body.id
		);
		if (departament) {
			res.status(200).json(departament);
			return;
		}

		res.status(403).json({ error: "User does not have departaments" });
	}
);

departamentRouter.post(
	"/delete",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		if (req.user.role == Role.ADMIN) {
			return res
				.status(200)
				.json(await departamentController.delete(req.body.id));
		}

		res.status(404).json({ error: "You are not admin" });
	}
);

export { departamentRouter };
