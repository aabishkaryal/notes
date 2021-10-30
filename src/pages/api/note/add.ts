import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

import { Deta } from "deta";
import { v4 as uuidv4 } from "uuid";

import { Note, Category } from "@app/types";

const deta = Deta(process.env.DETA_PROJECT_KEY);
const categoryDB = deta.Base("Category");
const notesDB = deta.Base("Notes");

export default async function AddCategory(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });
    if (!(session && session.user))
        return res.status(401).json({ error: "Unauthorized access." });

    const { topic, categoryID } = JSON.parse(req.body);
    if (!topic)
        return res.status(400).json({ error: "Missing category name." });
    if (!categoryID)
        return res.status(400).json({ error: "Missing category ID." });
    if (topic.length > 40)
        return res.status(400).json({ error: "Name too long." });

    const category: Category = (await categoryDB.get(categoryID)) as any;
    if (!category)
        return res.status(400).json({ error: "Category not found." });

    const noteUUID = uuidv4();
    const newNote = {
        key: noteUUID,
        topic,
        content: "",
        type: "Markdown",
        categoryID: category.key,
    } as Note;
    category.noteIDs.push(noteUUID);
    try {
        await categoryDB.put(category, category.key);
        await notesDB.put(newNote, noteUUID);
        return res.status(200).json({
            message: `${topic} created Successfully.`,
            note: newNote,
        });
    } catch (error) {
        console.debug("Add Note Error", { error });

        return res.status(500).json({ error: "Failed to add note." });
    }
}
