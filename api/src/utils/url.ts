export const extractIdFromUrl = (url: string): number => {
    return parseInt(url.split('/').slice(-2)[0])
}