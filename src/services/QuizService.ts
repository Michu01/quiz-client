import Category from "../models/Category";
import Quiz from "../models/Quiz";
import User from "../models/User";

class QuizService {
    private user: User | null = null;

    private port = 7109;
    private baseUrl = `https://localhost:${this.port}/api`;
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

    private async ensureTokenValid() {
        const token = this.getToken();
        const tokenExpirationDate = this.getTokenExpirationTime();

        if (tokenExpirationDate > Date.now() && token != null) {
            return;
        }

        const login = this.getLogin();
        const password = this.getPassword();

        if (login == null || password == null) {
            this.cleanStorage();
            throw new Error('No login or password');
        }

        if ((await this.signIn(login, password)).ok) {
            return;
        }

        this.cleanStorage();
        throw new Error('Invalid login or password');
    }

    isSignedIn = () => this.getLogin() != null && this.getPassword() != null;

    async signUp(name: string, password: string) {
        const requestInit: RequestInit = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, password }) 
        };

        const response = await fetch(this.baseUrl + '/auth/signUp', requestInit);

        if (!response.ok) {
            return response;
        }

        this.setLogin(name);
        this.setPassword(password);

        const token = await response.json();

        this.setToken(token.value);
        this.setTokenExpirationTime(token.expirationTime);

        return response;
    }

    async signIn(name: string, password: string) {
        const requestInit: RequestInit = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, password }) 
        };

        const response = await fetch(this.baseUrl + '/auth/signIn', requestInit);

        if (!response.ok) {
            return response;
        }

        this.setLogin(name);
        this.setPassword(password);

        const token = await response.json();

        this.setToken(token.value);
        this.setTokenExpirationTime(token.expirationTime);

        return response;
    }

    async changePassword(currentPassword: string, newPassword: string) {
        await this.ensureTokenValid();

        const token = this.getToken();

        const requestInit: RequestInit = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        };

        const response = await fetch(this.baseUrl + '/users/me/changePassword', requestInit);

        if (!response.ok) {
            return response;
        }

        this.setPassword(newPassword);

        const newToken = await response.json();

        this.setToken(newToken.value);
        this.setTokenExpirationTime(newToken.expirationTime);

        return response;
    }

    signOut() {
        this.user = null;
        this.cleanStorage();
    }

    async getMe(signal: AbortSignal): Promise<User> {
        if (this.user != null) {
            return this.user;
        }

        await this.ensureTokenValid();

        const token = this.getToken();

        const requestInit: RequestInit = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            signal: signal
        };

        const response = await fetch(this.baseUrl + '/users/me', requestInit);
        const json = await response.json();

        return json as User;
    }

    async getAvatarPath(signal: AbortSignal): Promise<string | null> {
        await this.ensureTokenValid();

        const token = this.getToken();

        const requestInit: RequestInit = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            signal: signal
        };

        const response = await fetch(this.baseUrl + '/userAvatars/path', requestInit);

        return response.ok ? await response.text() : null;
    }

    async changeAvatar(file: File) {
        await this.ensureTokenValid();

        const token = this.getToken();

        const data = new FormData()
        data.append('file', file);

        const requestInit: RequestInit = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: data
        };

        const response = await fetch(this.baseUrl + '/userAvatars/change', requestInit);

        return response;
    }

    async getCategories(signal: AbortSignal | null = null) : Promise<Category[]> {
        const requestInit: RequestInit = {
            method: "GET",
            signal: signal
        };

        const response = await fetch(this.baseUrl + '/questionSetCategories', requestInit);

        const json = await response.json();

        return json as Category[];
    }

    async deleteCategory(id: number) {
        await this.ensureTokenValid();

        const token = this.getToken();

        const requestInit: RequestInit = {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };

        const response = await fetch(this.baseUrl + `/questionSetCategories/${id}`, requestInit);

        return response;
    }

    async getCategory(id: number, signal: AbortSignal) {
        const requestInit: RequestInit = {
            method: "GET",
            signal: signal
        };

        const response = await fetch(this.baseUrl + `/questionSetCategories/${id}`, requestInit);

        const json = await response.json();

        return json as Category;
    }

    async addCategory(name: string) {
        await this.ensureTokenValid();

        const token = this.getToken();

        const requestInit: RequestInit = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        };

        const response = await fetch(this.baseUrl + '/questionSetCategories', requestInit);

        return response;
    }

    async getQuizes(namePattern: string | null, categoryId: string | null, creatorFilter: string | null, signal: AbortSignal) {
        const headers = new Headers();

        if (this.isSignedIn()) {
            await this.ensureTokenValid();
            const token = this.getToken();
            headers.set("Authorization", `Bearer ${token}`);
        }

        const requestInit: RequestInit = {
            method: "GET",
            headers: headers,
            signal: signal
        };

        const response = await fetch(this.baseUrl + `/questionSets?categoryId=${categoryId ?? ''}&namePattern=${namePattern ?? ''}&creatorFilter=${creatorFilter ?? ''}`, requestInit);

        const json = await response.json();

        return json as Quiz[];
    }

    async createQuiz(name: string, description: string, categoryId: string, access: string) {
        await this.ensureTokenValid();

        const token = this.getToken();

        const requestInit: RequestInit = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, description, categoryId, access })
        };

        const response = await fetch(this.baseUrl + '/questionSets', requestInit);

        return response;
    }

    async updateQuiz(id: number, name: string, description: string, categoryId: string, access: string) {
        await this.ensureTokenValid();

        const token = this.getToken();

        const requestInit: RequestInit = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, description, categoryId, access })
        };

        const response = await fetch(this.baseUrl + `/questionSets/${id}`, requestInit);

        return response;
    }

    async getQuiz(id: number, signal: AbortSignal) {
        const headers = new Headers();

        if (this.isSignedIn()) {
            await this.ensureTokenValid();
            const token = this.getToken();
            headers.set("Authorization", `Bearer ${token}`);
        }
         
        const requestInit: RequestInit = {
            method: "GET",
            headers: headers,
            signal: signal
        };

        const response = await fetch(this.baseUrl + `/questionSets/${id}`, requestInit);

        return await response.json() as Quiz;
    }

    async getUser(id: number, signal: AbortSignal) {
        const requestInit: RequestInit = {
            method: "GET",
            signal: signal
        };

        const response = await fetch(this.baseUrl + `/users/${id}`, requestInit);

        return await response.json() as User;
    }

    async deleteQuiz(id: number) {
        await this.ensureTokenValid();

        const token = this.getToken();

        const requestInit: RequestInit = {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };

        const response = await fetch(this.baseUrl + `/questionSets/${id}`, requestInit);

        return response;
    }
}

const quizService = new QuizService();

export default quizService;