import ShouldAuthorize from "../enums/ShouldAuthorize";
import apiService from "./ApiService";

class AvatarsService {
    private baseUrl = 'avatars';

    async getPath(signal: AbortSignal): Promise<{ success: boolean, message: string, path: string | null }> {
        const { success, message, response } = await apiService.get(`${this.baseUrl}/path`, { signal, shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message, path: success ? await response.text() : null };
    }

    async findPath(userId: number, signal: AbortSignal): Promise<{ success: boolean, message: string, path: string | null }> {
        const { success, message, response } = await apiService.get(`${this.baseUrl}/${userId}/path`, { signal });

        return { success, message, path: success ? await response.text() : null };
    }

    async change(file: File): Promise<{ success: boolean, message: string, path: string | null }> {
        const data = new FormData()
        data.append('file', file);

        const { success, message, response } = await apiService.post(`${this.baseUrl}/change`, { body: data, isContentTypeJson: false, shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message, path: success ? await response.text() : null };
    }
}

const avatarsService = new AvatarsService();

export default avatarsService;