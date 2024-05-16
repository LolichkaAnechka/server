import { Router, Request, Response } from "express";
import {
	UniqueConstraintError,
	lecturerController,
} from "./lecturerController";
const jwt = require("jsonwebtoken");

const lecturerRouter = Router();

import { cookieJWTAuth } from "../../middleware/middleware";
import { Role } from "@prisma/client";

lecturerRouter.post(
	"/create",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		if (req.user.role == Role.ADMIN) {
			try {
				const lecturer = await lecturerController.create(req.body);
				res.status(200).json(lecturer);
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

lecturerRouter.get(
	"/getLecturerDataFromId",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		const lecturer = await lecturerController.getLecturerFromId(req.body.id);
		if (lecturer) {
			res.status(200).json(lecturer);
		}

		res.status(403).json({ error: "User does not have lecturers" });
	}
);

lecturerRouter.post(
	"/setLecturerScientificData",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		if (req.user.role == Role.ADMIN) {
			return res
				.status(200)
				.json(await lecturerController.addScientificData(req.body));
		}

		res.status(404).json({ error: "You are not admin" });
	}
);

lecturerRouter.post(
	"/delete",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		if (req.user.role == Role.ADMIN) {
			const deletedLecturer = await lecturerController.delete(req.body.id);
			if (deletedLecturer) {
				res.status(200).json({ message: "Lecturer deleted" });
				return;
			}
		}

		res.status(404).json({ error: "You are not admin" });
		return;
	}
);

export { lecturerRouter };
