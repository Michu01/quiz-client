import ShouldAuthorize from "../enums/ShouldAuthorize";
import User from "../models/User";
import apiService from "./ApiService";

class UsersService {
    private baseUrl = 'users';

    async get(namePattern: string | null, friendsOnly: boolean, signal: AbortSignal): Promise<{ success: boolean, message: string, users: User[] }> {
        const { success, message, response } = await apiService.get(`${this.baseUrl}?namePattern=${namePattern ?? ''}&friendsOnly=${friendsOnly}`, { signal });

        return { success, message, users: success ? await response.json() : [] };
    }

    async getMe(signal: AbortSignal): Promise<{ success: boolean, message: string, user: User | null }> {
        const { success, message, response } = await apiService.get(`${this.baseUrl}/me`, { signal, shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message, user: success ? await response.json() : null };
    }

    async find(id: number, signal: AbortSignal): Promise<{ success: boolean, message: string, user: User | null }> {
        const { success, message, response } = await apiService.get(`${this.baseUrl}/${id}`, { signal });

        return { success, message, user: success ? await response.json() : null };
    }

    async isFriend(id: number, signal: AbortSignal): Promise<{ success: boolean, message: string, isFriend: boolean | null }> {
        const { success, message, response } = await apiService.get(`${this.baseUrl}/${id}/isFriend`, { signal, shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message, isFriend: success ? await response.text() === "true" : null };
    }

    async isInvited(id: number, signal: AbortSignal): Promise<{ success: boolean, message: string, isInvited: boolean | null }> {
        const { success, message, response }  = await apiService.get(`${this.baseUrl}/${id}/isInvited`, { signal, shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message, isInvited: success ? await response.text() === "true" : null };
    }
}

const usersService = new UsersService();

export default usersService;