import { IAIService, GenerationTask, GenerationConfig, GenerationResult } from '../types';

/**
 * Real AI Service implementation (placeholder for future integration).
 * Replace method bodies with actual API calls when backend is ready.
 */
class RealAIService implements IAIService {
  async generateImage(_prompt: string, _config: GenerationConfig): Promise<GenerationTask> {
    throw new Error('Real AI service not implemented yet. Set VITE_AI_SERVICE_MODE=mock.');
  }

  async generateVideo(_prompt: string, _config: GenerationConfig): Promise<GenerationTask> {
    throw new Error('Real AI service not implemented yet. Set VITE_AI_SERVICE_MODE=mock.');
  }

  async getTaskStatus(_taskId: string): Promise<GenerationTask> {
    throw new Error('Real AI service not implemented yet. Set VITE_AI_SERVICE_MODE=mock.');
  }

  async getTaskResult(_taskId: string): Promise<GenerationResult> {
    throw new Error('Real AI service not implemented yet. Set VITE_AI_SERVICE_MODE=mock.');
  }
}

export default RealAIService;
