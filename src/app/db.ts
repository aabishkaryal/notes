import Base from "deta/dist/types/base";
import { CompositeType } from "deta/dist/types/types/basic";
import { Category, Note } from "@app/types";

export async function fetchAll<T>(
    db: Base,
    query: CompositeType = {}
): Promise<T[]> {
    let fetchResponse = await db.fetch(query);
    let items = fetchResponse.items;
    while (fetchResponse.last) {
        fetchResponse = await db.fetch(query, { last: fetchResponse.last });
        items = items.concat(fetchResponse.items);
    }
    return items as any as T[];
}

export async function fetchNotes(db: Base, categories: Category[]) {
    const notes: { [key: string]: Note[] } = {};
    for (const category of categories) {
        notes[category.key] = await fetchAll<Note>(db, {
            categoryID: category.key,
        });
    }
    return notes;
}

export async function fetchCategories(db: Base, categoryIDs: string[]) {
    return (await Promise.all(
        categoryIDs.map(async (c) => await db.get(c))
    )) as any as Category[];
}
