import "dotenv/config";

import { Prisma, Role } from "@prisma/client";
import prisma from "../../../db/db";
import * as bcrypt from "bcrypt";

interface UserCreationData {
	username: string;
	password: string;
	userRole: Role;
}

interface AuthData {
	username: string;
	password: string;
}

interface UserAddToDepasrtament {
	username: string;
	departamentId: number;
}

interface UserDeletionData {
	username: string;
}

export class UniqueConstraintError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UniqueConstraintError";
	}
}

async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(10);

	const hashedPassword = await bcrypt.hash(password, salt);

	return hashedPassword;
}

export const userController = {
	register: async (userCreationData: UserCreationData) => {
		try {
			const hashedPassword = await hashPassword(userCreationData.password);

			const createdUser = await prisma.user.create({
				data: {
					username: userCreationData.username,
					password: hashedPassword,
					role: userCreationData.userRole,
				},
			});

			return {
				id: createdUser.id,
				username: createdUser.username,
				role: createdUser.role,
			};
		} catch (e) {
			console.log(e);

			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === "P2002") {
					console.log(
						`Unique constraint violation, user with [${userCreationData.username}] already exists`
					);
					throw new UniqueConstraintError(
						`User with username ${userCreationData.username} already exists`
					);
				}
			}
		}
	},

	authorise: async (userAuthData: AuthData) => {
		const foundUser = await prisma.user.findFirst({
			where: {
				username: userAuthData.username,
			},
		});

		return foundUser;
	},

	addToDepartament: async (userToDepartamentData: UserAddToDepasrtament) => {
		try {
			const user = await prisma.user.findUnique({
				where: {
					username: userToDepartamentData.username,
				},
			});

			if (!user) {
				return undefined;
			}

			const userOnDepartament = await prisma.userOnDepartament.create({
				data: {
					userId: user.id,
					departamentId: userToDepartamentData.departamentId,
				},
			});
			return user;
		} catch (e) {
			console.log(e);

			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === "P2002") {
					console.log(
						`Unique constraint violation such UserOnDepartament relation alredy exists`
					);
					throw new UniqueConstraintError(
						`User is probably already assigned to this departament`
					);
				}
			}
		}
	},

	deleteFromDepartament: async (
		userToDepartamentData: UserAddToDepasrtament
	) => {
		const user = await prisma.user.findUnique({
			where: {
				username: userToDepartamentData.username,
			},
		});

		if (!user) {
			return undefined;
		}

		const userOnDepartament = await prisma.userOnDepartament.delete({
			where: {
				userId_departamentId: {
					userId: user.id,
					departamentId: userToDepartamentData.departamentId,
				},
			},
		});
		return user;
	},

	delete: async (userDeletionData: UserDeletionData) => {
		const wantedUser = await prisma.user.findFirstOrThrow({
			where: {
				username: userDeletionData.username,
			},
		});
		const deletedUser = await prisma.user.delete({
			where: {
				username: userDeletionData.username,
			},
		});

		return deletedUser;
	},
};
