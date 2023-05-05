import { client } from "$services/redis";
import { itemsByViewsKey, itemsKey } from "$services/keys";

export const incrementView = async (itemId: string, userId: string) => {
    await Promise.all([
        client.hIncrBy(itemsKey(itemId), 'views', 1),
        client.zIncrBy(itemsByViewsKey(), 1, itemId)
    ])
};
