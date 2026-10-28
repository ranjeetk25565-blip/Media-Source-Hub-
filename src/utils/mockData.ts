import { UserSchema, PostSchema, LiveStream, SecretMessage } from '../types/schemas';
import { MUSIC_CATALOG } from './musicTracks';
import { encryptE2EEMessage, generateSafetyFingerprint } from './security';

export const OWNER_USER: UserSchema = {
  id: 'user-ranjeet-owner',
  name: 'Ranjeet Kumar',
  username: 'ranjeetkumar',
  email: 'ranjeetk25565@gmail.com',
  phoneNumber: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  bio: 'Founder & Lead Architect @ Media Source Hub 🚀 | Innovator from Bihar, India 🇮🇳 | Verified Creator',
  isVerified: true,
  isOwner: true,
  role: 'owner',
  followersCount: 142800,
  followingCount: 312,
  postsCount: 48,
  joinedDate: 'January 2026',
  e2eePublicKey: 'E2EE-PUB-RANJEET-KUMAR-99',
  fingerprint: generateSafetyFingerprint('user-ranjeet-owner', 'demo-recipient')
};

export const DEMO_USERS: UserSchema[] = [
  OWNER_USER,
  {
    id: 'user-priya',
    name: 'Priya Sharma',
    username: 'priya_visuals',
    email: 'priya@mediasourcehub.com',
    phoneNumber: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    bio: 'Cinema & Travel Filmmaker 🎥 Exploring cultural heritage in Patna, Bihar ✨',
    isVerified: true,
    role: 'creator',
    followersCount: 58200,
    followingCount: 420,
    postsCount: 32,
    joinedDate: 'February 2026'
  },
  {
    id: 'user-vikram',
    name: 'Vikram Singh',
    username: 'vikram_tech',
    email: 'vikram@mediasourcehub.com',
    phoneNumber: '+91 97222 33445',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'Full Stack Dev & WebRTC Geek 💻 Cybersecurity advocate 🛡️',
    isVerified: false,
    role: 'user',
    followersCount: 1240,
    followingCount: 180,
    postsCount: 14,
    joinedDate: 'March 2026'
  },
  {
    id: 'user-ananya',
    name: 'Ananya Patel',
    username: 'ananya_beats',
    email: 'ananya@mediasourcehub.com',
    phoneNumber: '+91 99333 44556',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    bio: 'Music producer & Vocalist 🎙️ Catch me live every evening! 🎶',
    isVerified: true,
    role: 'creator',
    followersCount: 89400,
    followingCount: 260,
    postsCount: 65,
    joinedDate: 'January 2026'
  }
];

