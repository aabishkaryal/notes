import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

import { Deta } from "deta";

import { fetchAll } from "@app/db";
import { Category, User } from "@app/types";

const deta = Deta(process.env.DETA_PROJECT_KEY);
const notesDB = deta.Base("Notes");
const userDB = deta.Base("User");
const categoryDB = deta.Base("Category");

export default async function DeleteCategory(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });
    if (!(session && session.user))
        return res.status(401).json({ error: "Unauthorized access." });

    const { category }: { category: Category } = JSON.parse(req.body);
    if (!category)
        return res.status(400).json({ error: "Category is required" });

    const [user, ..._] = await fetchAll<User>(userDB, {
        email: session.user.email,
    });

    if (user.categoryIDs.filter((id) => id === category.key).length === 0)
        return res.status(403).json({ error: "Forbidden access." });

    try {
        for (let noteID of category.noteIDs) {
            await notesDB.delete(noteID);
        }
        user.categoryIDs = user.categoryIDs.filter((id) => id !== category.key);
        await userDB.put(user, user.key);
        await categoryDB.delete(category.key);
    } catch (error) {
        console.debug("Delete Category Error", { error });

        return res.status(500).json({ error: "Failed to delete category." });
    }

    return res.status(200).json({ message: "Category deleted." });
}
