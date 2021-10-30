import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

import { Deta } from "deta";

import { fetchAll } from "@app/db";
import { Category, Note, User } from "@app/types";

const deta = Deta(process.env.DETA_PROJECT_KEY);
const notesDB = deta.Base("Notes");
const userDB = deta.Base("User");
const categoryDB = deta.Base("Category");

export default async function DeleteNote(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });
    if (!(session && session.user))
        return res.status(401).json({ error: "Unauthorized access." });

    const { note }: { note: Note } = JSON.parse(req.body);
    if (!note) return res.status(400).json({ error: "Note is required" });

    const [user, ..._] = await fetchAll<User>(userDB, {
        email: session.user.email,
    });

    const category = (await categoryDB.get(note.categoryID)) as Category;
    if (user.categoryIDs.filter((id) => id === note.categoryID).length === 0)
        return res.status(403).json({ error: "Forbidden access." });

    if (!category)
        return res
            .status(400)
            .json({ error: "Category of the note doesn't exist." });

    try {
        category.noteIDs = category.noteIDs.filter((id) => id !== note.key);
        await categoryDB.put(category, category.key);
        await notesDB.delete(note.key);
    } catch (error) {
        console.debug("Delete Note Error", { error });

        return res.status(500).json({ error: "Failed to delete note." });
    }

    return res.status(200).json({ message: "Note deleted." });
}
