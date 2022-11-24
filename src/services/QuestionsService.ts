import Answer from "../enums/Answer";
import ShouldAuthorize from "../enums/ShouldAuthorize";
import Question from "../models/Question";
import apiService from "./ApiService";

class QuestionsService {
    private baseUrl = 'questions';

    async get(id: number): Promise<{ success: boolean, message: string, question: Question | null }> {
        const { success, message, response } = await apiService.get(`${this.baseUrl}/${id}`, { shouldAuthorize: ShouldAuthorize.Optional });

        return { success, message, question: success ? await response.json() : null };
    }

    async update(id: number, contents: string, answerA: string, answerB: string, answerC: string, answerD: string, correctAnswer: Answer): Promise<{ success: boolean, message: string, question: Question | null }> {
        const body = JSON.stringify({ contents, answerA, answerB, answerC, answerD, correctAnswer });

        const { success, message, response } = await apiService.patch(`${this.baseUrl}/${id}`, { body, shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message, question: success ? await response.json() : null };
    }

    async delete(id: number): Promise<{ success: boolean, message: string }> {
        const { success, message } = await apiService.delete(`${this.baseUrl}/${id}`, { shouldAuthorize: ShouldAuthorize.Yes });

        return { success, message };
    } 
}

const questionsService = new QuestionsService();

export default questionsService;