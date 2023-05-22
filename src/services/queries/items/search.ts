import { client } from "$services/redis";
import { itemsIndexKey } from "$services/keys";
import { deserialize } from "$services/queries/items/deserialize";

export const searchItems = async (term: string, size: number = 5) => {
    const cleaned = term
        .replaceAll(/[^a-zA-Z0-9 ]/g, '')
        .trim()
        .split(' ')
        .map(word => word ? `%${word}%` : '')
        .join(' ')

    if (cleaned === '') {
        return []
    }

    const query = `(@name:(${cleaned}), => { $weight: 5.0 }) | (@description:(${cleaned}))`

    const results = await client.ft.search(
        itemsIndexKey(),
        query,
        {
            LIMIT: {
                from: 0,
                size: size
            }
        }
    )

    return results.documents.map(({ id, value }) => deserialize(id, value as any))
};
