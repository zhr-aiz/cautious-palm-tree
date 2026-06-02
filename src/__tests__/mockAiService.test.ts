import { describe, it, expect, vi, beforeEach } from 'vitest';
import MockAIService from '../services/mockAiService';
import { GenerationType, GenerationStatus, ImageSize, VideoResolution } from '../types';

describe('mockAiService', () => {
  let service: MockAIService;

  beforeEach(() => {
    service = new MockAIService();
  });

  describe('generateImage', () => {
    it('应返回 GenerationTask 对象', async () => {
      const task = await service.generateImage('一只猫', {
        style: 'realistic',
        creativity: 0.7,
        steps: 30,
        imageSize: ImageSize.SQUARE_1_1,
      });

      expect(task).toBeDefined();
      expect(task.id).toBeTruthy();
      expect(task.prompt).toBe('一只猫');
    });

    it('初始状态应为 PENDING', async () => {
      const task = await service.generateImage('test', {
        style: 'realistic',
        creativity: 0.7,
        steps: 30,
      });

      expect(task.status).toBe(GenerationStatus.PENDING);
    });

    it('初始进度应为 0', async () => {
      const task = await service.generateImage('test', {
        style: 'realistic',
        creativity: 0.7,
        steps: 30,
      });

      expect(task.progress).toBe(0);
    });

    it('结果列表初始应为空', async () => {
      const task = await service.generateImage('test', {
        style: 'realistic',
        creativity: 0.7,
        steps: 30,
      });

      expect(task.results).toEqual([]);
    });

    it('有参考图时应为 IMAGE_TO_IMAGE 类型', async () => {
      const task = await service.generateImage('test', {
        style: 'realistic',
        creativity: 0.7,
        steps: 30,
        referenceImageUrl: 'https://example.com/ref.jpg',
      });

      expect(task.type).toBe(GenerationType.IMAGE_TO_IMAGE);
    });

    it('无参考图时应为 TEXT_TO_IMAGE 类型', async () => {
      const task = await service.generateImage('test', {
        style: 'realistic',
        creativity: 0.7,
        steps: 30,
      });

      expect(task.type).toBe(GenerationType.TEXT_TO_IMAGE);
    });
  });

  describe('generateVideo', () => {
    it('应返回 GenerationTask 对象', async () => {
      const task = await service.generateVideo('一段日落视频', {
        style: 'realistic',
        creativity: 0.7,
        steps: 30,
        videoResolution: VideoResolution.HD_720P,
      });

      expect(task).toBeDefined();
      expect(task.prompt).toBe('一段日落视频');
    });

    it('初始状态应为 PENDING', async () => {
      const task = await service.generateVideo('test', {
        style: 'realistic',
        creativity: 0.7,
        steps: 30,
      });

      expect(task.status).toBe(GenerationStatus.PENDING);
    });

    it('无参考图时应为 TEXT_TO_VIDEO 类型', async () => {
      const task = await service.generateVideo('test', {
        style: 'realistic',
        creativity: 0.7,
        steps: 30,
      });

      expect(task.type).toBe(GenerationType.TEXT_TO_VIDEO);
    });

    it('有参考图时应为 IMAGE_TO_VIDEO 类型', async () => {
      const task = await service.generateVideo('test', {
        style: 'realistic',
        creativity: 0.7,
        steps: 30,
        referenceImageUrl: 'https://example.com/ref.jpg',
      });

      expect(task.type).toBe(GenerationType.IMAGE_TO_VIDEO);
    });
  });

  describe('getTaskStatus', () => {
    it('应能查询已创建任务的状态', async () => {
      const task = await service.generateImage('test', {
        style: 'realistic',
        creativity: 0.7,
        steps: 30,
      });

      const status = await service.getTaskStatus(task.id);
      expect(status).toBeDefined();
      expect(status.id).toBe(task.id);
    });

    it('查询不存在的任务应抛出错误', async () => {
      await expect(service.getTaskStatus('non-existent')).rejects.toThrow('not found');
    });
  });

  describe('getTaskResult', () => {
    it('查询不存在的任务结果应抛出错误', async () => {
      await expect(service.getTaskResult('non-existent')).rejects.toThrow('not found');
    });

    it('任务完成前查询结果应抛出错误', async () => {
      const task = await service.generateImage('test', {
        style: 'realistic',
        creativity: 0.7,
        steps: 30,
      });

      await expect(service.getTaskResult(task.id)).rejects.toThrow('not found');
    });
  });
});
