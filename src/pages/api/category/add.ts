import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

import { Deta } from "deta";
import { sanitize } from "dompurify";
import { v4 as uuidv4 } from "uuid";

import { fetchAll } from "@app/db";
import { Category, User } from "@app/types";

const deta = Deta(process.env.DETA_PROJECT_KEY);
const userDB = deta.Base("User");
const categoryDB = deta.Base("Category");

export default async function AddCategory(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });
    if (!(session && session.user))
        return res.status(401).json({ error: "Unauthorized access." });

    const { name } = JSON.parse(sanitize(req.body));
    if (!name) return res.status(400).json({ error: "Missing category name." });
    if (name.length > 40)
        return res.status(400).json({ error: "Category name too long." });

    const [user, ..._] = await fetchAll<User>(userDB, {
        email: session.user.email,
    });

    if (!user) return res.status(500).json({ error: "User not found." });

    const categoryUUID = uuidv4();
    const newCategory = {
        key: categoryUUID,
        name,
        noteIDs: [],
        userID: user.key,
    } as Category;
    user.categoryIDs.push(categoryUUID);
    try {
        await userDB.put(user, user.key);
        await categoryDB.put(newCategory, categoryUUID);
        return res.status(200).json({
            message: `${name} created successfully.`,
            category: newCategory,
        });
    } catch (error) {
        console.debug("Add Category Error", { error });

        return res.status(500).json({ error: "Failed to add category." });
    }
}
