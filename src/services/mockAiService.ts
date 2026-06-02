import { IAIService, GenerationTask, GenerationConfig, GenerationResult, GenerationType, GenerationStatus } from '../types';
import { generateId, getImageSizeDimensions, getVideoResolutionDimensions, randomInt, sleep } from '../utils/helpers';
import { MOCK_PROGRESS_STEPS } from '../utils/constants';

/**
 * Mock AI Service that simulates image and video generation with progress updates.
 * Uses picsum.photos for images and canvas-based animation for videos.
 */
class MockAIService implements IAIService {
  /** Active task simulations for progress polling */
  private activeTasks: Map<string, GenerationTask> = new Map();

  /** Start a mock generation with progress simulation */
  private async simulateProgress(task: GenerationTask): Promise<void> {
    const isImage = task.type === GenerationType.TEXT_TO_IMAGE || task.type === GenerationType.IMAGE_TO_IMAGE;
    const delayBase = isImage ? 800 : 1200;

    for (let i = 0; i < MOCK_PROGRESS_STEPS.length; i++) {
      await sleep(delayBase + randomInt(0, 500));

      const currentTask = this.activeTasks.get(task.id);
      if (!currentTask || currentTask.status === GenerationStatus.FAILED) {
        return;
      }

      currentTask.progress = MOCK_PROGRESS_STEPS[i];

      if (i === MOCK_PROGRESS_STEPS.length - 1) {
        currentTask.status = GenerationStatus.COMPLETED;
        currentTask.completedAt = new Date();

        if (isImage) {
          currentTask.results = await this.createMockImageResults(task);
        } else {
          currentTask.results = await this.createMockVideoResults(task);
        }
      } else if (i > 0) {
        currentTask.status = GenerationStatus.PROCESSING;
      }

      this.activeTasks.set(task.id, { ...currentTask });
    }
  }

  /** Create mock image results using picsum.photos */
  private async createMockImageResults(task: GenerationTask): Promise<GenerationResult[]> {
    const size = task.config.imageSize
      ? getImageSizeDimensions(task.config.imageSize)
      : { width: 512, height: 512 };

    const batchSize = task.config.batchSize || 1;
    const results: GenerationResult[] = [];

    for (let i = 0; i < batchSize; i++) {
      const mediaUrl = `https://picsum.photos/${size.width}/${size.height}?random=${Date.now()}_${i}`;

      results.push({
        id: generateId(),
        taskId: task.id,
        mediaType: 'image',
        mediaUrl,
        isFavorited: false,
        tags: [],
        createdAt: new Date(),
      });
    }

    return results;
  }

  /** Create mock video results using canvas animation exported as blob */
  private async createMockVideoResults(task: GenerationTask): Promise<GenerationResult[]> {
    const resolution = task.config.videoResolution
      ? getVideoResolutionDimensions(task.config.videoResolution)
      : { width: 854, height: 480 };

    const batchSize = task.config.batchSize || 1;
    const results: GenerationResult[] = [];

    for (let i = 0; i < batchSize; i++) {
      const blob = await this.createMockVideoBlob(resolution.width, resolution.height, task.prompt);
      const mediaUrl = URL.createObjectURL(blob);

      results.push({
        id: generateId(),
        taskId: task.id,
        mediaType: 'video',
        mediaUrl,
        mediaBlob: blob,
        isFavorited: false,
        tags: [],
        createdAt: new Date(),
      });
    }

    return results;
  }

  /** Create a simple canvas animation video blob */
  private async createMockVideoBlob(width: number, height: number, prompt: string): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(width, 480);
    canvas.height = Math.min(height, 270);
    const ctx = canvas.getContext('2d')!;

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];

    return new Promise<Blob>((resolve) => {
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };

      recorder.start();

      const totalFrames = 90; // 3 seconds at 30fps
      let frame = 0;

      const drawFrame = (): void => {
        if (frame >= totalFrames) {
          recorder.stop();
          return;
        }

        const progress = frame / totalFrames;

        // Background gradient animation
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const hue1 = (progress * 120 + 200) % 360;
        const hue2 = (progress * 120 + 260) % 360;
        gradient.addColorStop(0, `hsl(${hue1}, 70%, 60%)`);
        gradient.addColorStop(1, `hsl(${hue2}, 70%, 40%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Animated circles
        for (let i = 0; i < 5; i++) {
          const x = canvas.width * (0.2 + 0.6 * Math.sin(progress * Math.PI * 2 + i));
          const y = canvas.height * (0.2 + 0.6 * Math.cos(progress * Math.PI * 2 + i * 0.7));
          const radius = 15 + 10 * Math.sin(progress * Math.PI * 4 + i);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${(hue1 + i * 30) % 360}, 80%, 70%, 0.6)`;
          ctx.fill();
        }

        // Prompt text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 16px "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const displayText = prompt.length > 20 ? prompt.slice(0, 20) + '...' : prompt;
        ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);

        // Progress indicator
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px sans-serif';
        ctx.fillText(`AI 生成中... ${Math.round(progress * 100)}%`, canvas.width / 2, canvas.height - 20);

        frame++;
        requestAnimationFrame(drawFrame);
      };

      drawFrame();
    });
  }

  /** Generate a mock image */
  async generateImage(prompt: string, config: GenerationConfig): Promise<GenerationTask> {
    const task: GenerationTask = {
      id: generateId(),
      userId: 'mock-user',
      type: config.referenceImageUrl ? GenerationType.IMAGE_TO_IMAGE : GenerationType.TEXT_TO_IMAGE,
      status: GenerationStatus.PENDING,
      prompt,
      config,
      results: [],
      progress: 0,
      createdAt: new Date(),
    };

    this.activeTasks.set(task.id, { ...task });

    // Start progress simulation in background
    this.simulateProgress(task);

    return task;
  }

  /** Generate a mock video */
  async generateVideo(prompt: string, config: GenerationConfig): Promise<GenerationTask> {
    const task: GenerationTask = {
      id: generateId(),
      userId: 'mock-user',
      type: config.referenceImageUrl ? GenerationType.IMAGE_TO_VIDEO : GenerationType.TEXT_TO_VIDEO,
      status: GenerationStatus.PENDING,
      prompt,
      config,
      results: [],
      progress: 0,
      createdAt: new Date(),
    };

    this.activeTasks.set(task.id, { ...task });

    // Start progress simulation in background
    this.simulateProgress(task);

    return task;
  }

  /** Get current task status (for polling) */
  async getTaskStatus(taskId: string): Promise<GenerationTask> {
    const task = this.activeTasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    return { ...task };
  }

  /** Get task result */
  async getTaskResult(taskId: string): Promise<GenerationResult> {
    const task = this.activeTasks.get(taskId);
    if (!task || task.results.length === 0) {
      throw new Error(`Result for task ${taskId} not found`);
    }
    return { ...task.results[0] };
  }
}

export default MockAIService;

/** Factory function to create the appropriate AI service based on env config */
export function createAIService(): IAIService {
  const mode = import.meta.env.VITE_AI_SERVICE_MODE || 'mock';
  if (mode === 'real') {
    // Dynamic import for real service - will throw at runtime if not implemented
    throw new Error('Real AI service not implemented yet. Set VITE_AI_SERVICE_MODE=mock.');
  }
  return new MockAIService();
}
