export function buildAuthQueries(api) {
    return {
        me: (token) => api.me(token),
    };
}
