/**
 * Media Source Hub - Core Data Schemas & Models
 * Owner: Ranjeet Kumar (ranjeetk25565@gmail.com)
 */

export interface UserSchema {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  avatar: string;
  bio: string;
  isVerified: boolean; // Lifetime Verified Blue Tick (₹99 via Razorpay)
  isOwner?: boolean;   // Platform Owner (Ranjeet Kumar)
  role: 'owner' | 'creator' | 'user';
  followersCount: number;
  followingCount: number;
  postsCount: number;
  joinedDate: string;
  razorpayPaymentId?: string;
  verifiedAt?: string;
  e2eePublicKey?: string;
  fingerprint?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  duration: number; // in seconds
  genre: 'Bollywood' | 'Punjabi' | 'Bhojpuri' | 'Lo-Fi' | 'Trending' | 'Pop' | 'Instrumental';
  audioFreq?: number; // for Web Audio API synthesis
  tempo?: number;
  waveformPattern?: number[];
  playsCount?: string;
  tags: string[];
}

export interface PostComment {
  id: string;
  userId: string;
  user: Pick<UserSchema, 'id' | 'name' | 'username' | 'avatar' | 'isVerified'>;
  text: string;
  createdAt: string;
  likesCount: number;
}

export interface PostSchema {
  id: string;
  userId: string;
  user: UserSchema;
  type: 'photo' | 'video' | 'reel';
  mediaUrl: string;
  aspectRatio: '1:1' | '4:5' | '9:16';
  caption: string;
  hashtags: string[];
  location?: string; // Optional: e.g., "Bihar, India", "Patna, Bihar", etc.
  musicTrack?: MusicTrack;
  musicVolume?: number; // 0 to 100
  musicStartSec?: number;
  filterPreset?: 'none' | 'vibrant' | 'cinema' | 'noir' | 'sunset' | 'cyberpunk';
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  comments?: PostComment[];
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
}

export interface SecretMessage {
  id: string;
  senderId: string;
  receiverId: string;
  ciphertext: string; // AES-256 E2EE simulated encrypted hex
  plaintext?: string;  // Decrypted viewable only by current authenticated recipient
  iv: string;
  hash: string;       // SHA-256 verification digest
  timestamp: number;
  expiresInSec?: number; // 5, 10, 30, 60 seconds (vanishing message)
  expiresAt?: number;
  isPrivateMedia?: boolean;
  mediaUrl?: string;
  mediaType?: 'photo' | 'video';
  isFlagSecure: boolean; // Anti-screenshot & recording protection
  isRead: boolean;
}

export interface LiveStreamGift {
  id: string;
  name: string;
  icon: string;
  inrPrice: number;
  animationColor: string;
}

export interface LiveStreamComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  isVerified: boolean;
  text: string;
  timestamp: number;
  gift?: LiveStreamGift;
}

export interface LiveStream {
  id: string;
  hostUser: UserSchema;
  title: string;
  category: string;
  viewerCount: number;
  likesCount: number;
  isLive: boolean;
  startedAt: number;
  tags: string[];
}

export interface RazorpayOrderResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  paymentHandleLink: string;
  error?: string;
}

export interface RazorpayVerificationRequest {
  userId: string;
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  paymentMethod?: string;
}

export interface RazorpayVerificationResponse {
  success: boolean;
  isVerified: boolean;
  message: string;
  user?: UserSchema;
}
