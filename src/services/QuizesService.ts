import Answer from "../enums/Answer";
import ShouldAuthorize from "../enums/ShouldAuthorize";
import Question from "../models/Question";
import Quiz from "../models/Quiz";
import apiService from "./ApiService";

class QuizesService {
    private baseUrl = 'quizes';

    async get(namePattern: string | null, categoryId: string | null, creatorId: string | null, creatorFilter: string | null, signal: AbortSignal) 
        : Promise<{ success: boolean, message: string, quizes: Quiz[] }> {
        const url = `${this.baseUrl}?namePattern=${namePattern ?? ''}&categoryId=${categoryId ?? ''}&creatorId=${creatorId ?? ''}&creatorFilter=${creatorFilter ?? ''}`;

        const { success, message, response } = await apiService.get(url, { signal, shouldAuthorize: ShouldAuthorize.Optional });

        return { success, message, quizes: success ? await response.json() : [] };
    }

    async find(id: number, signal: AbortSignal): Promise<{ success: boolean, message: string, quiz: Quiz | null }> {
        const { success, message, response } = await apiService.get(`${this.baseUrl}/${id}`, { signal, shouldAuthorize: ShouldAuthorize.Optional });

        return { success, message, quiz: success ? await response.json() : null };
    }

    async create(name: string, description: string, categoryId: string, access: string): Promise<{ success: boolean, message: string, quiz: Quiz | null }> {
        const body = JSON.stringify({ name, description, categoryId, access });

        const { success, message, response } = await apiService.post(`${this.baseUrl}`, { shouldAuthorize: ShouldAuthorize.Yes, body });

        return { success, message, quiz: success ? await response.json() : null };
    }

    async update(id: number, name: string, description: string, categoryId: string, access: string): Promise<{ success: boolean, message: string, quiz: Quiz | null }> {
        const body = JSON.stringify({ name, description, categoryId, access });

        const { success, message, response } = await apiService.patch(`${this.baseUrl}/${id}`, { shouldAuthorize: ShouldAuthorize.Yes, body });

        return { success, message, quiz: success ? await response.json() : null };
    }

    async delete(id: number): Promise<{ success: boolean, message: string }> {
        const { success, message } = await apiService.delete(`${this.baseUrl}/${id}`, { shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message };
    }

    async getQuestions(quizId: number, signal: AbortSignal) 
        : Promise<{ success: boolean, message: string, questions: Question[] }> {
        const { success, message, response } = await apiService.get(`${this.baseUrl}/${quizId}/questions`, { signal, shouldAuthorize: ShouldAuthorize.Optional });

        return { success, message, questions: success ? await response.json() : [] };
    }

    async createQuestion(quizId: number, contents: string, answerA: string, answerB: string, answerC: string, answerD: string, correctAnswer: Answer) 
        : Promise<{ success: boolean, message: string, question: Question | null }> {
        const body = JSON.stringify({ contents, answerA, answerB, answerC, answerD, correctAnswer });

        const { success, message, response }= await apiService.post(`${this.baseUrl}/${quizId}/questions`, { body, shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message, question: success ? await response.json() : null };
    }
}

const quizesService = new QuizesService();

export default quizesService;