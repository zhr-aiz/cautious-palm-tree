import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';
import {
  GenerationType,
  GenerationStatus,
  ImageSize,
  VideoResolution,
} from '../types';
import {
  GENERATION_TYPE_LABELS,
  IMAGE_SIZE_OPTIONS,
  VIDEO_RESOLUTION_OPTIONS,
} from './constants';

/** Generate a new UUID */
export function generateId(): string {
  return uuidv4();
}

/** Format date to readable string */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'yyyy-MM-dd HH:mm', { locale: zhCN });
}

/** Format date as relative time */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: zhCN });
}

/** Get generation type label */
export function getGenerationTypeLabel(type: GenerationType): string {
  return GENERATION_TYPE_LABELS[type] || type;
}

/** Get image size dimensions */
export function getImageSizeDimensions(size: ImageSize): { width: number; height: number } {
  const option = IMAGE_SIZE_OPTIONS[size];
  return option ? { width: option.width, height: option.height } : { width: 512, height: 512 };
}

/** Get video resolution dimensions */
export function getVideoResolutionDimensions(resolution: VideoResolution): { width: number; height: number } {
  const option = VIDEO_RESOLUTION_OPTIONS[resolution];
  return option ? { width: option.width, height: option.height } : { width: 854, height: 480 };
}

/** Get status color for MUI */
export function getStatusColor(status: GenerationStatus): 'default' | 'primary' | 'success' | 'error' | 'warning' {
  switch (status) {
    case GenerationStatus.PENDING:
      return 'default';
    case GenerationStatus.PROCESSING:
      return 'primary';
    case GenerationStatus.COMPLETED:
      return 'success';
    case GenerationStatus.FAILED:
      return 'error';
    default:
      return 'default';
  }
}

/** Get status label */
export function getStatusLabel(status: GenerationStatus): string {
  switch (status) {
    case GenerationStatus.PENDING:
      return '等待中';
    case GenerationStatus.PROCESSING:
      return '生成中';
    case GenerationStatus.COMPLETED:
      return '已完成';
    case GenerationStatus.FAILED:
      return '失败';
    default:
      return '未知';
  }
}

/** Sleep for a given number of milliseconds */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Random integer between min and max (inclusive) */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Truncate text to a max length with ellipsis */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/** Check if the viewport is mobile (width < 600px) */
export function isMobileViewport(): boolean {
  return window.innerWidth < 600;
}
