import { fetchUserDetails as fetchUserAction } from "@/app/actions/userActions";

export async function fetchUserDetails(userId) {
    try {
        if (!userId) return null;

        const result = await fetchUserAction(userId);

        if (!result.success) {
            console.error("Error fetching user details:", result.message);
            return null;
        }

        return result.userDetails;
    } catch (error) {
        console.error("Error in fetchUserDetails:", error);
        return null;
    }
}