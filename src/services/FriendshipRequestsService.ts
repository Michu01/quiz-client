import ShouldAuthorize from "../enums/ShouldAuthorize";
import Friendship from "../models/Friendship";
import FriendshipRequest from "../models/FriendshipRequest";
import apiService from "./ApiService";

class FriendshipRequestsService {
    private baseUrl = 'friendshipRequests';

    async get(signal: AbortSignal): Promise<{ success: boolean, message: string, friendshipRequests: FriendshipRequest[] }> {
        const { success, message, response } = await apiService.get(this.baseUrl, { shouldAuthorize: ShouldAuthorize.Yes, signal: signal });

        return { success, message, friendshipRequests: success ? await response.json() : [] };
    }

    async getReceived(signal: AbortSignal): Promise<{ success: boolean, message: string, friendshipRequests: FriendshipRequest[] }> {
        const { success, message, response } = await apiService.get(`${this.baseUrl}/received`, { shouldAuthorize: ShouldAuthorize.Yes, signal: signal });

        return { success, message, friendshipRequests: success ? await response.json() : [] };
    }

    async getSent(signal: AbortSignal): Promise<{ success: boolean, message: string, friendshipRequests: FriendshipRequest[] }> {
        const { success, message, response } = await apiService.get(`${this.baseUrl}/sent`, { shouldAuthorize: ShouldAuthorize.Yes, signal: signal });

        return { success, message, friendshipRequests: success ? await response.json() : [] };
    }

    async send(userId: number): Promise<{ success: boolean, message: string, friendshipRequest: FriendshipRequest | null }> {
        const { success, message, response } = await apiService.post(`${this.baseUrl}/send/${userId}`, { shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message, friendshipRequest: success ? await response.json() : null };
    }

    async cancel(userId: number): Promise<{ success: boolean, message: string }> {
        const { success, message } = await apiService.delete(`${this.baseUrl}/cancel/${userId}`, { shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message };
    }

    async accept(senderId: number): Promise<{ success: boolean, message: string, friendship: Friendship | null }> {
        const { success, message, response } = await apiService.post(`${this.baseUrl}/accept/${senderId}`, { shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message, friendship: success ? await response.json() : [] };
    }

    async decline(senderId: number): Promise<{ success: boolean, message: string }> {
        const { success, message } = await apiService.delete(`${this.baseUrl}/decline/${senderId}`, { shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message };
    }
}

const friendshipRequestsService = new FriendshipRequestsService();

export default friendshipRequestsService;