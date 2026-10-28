import React, { useState } from 'react';
import {
  CheckCircle2,
  Shield,
  CreditCard,
  ExternalLink,
  Grid,
  Film,
  KeyRound,
  Calendar,
  MapPin,
  Settings,
  Users,
  Award
} from 'lucide-react';
import { UserSchema, PostSchema } from '../types/schemas';
import { DEMO_USERS } from '../utils/mockData';

interface ProfileViewProps {
  user: UserSchema;
  userPosts: PostSchema[];
  onOpenRazorpayModal: () => void;
  onSwitchUser: (newUser: UserSchema) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  userPosts,
  onOpenRazorpayModal,
  onSwitchUser
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'security'>('posts');

  const RAZORPAY_HANDLE = 'https://razorpay.me/@ranjeetkumarofficial';

  const userReels = userPosts.filter(p => p.type === 'reel');

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* User Account Switcher Strip */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Switch Persona / Test Account:
          </span>
          <div className="flex items-center gap-1.5">
            {DEMO_USERS.map(u => (
              <button
                key={u.id}
                onClick={() => onSwitchUser(u)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  u.id === user.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {u.name.split(' ')[0]} {u.isOwner ? '👑' : u.isVerified ? '✓' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Main Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-xl"
            />
            {user.isVerified ? (
              <div
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-blue-500 text-white shadow-lg"
                title="Lifetime Verified Blue Tick"
              >
                <CheckCircle2 className="w-5 h-5 fill-white text-blue-600" />
              </div>
            ) : (
              <button
                onClick={onOpenRazorpayModal}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-800 border border-slate-700 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                title="Unlock Blue Tick for ₹99"
              >
                <Award className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl font-bold text-slate-100">{user.name}</h3>
                  {user.isVerified && (
                    <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-blue-400 text-white" />
                      <span>Verified</span>
                    </span>
                  )}
                  {user.isOwner && (
                    <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold">
                      Owner & Architect
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">@{user.username} • {user.email}</p>
              </div>

              {/* Verification Button */}
              {!user.isVerified ? (
                <button
                  onClick={onOpenRazorpayModal}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 fill-white text-blue-600" />
                  <span>Get Blue Tick (₹99)</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-medium">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Razorpay Lifetime Badge</span>
                </div>
              )}
            </div>

            {/* Bio */}
            <p className="text-xs text-slate-300 leading-relaxed">{user.bio}</p>

            {/* Details Strip */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Patna, Bihar, India</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Joined {user.joinedDate}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 mt-6 text-center">
          <div>
            <span className="text-lg font-bold text-slate-100">{userPosts.length}</span>
            <span className="text-[11px] text-slate-400 block">Posts</span>
          </div>
          <div>
            <span className="text-lg font-bold text-slate-100">{user.followersCount.toLocaleString()}</span>
            <span className="text-[11px] text-slate-400 block">Followers</span>
          </div>
          <div>
            <span className="text-lg font-bold text-slate-100">{user.followingCount}</span>
            <span className="text-[11px] text-slate-400 block">Following</span>
          </div>
        </div>

        {/* Owner Payment Handle Callout */}
        <div className="mt-4 p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300">Official Razorpay Link:</span>
            <a
              href={RAZORPAY_HANDLE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 font-mono hover:underline truncate max-w-[200px]"
            >
              {RAZORPAY_HANDLE}
            </a>
          </div>

          <a
            href={RAZORPAY_HANDLE}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Profile Content Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 pb-3 text-xs font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'posts'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts ({userPosts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex-1 pb-3 text-xs font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'reels'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels ({userReels.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 pb-3 text-xs font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'security'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>E2EE Security</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {userPosts.map(post => (
            <div
              key={post.id}
              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group"
            >
              <img src={post.mediaUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-bold">
                <span>❤️ {post.likesCount}</span>
                <span>💬 {post.commentsCount}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {userReels.length > 0 ? (
            userReels.map(reel => (
              <div
                key={reel.id}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group"
              >
                <img src={reel.mediaUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-mono">
                  9:16
                </span>
                <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] truncate font-medium">
                  {reel.caption}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-xs text-slate-500">
              No vertical reels created yet. Tap '+' to record your first reel!
            </div>
          )}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Cryptographic Identity</span>
          </h4>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Public Key Identifier</span>
              <p className="font-mono text-emerald-400 break-all">{user.e2eePublicKey || `E2EE-PUB-${user.id}-2026`}</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Device Safety Fingerprint</span>
              <p className="font-mono text-blue-400">{user.fingerprint || '8492 1042 5901'}</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Anti-Misuse Protection (FLAG_SECURE)</span>
              <p className="text-emerald-400 font-semibold">Enabled (Blocks screenshots, recording & right-click misuse)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
