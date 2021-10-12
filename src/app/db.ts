import Base from "deta/dist/types/base";
import Drive from "deta/dist/types/drive";
import { CompositeType } from "deta/dist/types/types/basic";

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

export async function fetchNotes(db: Base, drive: Drive, categories: string[]) {
    return {};
}
