/** App-wide constants */

import {
  MembershipTier,
  TemplateCategory,
  PromptTemplate,
} from '../types';

/** Maximum number of history records */
export const MAX_HISTORY_RECORDS = 200;

/** Maximum number of favorites */
export const MAX_FAVORITES = 50;

/** Default generation config */
export const DEFAULT_GENERATION_CONFIG = {
  style: 'realistic',
  creativity: 0.7,
  steps: 30,
};

/** Mock service delay range (ms) */
export const MOCK_DELAY_MIN = 2000;
export const MOCK_DELAY_MAX = 5000;

/** Mock progress steps */
export const MOCK_PROGRESS_STEPS = [0, 20, 50, 80, 100];

/** Generation type labels */
export const GENERATION_TYPE_LABELS: Record<string, string> = {
  TEXT_TO_IMAGE: '文生图',
  TEXT_TO_VIDEO: '文生视频',
  IMAGE_TO_IMAGE: '图生图',
  IMAGE_TO_VIDEO: '图生视频',
};

/** Image size labels and dimensions */
export const IMAGE_SIZE_OPTIONS: Record<string, { label: string; width: number; height: number }> = {
  SQUARE_1_1: { label: '1:1 正方形', width: 512, height: 512 },
  LANDSCAPE_16_9: { label: '16:9 横屏', width: 768, height: 432 },
  PORTRAIT_9_16: { label: '9:16 竖屏', width: 432, height: 768 },
};

/** Video resolution labels */
export const VIDEO_RESOLUTION_OPTIONS: Record<string, { label: string; width: number; height: number }> = {
  SD_480P: { label: '480P', width: 854, height: 480 },
  HD_720P: { label: '720P', width: 1280, height: 720 },
  FHD_1080P: { label: '1080P', width: 1920, height: 1080 },
};

/** Style options */
export const STYLE_OPTIONS = [
  { id: 'realistic', label: '写实', preview: '📷' },
  { id: 'anime', label: '动漫', preview: '🎨' },
  { id: 'oil-painting', label: '油画', preview: '🖼️' },
  { id: 'watercolor', label: '水彩', preview: '💧' },
  { id: 'cyberpunk', label: '赛博朋克', preview: '🌃' },
  { id: 'sketch', label: '素描', preview: '✏️' },
  { id: '3d-render', label: '3D渲染', preview: '🎮' },
  { id: 'pixel-art', label: '像素风', preview: '👾' },
];

/** Route paths */
export const ROUTES = {
  AUTH: '/auth',
  HOME: '/',
  RESULT: '/result/:taskId',
  HISTORY: '/history',
  SETTINGS: '/settings',
  MEMBERSHIP: '/membership',
  CREDITS: '/membership/credits',
  CHECKOUT: '/membership/checkout',
  GALLERY: '/gallery',
} as const;

/** LocalStorage keys */
export const STORAGE_KEYS = {
  AUTH_USER: 'ai_media_auth_user',
  AUTH_TOKEN: 'ai_media_auth_token',
  GENERATION_TASKS: 'ai_media_generation_tasks',
  HISTORY_FILTER: 'ai_media_history_filter',
  MEMBERSHIP: 'ai_media_membership',
} as const;

/** IndexedDB key prefix for media blobs */
export const IDB_MEDIA_PREFIX = 'media_blob_';

/** Tier quota configuration */
export const TIER_QUOTAS: Record<MembershipTier, {
  dailyImage: number;
  dailyVideo: number;
  credits: number;
  features: string[];
  batchSizeOptions: number[];
  maxVideoDuration: number;
  customTags: boolean;
  negativePrompt: boolean;
  seed: boolean;
}> = {
  [MembershipTier.FREE]: {
    dailyImage: 5,
    dailyVideo: 2,
    credits: 0,
    features: ['text_to_image', 'text_to_video'],
    batchSizeOptions: [1],
    maxVideoDuration: 3,
    customTags: false,
    negativePrompt: false,
    seed: false,
  },
  [MembershipTier.PRO]: {
    dailyImage: 50,
    dailyVideo: 20,
    credits: 100,
    features: ['text_to_image', 'text_to_video', 'image_to_image', 'image_to_video', 'negative_prompt', 'batch_generate', 'custom_tags'],
    batchSizeOptions: [1, 2, 4],
    maxVideoDuration: 5,
    customTags: true,
    negativePrompt: true,
    seed: false,
  },
  [MembershipTier.ENTERPRISE]: {
    dailyImage: 999,
    dailyVideo: 999,
    credits: 500,
    features: ['text_to_image', 'text_to_video', 'image_to_image', 'image_to_video', 'negative_prompt', 'batch_generate', 'custom_tags', 'seed', 'priority_queue'],
    batchSizeOptions: [1, 2, 4, 8],
    maxVideoDuration: 10,
    customTags: true,
    negativePrompt: true,
    seed: true,
  },
};

