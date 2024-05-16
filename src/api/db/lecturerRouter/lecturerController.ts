import "dotenv/config";

import prisma from "../../../db/db";
import { Prisma, Source } from "@prisma/client";

interface LecturerCreationData {
	name: string;
	surname: string;
	departamentId: number;
	sceintificDBData: {
		id: string;
		source: Source;
	};
}

interface ScientificDataCreationData {
	id: string;
	authorId: number;
	source: Source;
}

export class UniqueConstraintError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UniqueConstraintError";
	}
}

export const lecturerController = {
	create: async (lecturerCreationData: LecturerCreationData) => {
		try {
			const createdDepartament = await prisma.lecturer.create({
				data: {
					name: lecturerCreationData.name,
					surname: lecturerCreationData.surname,
					departamentId: lecturerCreationData.departamentId,
					sceintificDBData: {
						create: {
							id: lecturerCreationData.sceintificDBData.id,
							source: lecturerCreationData.sceintificDBData.source,
						},
					},
				},
			});

			return createdDepartament;
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === "P2002") {
					console.log(
						`Unique constraint violation, lecturer with [${lecturerCreationData.sceintificDBData.id}] scholar id already exists`
					);
					throw new UniqueConstraintError(
						`User with scholar id ${lecturerCreationData.sceintificDBData.id} already exists`
					);
				}
			}
		}
	},

	getLecturerFromId: async (lecturerId: number) => {
		const lecturer = await prisma.lecturer.findUnique({
			where: { id: lecturerId },
			include: {
				sceintificDBData: true,
			},
		});

		return lecturer;
	},

	addScientificData: async (creationData: ScientificDataCreationData) => {
		const data = await prisma.scientificDBData.create({
			data: {
				id: creationData.id,
				source: creationData.source,
				author: {
					connect: { id: creationData.authorId },
				},
			},
		});
		return data;
	},

	delete: async (id: number) => {
		const deletedLecturer = await prisma.lecturer.delete({
			where: {
				id: id,
			},
		});

		return deletedLecturer;
	},
};
