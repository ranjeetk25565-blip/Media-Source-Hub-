import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  MapPin,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';
import { PostSchema, UserSchema } from '../types/schemas';
import { audioSynth } from '../utils/musicTracks';

interface ReelsViewProps {
  reels: PostSchema[];
  currentUser: UserSchema;
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onTagClick: (tag: string) => void;
  onOpenRazorpayModal: () => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  currentUser,
  onLikeToggle,
  onBookmarkToggle,
  onTagClick,
  onOpenRazorpayModal
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDoubleTapHeart, setIsDoubleTapHeart] = useState(false);

  // If no reels, fallback
  const activeReel = reels[currentIndex] || reels[0];

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
      audioSynth.stop();
      setIsPlayingAudio(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      audioSynth.stop();
      setIsPlayingAudio(false);
    }
  };

  const handleToggleSound = () => {
    if (!activeReel?.musicTrack) return;

    if (isPlayingAudio) {
      audioSynth.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      audioSynth.playTrack(activeReel.musicTrack, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleDoubleTap = () => {
    if (!activeReel.isLiked) {
      onLikeToggle(activeReel.id);
    }
    setIsDoubleTapHeart(true);
    setTimeout(() => setIsDoubleTapHeart(false), 900);
  };

  if (!activeReel) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        No reels available. Create one with 9:16 vertical mode!
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center h-[calc(100vh-140px)] max-h-[820px] max-w-sm mx-auto">
      {/* Reel Card Frame */}
      <div
        onDoubleClick={handleDoubleTap}
        className="relative w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-850 select-none group"
      >
        {/* Media Background */}
        <img
          src={activeReel.mediaUrl}
          alt={activeReel.caption}
          className={`w-full h-full object-cover transition-all duration-300 ${
            activeReel.filterPreset === 'vibrant'
              ? 'saturate-150 contrast-110'
              : activeReel.filterPreset === 'sunset'
              ? 'sepia-[0.3] hue-rotate-[-10deg]'
              : activeReel.filterPreset === 'cinema'
              ? 'contrast-125 sepia-[0.2]'
              : ''
          }`}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

        {/* Double-tap animated heart pop */}
        {isDoubleTapHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 duration-200">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl animate-ping" />
          </div>
        )}

        {/* Top Bar: Audio Toggle & Reel Progress Indicator */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex gap-1 flex-1 mr-4">
            {reels.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {activeReel.musicTrack && (
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 active:scale-90 transition-transform"
            >
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4 text-blue-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-300" />
              )}
            </button>
          )}
        </div>

        {/* Right Floating Actions Column */}
        <div className="absolute bottom-20 right-3 flex flex-col items-center gap-5 z-20 text-white">
          {/* Like */}
          <button
            onClick={() => onLikeToggle(activeReel.id)}
            className="flex flex-col items-center gap-1 group/btn"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-active/btn:scale-90 transition-transform">
              <Heart
                className={`w-6 h-6 ${
                  activeReel.isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
                }`}
              />
            </div>
            <span className="text-[11px] font-bold drop-shadow">
              {activeReel.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comment */}
          <button className="flex flex-col items-center gap-1">
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-transform active:scale-90">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold drop-shadow">{activeReel.commentsCount}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'Media Source Hub Reel', text: activeReel.caption, url: window.location.href });
              }
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-transform active:scale-90">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold drop-shadow">Share</span>
          </button>

          {/* Bookmark */}
          <button onClick={() => onBookmarkToggle(activeReel.id)} className="flex flex-col items-center gap-1">
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-transform active:scale-90">
              <Bookmark
                className={`w-6 h-6 ${
                  activeReel.isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-white'
                }`}
              />
            </div>
          </button>

          {/* Spinning Audio Track Disk */}
          {activeReel.musicTrack && (
            <div
              onClick={handleToggleSound}
              className={`w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden cursor-pointer shadow-lg ${
                isPlayingAudio ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            >
              <img
                src={activeReel.musicTrack.coverUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Bottom Content & Creator Info */}
        <div className="absolute bottom-4 left-4 right-16 z-20 text-white space-y-2">
          {/* Creator Profile */}
          <div className="flex items-center gap-2.5">
            <img
              src={activeReel.user.avatar}
              alt={activeReel.user.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-blue-500"
            />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white drop-shadow">{activeReel.user.name}</span>
              {activeReel.user.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400" />
              )}
            </div>
          </div>

          {/* Optional Location */}
          {activeReel.location && (
            <div className="flex items-center gap-1 text-[11px] text-slate-300">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{activeReel.location}</span>
            </div>
          )}

          {/* Caption */}
          <p className="text-xs text-slate-100 line-clamp-2 leading-relaxed drop-shadow">
            {activeReel.caption}
          </p>

          {/* Hashtags */}
          {activeReel.hashtags && (
            <div className="flex flex-wrap gap-1">
              {activeReel.hashtags.map(t => (
                <button
                  key={t}
                  onClick={() => onTagClick(t)}
                  className="text-[11px] font-semibold text-blue-300 hover:text-white"
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Background Soundtrack marquee */}
          {activeReel.musicTrack && (
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs text-blue-200 border border-white/10 w-fit max-w-full">
              <Music className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">
                {activeReel.musicTrack.title} • {activeReel.musicTrack.artist}
              </span>
            </div>
          )}
        </div>

        {/* Up / Down Navigation Controls */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-transform active:scale-90"
              title="Previous Reel"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}

          {currentIndex < reels.length - 1 && (
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-transform active:scale-90"
              title="Next Reel"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
