export type GenerationStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type AssetType =
  | 'banner'
  | 'logo'
  | 'watermark'
  | 'thumbnail'
  | 'color_palette'
  | 'typography_sheet'
  | 'outro'
  | 'brand_guidelines';

export type SubscriptionPlan = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';

export type SubscriptionStatus = 'ACTIVE' | 'TRIALING' | 'CANCELED' | 'PAST_DUE' | 'INCOMPLETE';

export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded';

export interface UserDoc {
  id: string;
  email: string | null;
  name?: string | null;
  image?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ProjectDoc {
  id: string;
  userId?: string | null;
  title: string;
  description?: string | null;
  targetNiche: string;
  isDemo: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ChannelProfileDoc {
  id: string;
  projectId: string;
  primaryNiche: string;
  subNiches: string[];
  targetAudience: string;
  valueProposition: string;
  toneOfVoice: string;
  contentPillars: string[];
  uploadSchedule?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ChannelNameDoc {
  id: string;
  projectId: string;
  name: string;
  handle?: string | null;
  rationale?: string | null;
  score?: number | null;
  isPrimary: boolean;
  availabilityStatus?: string | null;
  createdAt?: string | Date;
}

export interface BrandKitDoc {
  id: string;
  projectId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor?: string | null;
  headlineFont: string;
  bodyFont: string;
  visualStyle: string;
  tagline?: string | null;
  brandPersonality?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface GeneratedAssetDoc {
  id: string;
  assetId?: string;
  projectId: string;
  userId?: string | null;
  assetType: AssetType | string;
  storageKey: string;
  storageUrl?: string | null;
  mimeType: string;
  width?: number | null;
  height?: number | null;
  fileSize?: number | null;
  prompt?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface KeywordDoc {
  id: string;
  projectId: string;
  keyword: string;
  searchVolume?: number | null;
  competition?: string | null;
  cpc?: number | null;
  category?: string | null;
  relevanceScore?: number | null;
  createdAt?: string | Date;
}

export interface ContentIdeaDoc {
  id: string;
  projectId: string;
  title: string;
  hook?: string | null;
  description?: string | null;
  format?: string | null;
  targetLengthMinutes?: number | null;
  estimatedViews?: string | null;
  difficulty?: string | null;
  tags: string[];
  isPlanned: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface GenerationRequestDoc {
  id: string;
  userId: string;
  projectId?: string | null;
  provider: string;
  model: string;
  requestType: string;
  status: GenerationStatus;
  startedAt?: string | Date | null;
  completedAt?: string | Date | null;
  tokensUsed?: number | null;
  estimatedCost?: number | null;
  errorMessage?: string | null;
  requestId?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface UsageLimitDoc {
  id: string;
  userId: string;
  monthlyGenerationsAllowed: number;
  monthlyGenerationsUsed: number;
  imageGenerationsAllowed: number;
  imageGenerationsUsed: number;
  tokenLimit: number;
  tokensUsed: number;
  cycleStartDate: string | Date;
  cycleEndDate: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
export type UsageLimitsDoc = UsageLimitDoc;

export interface SubscriptionDoc {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  currentPeriodStart: string | Date;
  currentPeriodEnd: string | Date;
  cancelAtPeriodEnd: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface SavedGenerationDoc {
  id: string;
  userId: string;
  projectId?: string | null;
  generationRequestId?: string | null;
  title: string;
  category: string;
  data: any;
  tags?: string[];
  isFavorite: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface FullProjectWithRelations extends ProjectDoc {
  channelProfile?: ChannelProfileDoc | null;
  brandKit?: BrandKitDoc | null;
  channelNames?: ChannelNameDoc[];
  assets?: GeneratedAssetDoc[];
  keywords?: KeywordDoc[];
  contentIdeas?: ContentIdeaDoc[];
}
