import "dotenv/config";

import prisma from "../../../db/db";

interface DepartamentCreationData {
	id: number;
	name: string;
	description: string;
}

export class UniqueConstraintError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UniqueConstraintError";
	}
}

export const departamentController = {
	create: async (departamentCreationData: DepartamentCreationData) => {
		try {
			const createdDepartament = await prisma.departament.create({
				data: {
					name: departamentCreationData.name,
					description: departamentCreationData.description,
					users: {
						create: {
							user: { connect: { id: departamentCreationData.id } },
						},
					},
				},
			});

			return createdDepartament;
		} catch (e) {
			console.log(e);
		}
	},

	getDepartamentDataFromUser: async (userId: number) => {
		const departamentsOfUser = await prisma.departament.findMany({
			where: {
				users: {
					some: {
						userId: userId,
					},
				},
			},
			include: {
				users: false,
				lecturers: false,
			},
		});

		return departamentsOfUser;
	},

	getDepartamentData: async (depId: number) => {
		const departament = await prisma.departament.findUnique({
			where: {
				id: depId,
			},
			include: {
				users: {
					include: {
						user: {
							select: {
								id: true,
								username: true,
								role: true,
							},
						},
					},
				},
				lecturers: {
					include: {
						sceintificDBData: true,
					},
				},
			},
		});

		return departament;
	},

	getAllDepartamentLecturers: async (departamentID: number) => {
		const lecturersOfDepartament = await prisma.departament
			.findUnique({
				where: { id: departamentID },
				include: {
					lecturers: true,
				},
			})
			.lecturers();

		return lecturersOfDepartament;
	},

	delete: async (id: number) => {
		const deletedDepartament = await prisma.departament.delete({
			where: {
				id: id,
			},
		});

		return deletedDepartament;
	},
};
