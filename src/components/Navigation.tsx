import React from 'react';
import {
  Home,
  Film,
  PlusSquare,
  Lock,
  Radio,
  User,
  ShieldCheck,
  CheckCircle2,
  Search,
  Sparkles,
  Award
} from 'lucide-react';
import { UserSchema } from '../types/schemas';

interface NavigationProps {
  currentTab: 'feed' | 'reels' | 'chat' | 'live' | 'profile';
  setCurrentTab: (tab: 'feed' | 'reels' | 'chat' | 'live' | 'profile') => void;
  currentUser: UserSchema;
  onOpenCreateModal: () => void;
  onOpenRazorpayModal: () => void;
  onOpenAuthModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenCreateModal,
  onOpenRazorpayModal,
  onOpenAuthModal,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <>
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div
            onClick={() => setCurrentTab('feed')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-transparent">
                  Media Source Hub
                </span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.2 rounded font-mono font-bold">
                  v2.6
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Owner: Ranjeet Kumar • Secure Social Network
              </p>
            </div>
          </div>

          {/* Search Bar with Hashtags suggestions */}
          <div className="hidden md:flex flex-1 max-w-sm relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search #hashtags, Bihar, creators, music..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Top Actions: Get Blue Tick ₹99 + Go Live + Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Razorpay Blue Tick Badge Button */}
            {!currentUser.isVerified ? (
              <button
                onClick={onOpenRazorpayModal}
                className="px-3 sm:px-3.5 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-transform active:scale-95 animate-pulse"
                title="Verify your profile for ₹99 INR via Razorpay"
              >
                <CheckCircle2 className="w-3.5 h-3.5 fill-white text-blue-600 shrink-0" />
                <span className="hidden xs:inline">Blue Tick</span>
                <span className="bg-black/25 px-1.5 py-0.5 rounded text-[10px] font-mono">₹99</span>
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 fill-blue-400 text-white" />
                <span>Verified</span>
              </div>
            )}

            {/* Quick Live Button */}
            <button
              onClick={() => setCurrentTab('live')}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-600/15 border border-rose-500/30 text-rose-400 hover:bg-rose-600/25 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Watch or start live broadcast"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">Go Live</span>
            </button>

            {/* User Profile Avatar / Sign In */}
            <button
              onClick={() => setCurrentTab('profile')}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-700"
                />
                {currentUser.isVerified && (
                  <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400 absolute -bottom-0.5 -right-0.5" />
                )}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden lg:inline truncate max-w-[100px]">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Mobile Tab Bar (and Desktop Floating Dock) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 sm:py-3 transition-colors">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Feed */}
          <button
            onClick={() => setCurrentTab('feed')}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${
              currentTab === 'feed' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Feed</span>
          </button>

          {/* Reels */}
          <button
            onClick={() => setCurrentTab('reels')}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${
              currentTab === 'reels' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-5 h-5" />
            <span className="text-[10px]">Reels</span>
          </button>

          {/* Create Post (+) Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex flex-col items-center gap-1 -mt-5 group"
            title="Create Post or Reel"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-400 flex items-center justify-center text-white shadow-xl shadow-blue-600/40 group-hover:scale-105 group-active:scale-95 transition-transform">
              <PlusSquare className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-blue-400 font-bold">Create</span>
          </button>

          {/* Secret Chat E2EE */}
          <button
            onClick={() => setCurrentTab('chat')}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors relative ${
              currentTab === 'chat' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Lock className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse" />
            </div>
            <span className="text-[10px]">Secret Chat</span>
          </button>

          {/* Live */}
          <button
            onClick={() => setCurrentTab('live')}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${
              currentTab === 'live' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-5 h-5" />
            <span className="text-[10px]">Live</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${
              currentTab === 'profile' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