/** Prompt templates data (6 categories, 24 templates) */
export const PROMPT_TEMPLATES: PromptTemplate[] = [
  // Portrait (4)
  { id: 'pt-portrait-1', category: TemplateCategory.PORTRAIT, title: '古典人像', prompt: '一位优雅的女性，穿着传统汉服，背景是古典园林，柔和的自然光，细腻的皮肤质感', preview: '👩', isCustom: false, tierRequired: MembershipTier.FREE },
  { id: 'pt-portrait-2', category: TemplateCategory.PORTRAIT, title: '赛博人像', prompt: '未来感赛博朋克风格的人像，霓虹灯光反射在脸上，金属质感配饰，深色背景', preview: '🤖', isCustom: false, tierRequired: MembershipTier.PRO },
  { id: 'pt-portrait-3', category: TemplateCategory.PORTRAIT, title: '油画人像', prompt: '古典油画风格的人物肖像，伦勃朗式光影，深色背景，质感丰富，大师级画技', preview: '🎨', isCustom: false, tierRequired: MembershipTier.FREE },
  { id: 'pt-portrait-4', category: TemplateCategory.PORTRAIT, title: '梦幻人像', prompt: '梦幻柔光人像，背景是星空和极光，头发飘散着光粒子，空灵唯美', preview: '✨', isCustom: false, tierRequired: MembershipTier.ENTERPRISE },
  // Landscape (4)
  { id: 'pt-landscape-1', category: TemplateCategory.LANDSCAPE, title: '日出山景', prompt: '壮丽的日出山景，金色阳光洒在雪山之巅，云海翻涌，超高清细节', preview: '🏔️', isCustom: false, tierRequired: MembershipTier.FREE },
  { id: 'pt-landscape-2', category: TemplateCategory.LANDSCAPE, title: '水下世界', prompt: '神秘的海底世界，珊瑚礁群，热带鱼群，阳光穿透水面，蔚蓝色彩', preview: '🐠', isCustom: false, tierRequired: MembershipTier.PRO },
  { id: 'pt-landscape-3', category: TemplateCategory.LANDSCAPE, title: '城市天际线', prompt: '现代城市天际线夜景，璀璨灯光，江面倒影，摩天大楼，电影级构图', preview: '🏙️', isCustom: false, tierRequired: MembershipTier.FREE },
  { id: 'pt-landscape-4', category: TemplateCategory.LANDSCAPE, title: '外星风景', prompt: '外星星球表面风景，紫色天空双月，奇特岩石地貌，科幻感十足', preview: '🪐', isCustom: false, tierRequired: MembershipTier.ENTERPRISE },
  // Animal (4)
  { id: 'pt-animal-1', category: TemplateCategory.ANIMAL, title: '萌宠写真', prompt: '一只可爱的橘猫，慵懒地躺在窗台上，午后阳光，柔和焦外虚化', preview: '🐱', isCustom: false, tierRequired: MembershipTier.FREE },
  { id: 'pt-animal-2', category: TemplateCategory.ANIMAL, title: '野生世界', prompt: '非洲大草原上的雄狮，黄昏金色光线，壮丽自然，国家地理风格', preview: '🦁', isCustom: false, tierRequired: MembershipTier.PRO },
  { id: 'pt-animal-3', category: TemplateCategory.ANIMAL, title: '奇幻生物', prompt: '一只由水晶构成的独角兽，彩虹光芒环绕，梦幻森林背景', preview: '🦄', isCustom: false, tierRequired: MembershipTier.FREE },
  { id: 'pt-animal-4', category: TemplateCategory.ANIMAL, title: '微观世界', prompt: '微距摄影下的蝴蝶翅膀，极致细节，彩虹色鳞片，自然之美', preview: '🦋', isCustom: false, tierRequired: MembershipTier.ENTERPRISE },
  // Abstract (4)
  { id: 'pt-abstract-1', category: TemplateCategory.ABSTRACT, title: '流体艺术', prompt: '流体艺术，绚丽色彩交织，金色与深蓝色碰撞，抽象流动感，4K质感', preview: '🌊', isCustom: false, tierRequired: MembershipTier.FREE },
  { id: 'pt-abstract-2', category: TemplateCategory.ABSTRACT, title: '几何幻想', prompt: '精密的几何图案，分形结构，无限递归，数学之美，冷色调', preview: '💎', isCustom: false, tierRequired: MembershipTier.PRO },
  { id: 'pt-abstract-3', category: TemplateCategory.ABSTRACT, title: '光影交织', prompt: '光与影的抽象舞蹈，光束穿过棱镜，折射彩虹，暗室背景', preview: '🌈', isCustom: false, tierRequired: MembershipTier.FREE },
  { id: 'pt-abstract-4', category: TemplateCategory.ABSTRACT, title: '数字混沌', prompt: '数字故障艺术，数据流的视觉化呈现，像素扭曲，RGB偏移效果', preview: '📺', isCustom: false, tierRequired: MembershipTier.ENTERPRISE },
  // Architecture (4)
  { id: 'pt-arch-1', category: TemplateCategory.ARCHITECTURE, title: '未来建筑', prompt: '未来主义建筑，流线型白色结构，空中花园，玻璃幕墙反射天空', preview: '🏛️', isCustom: false, tierRequired: MembershipTier.FREE },
  { id: 'pt-arch-2', category: TemplateCategory.ARCHITECTURE, title: '古城小巷', prompt: '欧洲古城的小巷，石板路，老旧的木门和花盆，暖色调胶片质感', preview: '🏘️', isCustom: false, tierRequired: MembershipTier.PRO },
  { id: 'pt-arch-3', category: TemplateCategory.ARCHITECTURE, title: '室内设计', prompt: '现代极简室内设计，落地窗，北欧风格家具，自然光线，温馨氛围', preview: '🏠', isCustom: false, tierRequired: MembershipTier.FREE },
  { id: 'pt-arch-4', category: TemplateCategory.ARCHITECTURE, title: '废墟美学', prompt: '被自然重新占领的废弃建筑，藤蔓缠绕，光线穿透破碎的天花板', preview: '🏚️', isCustom: false, tierRequired: MembershipTier.ENTERPRISE },
  // Creative (4)
  { id: 'pt-creative-1', category: TemplateCategory.CREATIVE, title: '蒸汽朋克', prompt: '蒸汽朋克风格的飞艇，黄铜齿轮，蒸汽动力，维多利亚时代美学', preview: '⚙️', isCustom: false, tierRequired: MembershipTier.FREE },
  { id: 'pt-creative-2', category: TemplateCategory.CREATIVE, title: '微缩世界', prompt: '微缩世界，小人在巨大的咖啡杯上生活，移轴摄影效果，趣味构图', preview: '☕', isCustom: false, tierRequired: MembershipTier.PRO },
  { id: 'pt-creative-3', category: TemplateCategory.CREATIVE, title: '水墨丹青', prompt: '中国水墨画风格，山水之间，留白意境，笔墨韵味，意境悠远', preview: '🖌️', isCustom: false, tierRequired: MembershipTier.FREE },
  { id: 'pt-creative-4', category: TemplateCategory.CREATIVE, title: '时间静止', prompt: '时间静止的瞬间，水滴悬停空中，爆炸碎片定格，超现实慢动作', preview: '⏳', isCustom: false, tierRequired: MembershipTier.ENTERPRISE },
];

/** Credit packages */
export const CREDIT_PACKAGES = [
  { id: 'credits-100', name: '100 积分', credits: 100, price: 9.9, bonus: 0, popular: false },
  { id: 'credits-300', name: '300 积分', credits: 300, price: 25.9, bonus: 15, popular: false },
  { id: 'credits-500', name: '500 积分', credits: 500, price: 39.9, bonus: 50, popular: true },
  { id: 'credits-1000', name: '1000 积分', credits: 1000, price: 69.9, bonus: 150, popular: false },
];

/** Template category labels */
export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  [TemplateCategory.PORTRAIT]: '人像',
  [TemplateCategory.LANDSCAPE]: '风景',
  [TemplateCategory.ANIMAL]: '动物',
  [TemplateCategory.ABSTRACT]: '抽象',
  [TemplateCategory.ARCHITECTURE]: '建筑',
  [TemplateCategory.CREATIVE]: '创意',
};

/** Batch size options by tier */
export const BATCH_SIZE_OPTIONS: Record<MembershipTier, number[]> = {
  [MembershipTier.FREE]: [1],
  [MembershipTier.PRO]: [1, 2, 4],
  [MembershipTier.ENTERPRISE]: [1, 2, 4, 8],
};