export const INITIAL_POSTS: PostSchema[] = [
  {
    id: 'post-1',
    userId: OWNER_USER.id,
    user: OWNER_USER,
    type: 'photo',
    aspectRatio: '4:5',
    mediaUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1080&auto=format&fit=crop&q=80',
    caption: 'Welcome to Media Source Hub! 🚀 Built with state-of-the-art privacy shields, background music pairing, and instant Razorpay verification. Proudly built from Bihar, India for creators worldwide! 🇮🇳✨',
    hashtags: ['#MediaSourceHub', '#RanjeetKumar', '#Bihar', '#CreatorHub', '#TechIndia'],
    location: 'Patna, Bihar, India',
    musicTrack: MUSIC_CATALOG[0], // Desi Dhol Beats
    musicVolume: 80,
    musicStartSec: 15,
    filterPreset: 'vibrant',
    likesCount: 1420,
    commentsCount: 86,
    sharesCount: 112,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2 hours ago',
    comments: [
      {
        id: 'c-1',
        userId: 'user-priya',
        user: DEMO_USERS[1],
        text: 'Huge congratulations Ranjeet bhai! The audio integration and security controls are next level 🔥',
        createdAt: '1 hour ago',
        likesCount: 34
      },
      {
        id: 'c-2',
        userId: 'user-vikram',
        user: DEMO_USERS[2],
        text: 'The anti-screenshot protection on private chats is game changing! 🛡️',
        createdAt: '45 mins ago',
        likesCount: 18
      }
    ]
  },
  {
    id: 'post-2',
    userId: 'user-priya',
    user: DEMO_USERS[1],
    type: 'reel',
    aspectRatio: '9:16',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&auto=format&fit=crop&q=80',
    caption: 'Chasing sunsets across the historic banks of the Ganges! Golden hour reflections never fail to inspire. 🌅✨',
    hashtags: ['#Bihar', '#TravelDiaries', '#SunsetVibes', '#ViralReels', '#Photography'],
    location: 'Bihar, India',
    musicTrack: MUSIC_CATALOG[1], // Sunset Lo-Fi
    musicVolume: 90,
    musicStartSec: 0,
    filterPreset: 'sunset',
    likesCount: 3820,
    commentsCount: 142,
    sharesCount: 340,
    isLiked: true,
    isBookmarked: true,
    createdAt: '5 hours ago',
    comments: [
      {
        id: 'c-3',
        userId: OWNER_USER.id,
        user: OWNER_USER,
        text: 'Breathtaking capture Priya! Keep shining ✨',
        createdAt: '4 hours ago',
        likesCount: 42
      }
    ]
  },
  {
    id: 'post-3',
    userId: 'user-ananya',
    user: DEMO_USERS[3],
    type: 'video',
    aspectRatio: '1:1',
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1080&auto=format&fit=crop&q=80',
    caption: 'Studio rehearsals for our upcoming live acoustic stream tonight! Drop your song requests in the comments 👇🎶',
    hashtags: ['#MusicLover', '#Bollywood', '#DilKiDhadkan', '#LiveBroadcast', '#MediaSourceHub'],
    location: 'Mumbai, Maharashtra',
    musicTrack: MUSIC_CATALOG[3], // Dil Ki Dhadkan
    musicVolume: 95,
    musicStartSec: 30,
    filterPreset: 'cinema',
    likesCount: 2910,
    commentsCount: 98,
    sharesCount: 175,
    isLiked: false,
    isBookmarked: false,
    createdAt: '8 hours ago'
  }
];

export const INITIAL_SECRET_MESSAGES: SecretMessage[] = [
  (() => {
    const enc = encryptE2EEMessage('Hey Ranjeet! Just tested the E2EE Secret Chat. The key exchange is instant and completely encrypted!');
    return {
      id: 'sec-msg-1',
      senderId: 'user-vikram',
      receiverId: OWNER_USER.id,
      ciphertext: enc.ciphertext,
      plaintext: 'Hey Ranjeet! Just tested the E2EE Secret Chat. The key exchange is instant and completely encrypted!',
      iv: enc.iv,
      hash: enc.hash,
      timestamp: Date.now() - 3600000,
      isFlagSecure: true,
      isRead: true
    };
  })(),
  (() => {
    const enc = encryptE2EEMessage('Awesome Vikram! Notice how taking a screenshot triggers the FLAG_SECURE shield to blur and watermark immediately 🛡️');
    return {
      id: 'sec-msg-2',
      senderId: OWNER_USER.id,
      receiverId: 'user-vikram',
      ciphertext: enc.ciphertext,
      plaintext: 'Awesome Vikram! Notice how taking a screenshot triggers the FLAG_SECURE shield to blur and watermark immediately 🛡️',
      iv: enc.iv,
      hash: enc.hash,
      timestamp: Date.now() - 1800000,
      isFlagSecure: true,
      isRead: true
    };
  })()
];

export const INITIAL_LIVE_STREAMS: LiveStream[] = [
  {
    id: 'live-ananya',
    hostUser: DEMO_USERS[3],
    title: 'Acoustic Jamming & Fan Interaction 🎸🎶',
    category: 'Music & Concert',
    viewerCount: 1420,
    likesCount: 8400,
    isLive: true,
    startedAt: Date.now() - 1200000,
    tags: ['#Music', '#LiveJam', '#IndiaLive']
  },
  {
    id: 'live-ranjeet',
    hostUser: OWNER_USER,
    title: 'Media Source Hub: Engineering Deep Dive & Live Q&A 💻🚀',
    category: 'Tech & Community',
    viewerCount: 3890,
    likesCount: 19800,
    isLive: true,
    startedAt: Date.now() - 3400000,
    tags: ['#TechTalk', '#MediaSourceHub', '#RanjeetKumar']
  }
];
