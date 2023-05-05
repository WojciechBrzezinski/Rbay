import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usernamesUniqueKey, usersKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {

};

export const getUserById = async (id: string) => {
    const userAttrs = await client.hGetAll(usersKey(id))

    return deserialize(id, userAttrs)
};

export const createUser = async (attrs: CreateUserAttrs) => {
    const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username)

    if (exists) {
        throw new Error('Username is taken')
    }

    const userId = genId()

    await client.hSet(usersKey(userId), serialize(attrs))
    await client.sAdd(usernamesUniqueKey(), attrs.username)

    return userId
};

const serialize = (user: CreateUserAttrs) => {
    return { username: user.username, password: user.password }
}

const deserialize = (id: String, user: { [key: string]: string }) => {
    return { id, username: user.username, password: user.password }
}
