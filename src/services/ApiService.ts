import ShouldAuthorize from "../enums/ShouldAuthorize";
import authService from "./AuthService";

class ApiService {
    private port = 7109;
    private baseUrl = `https://localhost:${this.port}/api`;

    get = async (url: string, { shouldAuthorize = ShouldAuthorize.No, signal = null, body = null, isContentTypeJson = true } : any) => 
        this.fetch(url, "GET", { shouldAuthorize, signal, body, isContentTypeJson });

    post = async (url: string, { shouldAuthorize = ShouldAuthorize.No, signal = null, body = null, isContentTypeJson = true } : any) => 
        this.fetch(url, "POST", { shouldAuthorize, signal, body, isContentTypeJson });

    patch = async (url: string, { shouldAuthorize = ShouldAuthorize.No, signal = null, body = null, isContentTypeJson = true } : any) => 
        this.fetch(url, "PATCH", { shouldAuthorize, signal, body, isContentTypeJson });

    delete = async (url: string, { shouldAuthorize = ShouldAuthorize.No, signal = null, body = null, isContentTypeJson = true } : any) => 
        this.fetch(url, "DELETE", { shouldAuthorize, signal, body, isContentTypeJson });

    async fetch(url: string, method: string, { shouldAuthorize = ShouldAuthorize.No, signal = null, body = null, isContentTypeJson = true } : any)
        : Promise<{ success: boolean, message: string, response: Response }> {
        const headers = new Headers();

        if (shouldAuthorize === ShouldAuthorize.Yes || (shouldAuthorize === ShouldAuthorize.Optional && authService.isSignedIn())) {
            const token = await authService.ensureTokenValid();
            headers.append("Authorization", `Bearer ${token}`);
        }

        if ((method === "POST" || method === "PATCH") && isContentTypeJson) {
            headers.append("Content-Type", "application/json");
        }

        const requestInit = {
            method: method,
            headers: headers,
            signal: signal,
            body: body
        } as RequestInit;

        const response = await fetch(`${this.baseUrl}/${url}`, requestInit);

        return { success: response.ok, message: response.ok ? "" : await response.text(), response: response };
    }
}

const apiService = new ApiService();

export default apiService;