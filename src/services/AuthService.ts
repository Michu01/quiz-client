import ShouldAuthorize from "../enums/ShouldAuthorize";
import Token from "../models/Token";
import apiService from "./ApiService";

class AuthService {
    private baseUrl = 'auth';
    private keyBase = 'quizApi';
    private loginKey = `${this.keyBase}Login`;
    private passwordKey = `${this.keyBase}Password`;
    private tokenKey = `${this.keyBase}Token`;
    private tokenExpirationTimeKey = `${this.keyBase}TokenExpirationTime`;

    private getLogin = () => localStorage.getItem(this.loginKey);
    private setLogin = (value: string) => localStorage.setItem(this.loginKey, value);
    private getPassword = () => localStorage.getItem(this.passwordKey);
    private setPassword = (value: string) => localStorage.setItem(this.passwordKey, value);
    private getToken = () => localStorage.getItem(this.tokenKey);
    private setToken = (value: string) => localStorage.setItem(this.tokenKey, value);
    private getTokenExpirationTime = () => Date.parse(localStorage.getItem(this.tokenExpirationTimeKey) ?? '');
    private setTokenExpirationTime = (value: number) => localStorage.setItem(this.tokenExpirationTimeKey, value.toString());

    private cleanStorage() {
        localStorage.removeItem(this.loginKey);
        localStorage.removeItem(this.passwordKey);
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.tokenExpirationTimeKey);
    }

    async ensureTokenValid(): Promise<string> {
        const token = this.getToken();
        const tokenExpirationDate = this.getTokenExpirationTime();

        if (tokenExpirationDate > Date.now() && token != null) {
            return token;
        }

        const login = this.getLogin();
        const password = this.getPassword();

        if (login == null || password == null) {
            this.cleanStorage();

            throw new Error('No login or password');
        }

        const response = await this.signIn(login, password);

        if (response.success) {
            const token = this.getToken();
            if (token != null) {
                return token;
            }
        }

        this.cleanStorage();

        throw new Error('Invalid login or password');
    }

    isSignedIn = () => this.getLogin() != null && this.getPassword() != null;

    signOut() {
        this.cleanStorage();
    }
    
    async signUp(name: string, password: string): Promise<{ success: boolean, message: string }> {
        const body = JSON.stringify({ name, password });

        const { success, message, response } = await apiService.post(`${this.baseUrl}/signUp`, { body });

        if (!success) {
            return { success, message };
        }

        this.setLogin(name);
        this.setPassword(password);

        const token = await response.json() as Token;

        this.setToken(token.value);
        this.setTokenExpirationTime(token.expirationTime);

        return { success, message };
    }

    async signIn(name: string, password: string): Promise<{ success: boolean, message: string }> {
        const body = JSON.stringify({ name, password });

        const { success, message, response } = await apiService.post(`${this.baseUrl}/signIn`, { body });

        if (!success) {
            return { success, message };
        }

        this.setLogin(name);
        this.setPassword(password);

        const token = await response.json() as Token;

        this.setToken(token.value);
        this.setTokenExpirationTime(token.expirationTime);

        return { success, message };
    }

    async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean, message: string }> {
        const body = JSON.stringify({ currentPassword, newPassword });

        const { success, message, response } = await apiService.post(`${this.baseUrl}/changePassword`, { body, shouldAuthorize: ShouldAuthorize.Yes });

        if (!success) {
            return { success, message };
        }

        this.setPassword(newPassword);

        const token = await response.json() as Token;

        this.setToken(token.value);
        this.setTokenExpirationTime(token.expirationTime);

        return { success, message };
    }

    async changeUsername(name: string, password: string): Promise<{ success: boolean, message: string }> {
        const body = JSON.stringify({ name, password });

        const { success, message, response } = await apiService.post(`${this.baseUrl}/changeUsername`, { body, shouldAuthorize: ShouldAuthorize.Yes });

        if (!success) {
            return { success, message };
        }

        this.setLogin(name);

        const token = await response.json() as Token;

        this.setToken(token.value);
        this.setTokenExpirationTime(token.expirationTime);

        return { success, message };
    }
}

const authService = new AuthService();

export default authService;