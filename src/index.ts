import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { scholarRouter } from "./api/schoolar/scholarRouter";
import { userRouter } from "./api/db/userRouter/userRouter";
import { departamentRouter } from "./api/db/departamentRouter/departamentRouter";
import { lecturerRouter } from "./api/db/lecturerRouter/lecturerRouter";
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

	// Request methods you wish to allow
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);

	// Request headers you wish to allow
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader("Access-Control-Allow-Credentials", "true");

	// Pass to next layer of middleware
	next();
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", userRouter);
app.use("/api/departament", departamentRouter);
app.use("/api/lecturer", lecturerRouter);

app.use("/api/scholar", scholarRouter);

app.get("/", (req: Request, res: Response) => {
	res.send("ABOBA");
});

// function main() {
// 	(async () => {
// 		const responce = await fetch(
// 			"https://api.elsevier.com/content/search/author?apiKey=d5c5fb97413623d2ccae3c555d6fcc95",
// 			{
// 				method: "GET",
// 				headers: {
// 					Accept: "application/json",
// 					"Content-Type": "application/json",
// 				},
// 			}
// 		);
// 		const json = await responce.json();
// 		console.log(json);
// 	})();
// }
// main();

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
