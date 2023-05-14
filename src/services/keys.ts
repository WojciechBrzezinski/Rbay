export const pageCacheKey = (id: String) => `pagecache#${id}`
export const usersKey = (userId: String) => `users#${userId}`
export const sessionsKey = (sessionId: String) => `sessions#${sessionId}`
export const usernamesKey = () => 'usernames'
export const usernamesUniqueKey = () => 'usernames:unique'
export const userLikesKey = (userId: String) => `user:likes#${userId}`

// Items
export const itemsKey = (itemId: String) => `items#${itemId}`
export const itemsByViewsKey = () => `items:views`
export const itemsByEndingAtKey = () => `items:endingAt`
export const itemsViewsKey = (itemId: String) => `items:views#${itemId}`
export const bidHistoryKey = (itemId: String) => `history#${itemId}`
