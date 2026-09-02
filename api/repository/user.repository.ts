import { z } from 'zod';
import bcrypt from 'bcrypt';
import { Crud } from "./base/crud.repository";

export const createUserSchema = z.object({
    name: z.string().transform(v => v === "" ? undefined : v).optional(),
    username: z.string().min(3, "Nome de utilizador é obrigatório"),
    password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres")
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

class UserRepository extends Crud {
    constructor() {
        super("user", {
            create: createUserSchema,
            update: updateUserSchema
        });
    }

    protected async beforeCreate(data: any) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return data;
    }

    protected async beforeUpdate(data: any) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return data;
    }
}

export const userRepository = new UserRepository();