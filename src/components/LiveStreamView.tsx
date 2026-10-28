import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Users,
  Heart,
  Send,
  Sparkles,
  Gift,
  Share2,
  X,
  Flame,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  Tv
} from 'lucide-react';
import { UserSchema, LiveStream, LiveStreamComment, LiveStreamGift } from '../types/schemas';
import { INITIAL_LIVE_STREAMS } from '../utils/mockData';

interface LiveStreamViewProps {
  currentUser: UserSchema;
  onOpenRazorpayModal: () => void;
}

const GIFTS: LiveStreamGift[] = [
  { id: 'g1', name: 'Desi Chai', icon: '☕', inrPrice: 20, animationColor: 'text-amber-400' },
  { id: 'g2', name: 'Super Star', icon: '⭐', inrPrice: 50, animationColor: 'text-yellow-300' },
  { id: 'g3', name: 'Blue Gem VIP', icon: '💎', inrPrice: 99, animationColor: 'text-blue-400' },
  { id: 'g4', name: 'Golden Rocket', icon: '🚀', inrPrice: 199, animationColor: 'text-purple-400' }
];

export const LiveStreamView: React.FC<LiveStreamViewProps> = ({
  currentUser,
  onOpenRazorpayModal
}) => {
  const [activeStream, setActiveStream] = useState<LiveStream>(INITIAL_LIVE_STREAMS[0]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [newBroadcastTitle, setNewBroadcastTitle] = useState('');
  const [newBroadcastCategory, setNewBroadcastCategory] = useState('Tech & Community');
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);

  // Live Comments
  const [comments, setComments] = useState<LiveStreamComment[]>([
    {
      id: 'lc-1',
      userId: 'u1',
      userName: 'Amit_Patna',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      isVerified: true,
      text: 'Audio clarity is crisp! Bihar is watching! 🔥🇮🇳',
      timestamp: Date.now() - 30000
    },
    {
      id: 'lc-2',
      userId: 'u2',
      userName: 'Sneha_R',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      isVerified: false,
      text: 'Loving this live stream on Media Source Hub ❤️',
      timestamp: Date.now() - 15000
    }
  ]);
  const [inputComment, setInputComment] = useState('');

  // Floating Reactions
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string; left: number }[]>([]);
  const [viewerCount, setViewerCount] = useState(activeStream.viewerCount);
  const [likesCount, setLikesCount] = useState(activeStream.likesCount);
  const [showGiftDrawer, setShowGiftDrawer] = useState(false);

  const commentsEndRef = useRef<HTMLDivElement>(null);
  const videoStreamRef = useRef<HTMLVideoElement>(null);

  // Auto-scroll comments
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  // Periodic random live comments for bustling realism
  useEffect(() => {
    const liveSimTimer = setInterval(() => {
      const mockNames = ['Rohan_Bihar', 'Deepak_Kumar', 'Pooja_Music', 'Kavita_Patel', 'Rahul_Tech'];
      const mockMsgs = [
        'Awesome presentation! 👏',
        'Can you play the Patna remix next? 🎶',
        'Big fan of Ranjeet Kumar and Media Source Hub 🚀',
        'Heart reaction sent! ❤️',
        'Super clear 60fps streaming 🔥'
      ];
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
      const randomMsg = mockMsgs[Math.floor(Math.random() * mockMsgs.length)];

      const newC: LiveStreamComment = {
        id: `auto-${Date.now()}`,
        userId: `u-${Date.now()}`,
        userName: randomName,
        userAvatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`,
        isVerified: Math.random() > 0.5,
        text: randomMsg,
        timestamp: Date.now()
      };

      setComments(prev => [...prev.slice(-25), newC]);
      setViewerCount(v => v + Math.floor(Math.random() * 5) - 2);
    }, 4000);

    return () => clearInterval(liveSimTimer);
  }, [activeStream]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputComment.trim()) return;

    const newC: LiveStreamComment = {
      id: `comm-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      isVerified: currentUser.isVerified,
      text: inputComment.trim(),
      timestamp: Date.now()
    };

    setComments(prev => [...prev, newC]);
    setInputComment('');
  };

  const handleSendHeart = (emoji = '❤️') => {
    setLikesCount(l => l + 1);
    const newReaction = {
      id: `heart-${Date.now()}-${Math.random()}`,
      emoji,
      left: Math.random() * 60 + 20 // 20% to 80% horizontal range
    };
    setFloatingReactions(prev => [...prev.slice(-15), newReaction]);
  };

  const handleSendGift = (gift: LiveStreamGift) => {
    const newC: LiveStreamComment = {
      id: `gift-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      isVerified: currentUser.isVerified,
      text: `Sent ${gift.icon} ${gift.name} (₹${gift.inrPrice}) to creator!`,
      timestamp: Date.now(),
      gift
    };
    setComments(prev => [...prev, newC]);
    handleSendHeart(gift.icon);
    setShowGiftDrawer(false);
  };

  const handleStartOwnBroadcast = () => {
    if (!newBroadcastTitle.trim()) return;

    const myStream: LiveStream = {
      id: `live-user-${Date.now()}`,
      hostUser: currentUser,
      title: newBroadcastTitle,
      category: newBroadcastCategory,
      viewerCount: 1,
      likesCount: 0,
      isLive: true,
      startedAt: Date.now(),
      tags: ['#LiveNow', '#MediaSourceHub']
    };

    setActiveStream(myStream);
    setIsBroadcasting(true);
    setShowGoLiveModal(false);

    // Turn on local camera if available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        if (videoStreamRef.current) {
          videoStreamRef.current.srcObject = stream;
        }
      }).catch(err => {
        console.warn('Live stream camera fallback:', err);
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 max-h-[88vh]">
      {/* Main Broadcast Viewer Frame */}
      <div className="relative flex-1 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Stream Video Surface */}
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
          {isBroadcasting ? (
            <video
              ref={videoStreamRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80"
              alt="Live stage"
              className="w-full h-full object-cover brightness-75"
            />
          )}

          {/* Floating animated reactions layer */}
          <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
            {floatingReactions.map(r => (
              <span
                key={r.id}
                className="absolute bottom-16 text-3xl animate-float-heart"
                style={{ left: `${r.left}%` }}
              >
                {r.emoji}
              </span>
            ))}
          </div>

          {/* Top Live Overlay Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            {/* Host Info */}
            <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <img
                src={activeStream.hostUser.avatar}
                alt={activeStream.hostUser.name}
                className="w-7 h-7 rounded-full object-cover border border-rose-500"
              />
              <div className="leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white truncate max-w-[120px] sm:max-w-[180px]">
                    {activeStream.hostUser.name}
                  </span>
                  {activeStream.hostUser.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                  )}
                </div>
                <span className="text-[10px] text-slate-300 block">{activeStream.category}</span>
              </div>
            </div>

            {/* Badges: LIVE + Viewer Counter */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-rose-600 text-white font-bold text-xs uppercase px-2.5 py-1 rounded-full shadow-lg shadow-rose-600/40 animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                <span>LIVE</span>
              </span>

              <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/10">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono font-semibold">{viewerCount.toLocaleString()}</span>
              </span>
            </div>
          </div>

          {/* Stream Title Bar overlay at bottom left */}
          <div className="absolute bottom-4 left-4 right-20 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 rounded-2xl">
            <h4 className="text-white text-sm font-bold truncate">{activeStream.title}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
              <span>{activeStream.category}</span>
              <span>•</span>
              <span className="text-rose-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>{likesCount.toLocaleString()} hearts</span>
              </span>
            </div>
          </div>

          {/* Floating Heart / Reaction quick button */}
          <button
            onClick={() => handleSendHeart('❤️')}
            className="absolute bottom-4 right-4 z-20 p-3.5 rounded-full bg-rose-600/80 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/30 active:scale-90 transition-transform"
            title="Send Heart"
          >
            <Heart className="w-6 h-6 fill-white" />
          </button>
        </div>

        {/* Stream Selector Strip */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Channels:</span>
            {INITIAL_LIVE_STREAMS.map(stream => (
              <button
                key={stream.id}
                onClick={() => {
                  setActiveStream(stream);
                  setIsBroadcasting(false);
                  setViewerCount(stream.viewerCount);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors border ${
                  activeStream.id === stream.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <img src={stream.hostUser.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                <span className="truncate max-w-[120px]">{stream.hostUser.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowGoLiveModal(true)}
            className="px-4 py-1.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shrink-0 flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Go Live Now</span>
          </button>
        </div>
      </div>

      {/* Right Sidebar: Live Chat Barrage & Super Chat Tipping */}
      <div className="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[320px] lg:h-full">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500" />
            <h4 className="font-bold text-slate-100 text-xs">Live Chat Stream</h4>
          </div>

          <button
            onClick={() => setShowGiftDrawer(!showGiftDrawer)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold flex items-center gap-1 hover:bg-amber-500/20 transition-colors"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Tip Creator</span>
          </button>
        </div>

        {/* Gift Selector Drawer */}
        {showGiftDrawer && (
          <div className="p-3 bg-slate-950 border-b border-slate-800 animate-in slide-in-from-top-2">
            <span className="text-[11px] font-semibold text-slate-300 block mb-2">Send Super Chat Gift</span>
            <div className="grid grid-cols-2 gap-2">
              {GIFTS.map(gift => (
                <button
                  key={gift.id}
                  onClick={() => handleSendGift(gift)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center gap-2 text-left transition-colors"
                >
                  <span className="text-xl">{gift.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-200">{gift.name}</p>
                    <span className="text-[10px] text-amber-400 font-mono">₹{gift.inrPrice}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comments Feed List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {comments.map(c => (
            <div
              key={c.id}
              className={`text-xs p-2 rounded-xl transition-all ${
                c.gift
                  ? 'bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-transparent border border-amber-500/30'
                  : 'bg-slate-950/60'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <img src={c.userAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                <span className="font-semibold text-slate-300">{c.userName}</span>
                {c.isVerified && <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400" />}
                {c.gift && (
                  <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                    ₹{c.gift.inrPrice}
                  </span>
                )}
              </div>
              <p className="text-slate-200 leading-snug break-words pl-5">{c.text}</p>
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>

        {/* Send Comment Form */}
        <form onSubmit={handleSendComment} className="p-3 border-t border-slate-800 bg-slate-900">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={inputComment}
              onChange={e => setInputComment(e.target.value)}
              placeholder="Send live comment..."
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-3 pr-9 py-2.5 border border-slate-800 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!inputComment.trim()}
              className="absolute right-1.5 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* "Go Live" Setup Modal */}
      {showGoLiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
                <span>Go Live Broadcast Studio</span>
              </h4>
              <button
                onClick={() => setShowGoLiveModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Broadcast Title</label>
              <input
                type="text"
                value={newBroadcastTitle}
                onChange={e => setNewBroadcastTitle(e.target.value)}
                placeholder="e.g. Creator AMA with Owner Ranjeet Kumar"
                className="w-full bg-slate-950 px-3 py-2 text-xs rounded-xl border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
              <select
                value={newBroadcastCategory}
                onChange={e => setNewBroadcastCategory(e.target.value)}
                className="w-full bg-slate-950 px-3 py-2 text-xs rounded-xl border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Tech & Community">Tech & Community</option>
                <option value="Music & Concert">Music & Concert</option>
                <option value="Casual Chat">Casual Chat</option>
                <option value="Gaming & Esports">Gaming & Esports</option>
              </select>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-400 space-y-1">
              <p className="font-medium text-slate-200">Broadcast Guidelines:</p>
              <p>• Camera and microphone will activate once broadcast begins.</p>
              <p>• Viewers can chat, send live reactions, and tip with Razorpay.</p>
            </div>

            <button
              onClick={handleStartOwnBroadcast}
              disabled={!newBroadcastTitle.trim()}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
            >
              Start Live Broadcast Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
