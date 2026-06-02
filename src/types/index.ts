/** Type definitions for AI Media Creator App */

/** Generation type enum */
export enum GenerationType {
  TEXT_TO_IMAGE = 'TEXT_TO_IMAGE',
  TEXT_TO_VIDEO = 'TEXT_TO_VIDEO',
  IMAGE_TO_IMAGE = 'IMAGE_TO_IMAGE',
  IMAGE_TO_VIDEO = 'IMAGE_TO_VIDEO',
}

/** Generation status enum */
export enum GenerationStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/** Image size enum */
export enum ImageSize {
  SQUARE_1_1 = 'SQUARE_1_1',
  LANDSCAPE_16_9 = 'LANDSCAPE_16_9',
  PORTRAIT_9_16 = 'PORTRAIT_9_16',
}

/** Video resolution enum */
export enum VideoResolution {
  SD_480P = 'SD_480P',
  HD_720P = 'HD_720P',
  FHD_1080P = 'FHD_1080P',
}

/** Membership tier enum */
export enum MembershipTier {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

/** Plan type enum */
export enum PlanType {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

/** Video duration enum (seconds) */
export enum VideoDuration {
  SEC_3 = 3,
  SEC_5 = 5,
  SEC_10 = 10,
}

/** Template category enum */
export enum TemplateCategory {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
  ANIMAL = 'animal',
  ABSTRACT = 'abstract',
  ARCHITECTURE = 'architecture',
  CREATIVE = 'creative',
}

/** User model */
export interface User {
  id: string;
  email: string;
  phone: string;
  nickname: string;
  avatarUrl: string;
  createdAt: Date;
  tier?: MembershipTier;
}

/** Generation configuration */
export interface GenerationConfig {
  imageSize?: ImageSize;
  videoResolution?: VideoResolution;
  style: string;
  creativity: number;
  steps: number;
  referenceImageUrl?: string;
  referenceStrength?: number;
  negativePrompt?: string;
  seed?: number;
  videoDuration?: VideoDuration;
  batchSize?: number;
}

/** Generation result */
export interface GenerationResult {
  id: string;
  taskId: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  mediaBlob?: Blob;
  isFavorited: boolean;
  tags: string[];
  createdAt: Date;
  isShared?: boolean;
  shareId?: string;
  likeCount?: number;
}

/** Generation task */
export interface GenerationTask {
  id: string;
  userId: string;
  type: GenerationType;
  status: GenerationStatus;
  prompt: string;
  config: GenerationConfig;
  results: GenerationResult[];
  progress: number;
  createdAt: Date;
  completedAt?: Date;
}

/** AI Service interface */
export interface IAIService {
  generateImage(prompt: string, config: GenerationConfig): Promise<GenerationTask>;
  generateVideo(prompt: string, config: GenerationConfig): Promise<GenerationTask>;
  getTaskStatus(taskId: string): Promise<GenerationTask>;
  getTaskResult(taskId: string): Promise<GenerationResult>;
}

/** Auth form data */
export interface AuthFormData {
  email: string;
  password: string;
  phone?: string;
  nickname?: string;
}

/** History filter */
export interface HistoryFilter {
  type?: GenerationType;
  status?: GenerationStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
  keyword?: string;
  tags?: string[];
  favoritesOnly?: boolean;
}

/** Style option */
export interface StyleOption {
  id: string;
  label: string;
  preview: string;
}

/** Quota item */
export interface QuotaItem {
  used: number;
  total: number;
  resetAt: string;
}

/** Daily quota */
export interface DailyQuota {
  image: QuotaItem;
  video: QuotaItem;
}

/** Credit info */
export interface CreditInfo {
  balance: number;
  expiringAt?: string;
}

/** Subscription info */
export interface Subscription {
  plan: PlanType;
  startedAt: string;
  expiresAt: string;
  autoRenew: boolean;
}

/** Quota state */
export interface QuotaState {
  daily: DailyQuota;
  credits: CreditInfo;
  tier: MembershipTier;
  subscription?: Subscription;
}

/** Prompt template */
export interface PromptTemplate {
  id: string;
  category: TemplateCategory;
  title: string;
  prompt: string;
  preview: string;
  isCustom: boolean;
  tierRequired: MembershipTier;
}

/** Gallery item */
export interface GalleryItem {
  id: string;
  resultId: string;
  userId: string;
  userNickname: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  prompt: string;
  likeCount: number;
  isLikedByMe: boolean;
  sharedAt: string;
}

/** Batch config */
export interface BatchConfig {
  batchSize: number;
  batchSizeOptions: number[];
}

/** Quota check result */
export interface QuotaCheckResult {
  allowed: boolean;
  reason?: 'daily_exhausted' | 'tier_restricted' | 'credits_insufficient';
  suggestion?: string;
}
