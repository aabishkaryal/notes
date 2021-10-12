import { NextApiRequest, NextApiResponse } from "next";
import { Deta } from "deta";
import { v4 as uuidv4 } from "uuid";

import { validateEmail, validatePassword } from "@app/utils";
import { Category, User } from "@app/types";
import { hash } from "bcrypt";
import { fetchAll } from "@app/db";

const deta = Deta(process.env.DETA_PROJECT_KEY);
const userDB = deta.Base("User");
const categoryDB = deta.Base("Category");

export default async function SignUp(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { email, password } = JSON.parse(req.body);
    if (!email || !password)
        return res.status(400).json({
            error: "Email and password are required",
        });

    if (!validateEmail(email))
        return res.status(400).json({
            error: "Email is invalid",
        });

    if (!validatePassword(password))
        return res.status(400).json({
            error: "Passwords must be at least 8 character long with 2 numbers.",
        });

    const userUUID = uuidv4();
    const defaultCategoryUUID = uuidv4();
    try {
        const users = await fetchAll<User>(userDB, { email });
        if (users.length > 0)
            return res.status(303).json({
                error: "User with same email already exists.",
            });

        const encrypted = await hash(password, 10);
        const user = {
            key: userUUID,
            email,
            passwordHash: encrypted,
            categories: [defaultCategoryUUID],
        } as User;
        const defaultCategory = {
            key: defaultCategoryUUID,
            notes: [],
        } as Category;
        await userDB.put(user, userUUID);
        await categoryDB.put(defaultCategory, defaultCategoryUUID);
        return res.status(200).send({ message: "User created successfully" });
    } catch (error) {
        console.debug("SignUp Error", { error });
        return res.status(500).json({
            error: "Internal Server Error. Please try again.",
        });
    }
}
