import Base from "deta/dist/types/base";
import Drive from "deta/dist/types/drive";
import { CompositeType } from "deta/dist/types/types/basic";
import { Category } from "@app/types";

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

export async function fetchNotes(drive: Drive, categories: Category[]) {
    return {};
}

export async function fetchCategories(db: Base, categoryIDs: string[]) {
    const categories = await Promise.all(
        categoryIDs.map(async (c) => await db.get(c))
    );
    return categories as any as Category[];
}
