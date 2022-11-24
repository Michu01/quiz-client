import ShouldAuthorize from "../enums/ShouldAuthorize";
import User from "../models/User";
import apiService from "./ApiService";

class FriendsService {
    private baseUrl = 'friends';

    async get(signal: AbortSignal): Promise<{ success: boolean, message: string, friends: User[] }> {
        const { success, message, response } = await apiService.get(this.baseUrl, { shouldAuthorize: ShouldAuthorize.Yes, signal: signal });

        return { success, message, friends: success ? await response.json() : [] };
    }

    async delete(id: number): Promise<{ success: boolean, message: string }> {
        const { success, message } = await apiService.delete(`${this.baseUrl}/${id}`, { shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message };
    }
}

const friendsService = new FriendsService();

export default friendsService;