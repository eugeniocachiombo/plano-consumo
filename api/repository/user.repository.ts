import { prisma } from "../lib/prisma";
import { Crud } from "./base/crud.repository";

class UserRepository extends Crud {

    constructor() {
        super("user"); 
    }

    
}

export const userRepository = new UserRepository();