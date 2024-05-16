import { Router, Request, Response } from "express";
import { scholarController } from "./scholarController";
import { cookieJWTAuth } from "../middleware/middleware";

const scholarRouter = Router();

scholarRouter.get(
	"/organic/:searchQuery",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		res.json(await scholarController.getOrganicResults(req.params.searchQuery));
	}
);

scholarRouter.post(
	"/profiles",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		res.json(await scholarController.getProfiles(req.body.query));
	}
);

scholarRouter.get(
	"/author/:id",
	cookieJWTAuth,
	async (req: Request, res: Response) => {
		const author = await scholarController.getAuthor(req.params.id);

		if (author) {
			res.status(200).json(author);
			return;
		}
		res.status(404).json({ error: "No author found" });
		return;
	}
);

export { scholarRouter };
