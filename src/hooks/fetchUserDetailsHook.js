
export async function fetchUserDetails(userId) {
    try {
        const response = await fetch("/api/fetch-user-details")
        const data = await response.json()

        console.log(data)

        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.error("An error occured in fetching details")
    }
}