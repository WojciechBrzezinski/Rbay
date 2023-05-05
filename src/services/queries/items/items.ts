import type { CreateItemAttrs } from '$services/types';
import { client } from "$services/redis";
import { serialize } from "$services/queries/items/serialize";
import { genId } from "$services/utils";
import { deserialize } from "$services/queries/items/deserialize";
import { itemsKey } from "$services/keys";

export const getItem = async (id: string) => {
    const item = await client.hGetAll(itemsKey(id))

    if (Object.keys(item).length === 0) {
        return null
    }

    return deserialize(id, item)
};

export const getItems = async (ids: string[]) => {
    const commands = ids.map(id => {
        return client.hGetAll(itemsKey(id))
    })

    const results = await Promise.all(commands)

    return results.map((result, index) => {
        if (Object.keys(result).length === 0) {
            return null
        }

        return deserialize(ids[index], result)
    })
};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
    const itemId = genId()
    const serialized = serialize(attrs)

    await client.hSet(itemsKey(itemId), serialized)

    return itemId
};