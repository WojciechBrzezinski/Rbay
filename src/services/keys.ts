export const pageCacheKey = (id: String) => `pagecache#${id}`
export const usersKey = (userId: String) => `users#${userId}`
export const sessionsKey = (sessionId: String) => `sessions#${sessionId}`
export const itemsKey = (itemId: String) => `items#${itemId}`
export const usernamesKey = () => 'usernames'
export const usernamesUniqueKey = () => 'usernames:unique'
export const userLikesKey = (userId: String) => `user:likes#${userId}`
