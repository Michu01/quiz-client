import ShouldAuthorize from "../enums/ShouldAuthorize";
import Category from "../models/Category";
import apiService from "./ApiService";

class CategoriesService {
    private baseUrl = 'categories';

    async get(signal: AbortSignal | null = null) : Promise<{ success: boolean, message: string, categories: Category[] }> {
        const { success, message, response } = await apiService.get(this.baseUrl, { signal });

        return { success, message, categories: success ? await response.json() : [] };
    }

    async find(id: number, signal: AbortSignal): Promise<{ success: boolean, message: string, category: Category | null }> {
        const { success, message, response } = await apiService.get(`${this.baseUrl}/${id}`, { signal });

        return { success, message, category: success ? await response.json() : null };
    }

    async create(name: string): Promise<{ success: boolean, message: string, category: Category | null }> {
        const body = JSON.stringify({ name });

        const { success, message, response } = await apiService.post(this.baseUrl, { body, shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message, category: success ? await response.json() : null };
    }

    async delete(id: number): Promise<{ success: boolean, message: string }> {
        const { success, message }  = await apiService.delete(`${this.baseUrl}/${id}`, { shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message };
    }
}

const categoriesService = new CategoriesService();

export default categoriesService;