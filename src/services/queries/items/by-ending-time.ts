import { client } from "$services/redis";
import { itemsByEndingAtKey } from "$services/keys";
import { getItems } from "$services/queries/items/items";

export const itemsByEndingTime = async (
    order: 'DESC' | 'ASC' = 'DESC',
    offset = 0,
    count = 10
) => {
    const ids = await client.zRange(
        itemsByEndingAtKey(),
        Date.now(),
        '+inf',
        {
            BY: 'SCORE',
            LIMIT: {
                offset,
                count
            }
        }
    )

    return getItems(ids)
};
