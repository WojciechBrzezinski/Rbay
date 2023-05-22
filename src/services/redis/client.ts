import { createClient, defineScript } from 'redis';
import { itemsByViewsKey, itemsKey, itemsViewsKey } from "$services/keys";
import { createIndexes } from "$services/redis/create-indexes";

const client = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
    },
    password: process.env.REDIS_PW,
    scripts: {
        addOneAndStore: defineScript({
            NUMBER_OF_KEYS: 1,
            SCRIPT: `
				return redis.call('SET', KEYS[1], 1 + tonumber(ARGV[1]))
			`,
            transformArguments(key: string, value: number) {
                return [key, value.toString()]
            },
            transformReply(reply: any) {
                return reply
            }
        }),
        incrementView: defineScript({
            NUMBER_OF_KEYS: 3,
            SCRIPT: `
                local itemsViewsKey = KEYS[1]
                local itemsKey = KEYS[2]
                local itemsByViewsKey = KEYS[3]

                local itemId = ARGV[1]
                local userId = ARGV[2]

                local inserted = redis.call('PFADD', itemsViewsKey, userId)

                if inserted == 1 then
                    redis.call('HINCRBY', itemsKey, 'views', 1)
                    redis.call('ZINCRBY', itemsByViewsKey, 1, itemId)
                end
            `,
            transformArguments(itemId: string, userId: string) {
                return [itemsViewsKey(itemId), itemsKey(itemId), itemsByViewsKey(), itemId, userId]
            }
        }),
        unlock: defineScript({
            NUMBER_OF_KEYS: 1,
            SCRIPT: `
                local lockKey = KEYS[1]
                local token = ARGV[1]

                local lockValue = redis.call('GET', lockKey)

                if lockValue == token then
                    redis.call('DEL', lockKey)
                end
            `,
            transformArguments(key: string, token: string) {
                return [key, token]
            }
        })
    }
});

// client.on('connect', async () => {
//     await client.addOneAndStore('books:count', 10)
//     const result = await client.get('books:count')
//     console.log(result)
// })

client.on('error', (err) => console.error(err));
client.connect();
client.on('connect', async () => {
    try {
        await createIndexes()
    } catch (error) {
        console.error(error)
    }
})

export { client };
