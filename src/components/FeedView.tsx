import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Music,
  Play,
  Pause,
  CheckCircle2,
  Send,
  MoreHorizontal,
  Volume2
} from 'lucide-react';
import { PostSchema, UserSchema } from '../types/schemas';
import { audioSynth } from '../utils/musicTracks';
import { DEMO_USERS } from '../utils/mockData';

interface FeedViewProps {
  posts: PostSchema[];
  currentUser: UserSchema;
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onTagClick: (tag: string) => void;
  onOpenRazorpayModal: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  currentUser,
  onLikeToggle,
  onBookmarkToggle,
  onAddComment,
  onTagClick,
  onOpenRazorpayModal
}) => {
  const [playingTrackPostId, setPlayingTrackPostId] = useState<string | null>(null);
  const [activeCommentDrawerPostId, setActiveCommentDrawerPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});

  const handleTogglePlayAudio = (post: PostSchema) => {
    if (!post.musicTrack) return;

    if (playingTrackPostId === post.id) {
      audioSynth.stop();
      setPlayingTrackPostId(null);
    } else {
      setPlayingTrackPostId(post.id);
      audioSynth.playTrack(post.musicTrack, () => {
        setPlayingTrackPostId(null);
      });
    }
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInput[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInput(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Story Bubbles Strip */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-sm flex items-center gap-4 overflow-x-auto no-scrollbar">
        {/* Your Story / Owner Story */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-rose-500">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-900 group-hover:scale-105 transition-transform"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-blue-600 border-2 border-slate-900 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              +
            </span>
          </div>
          <span className="text-[11px] text-slate-300 font-medium truncate max-w-[64px]">Your Story</span>
        </div>

        {/* Demo creators stories */}
        {DEMO_USERS.map(user => (
          <div key={user.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-900 group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex items-center gap-0.5 max-w-[68px]">
              <span className="text-[11px] text-slate-300 font-medium truncate">{user.name.split(' ')[0]}</span>
              {user.isVerified && <CheckCircle2 className="w-2.5 h-2.5 text-blue-400 fill-blue-400 shrink-0" />}
            </div>
          </div>
        ))}
      </div>

      {/* Verification Promo Callout if user is not verified */}
      {!currentUser.isVerified && (
        <div className="p-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/30 rounded-3xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
              <CheckCircle2 className="w-6 h-6 fill-blue-500 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Get Lifetime Verified Blue Tick</h4>
              <p className="text-xs text-blue-200">Only ₹99 INR via Razorpay • Instant Credibility & Algorithm Boost</p>
            </div>
          </div>
          <button
            onClick={onOpenRazorpayModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shrink-0 transition-transform active:scale-95"
          >
            Verify Now
          </button>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map(post => {
          const isPlayingThis = playingTrackPostId === post.id;
          const showComments = activeCommentDrawerPostId === post.id;

          return (
            <article
              key={post.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:border-slate-700/80 transition-colors"
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.user.avatar}
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-100 text-sm">{post.user.name}</span>
                      {post.user.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400 shrink-0" />
                      )}
                      {post.user.isOwner && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1.5 rounded font-semibold">
                          Owner
                        </span>
                      )}
                    </div>
                    {/* Optional Location Tagging */}
                    {post.location && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span className="truncate max-w-[200px]">{post.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{post.createdAt}</span>
                </div>
              </div>

              {/* Media Container */}
              <div className="relative w-full bg-black overflow-hidden flex items-center justify-center max-h-[520px]">
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className={`w-full h-full object-cover transition-all ${
                    post.filterPreset === 'vibrant'
                      ? 'saturate-150 contrast-110'
                      : post.filterPreset === 'cinema'
                      ? 'contrast-125 sepia-[0.2]'
                      : post.filterPreset === 'sunset'
                      ? 'sepia-[0.3] hue-rotate-[-10deg]'
                      : post.filterPreset === 'noir'
                      ? 'grayscale contrast-130'
                      : post.filterPreset === 'cyberpunk'
                      ? 'hue-rotate-[180deg] saturate-150'
                      : ''
                  }`}
                />

                {/* Background Music Player Badge on Post */}
                {post.musicTrack && (
                  <button
                    onClick={() => handleTogglePlayAudio(post)}
                    className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/75 hover:bg-black/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-white border border-white/20 transition-transform active:scale-95 shadow-xl"
                  >
                    <div className="p-1 rounded-full bg-blue-600 text-white">
                      {isPlayingThis ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3 fill-current" />
                      )}
                    </div>
                    <div className="text-left max-w-[160px] truncate">
                      <p className="font-semibold truncate text-[11px]">{post.musicTrack.title}</p>
                      <p className="text-[10px] text-slate-300 truncate">{post.musicTrack.artist}</p>
                    </div>

                    {/* Animated audio equalizer waveform */}
                    {isPlayingThis && (
                      <span className="flex gap-0.5 items-end h-3 ml-1">
                        <span className="w-0.5 bg-blue-400 wave-bar-anim" style={{ animationDelay: '0.1s' }} />
                        <span className="w-0.5 bg-blue-400 wave-bar-anim" style={{ animationDelay: '0.3s' }} />
                        <span className="w-0.5 bg-blue-400 wave-bar-anim" style={{ animationDelay: '0.2s' }} />
                      </span>
                    )}
                  </button>
                )}

                {/* Reel Badge if 9:16 vertical */}
                {post.type === 'reel' && (
                  <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-white/10">
                    Reel
                  </span>
                )}
              </div>

              {/* Action Bar */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Like */}
                    <button
                      onClick={() => onLikeToggle(post.id)}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          post.isLiked ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      <span className="text-xs font-semibold">{post.likesCount.toLocaleString()}</span>
                    </button>

                    {/* Comment */}
                    <button
                      onClick={() => setActiveCommentDrawerPostId(showComments ? null : post.id)}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-blue-400 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-xs font-semibold">{post.commentsCount}</span>
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: 'Media Source Hub Post', text: post.caption, url: window.location.href });
                        }
                      }}
                      className="text-slate-300 hover:text-slate-100 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Bookmark */}
                  <button
                    onClick={() => onBookmarkToggle(post.id)}
                    className="text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Bookmark
                      className={`w-5 h-5 ${post.isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`}
                    />
                  </button>
                </div>

                {/* Caption & Hashtag Parser */}
                <div className="text-xs text-slate-200 leading-relaxed">
                  <span className="font-bold mr-1.5 text-slate-100">{post.user.name}</span>
                  <span>{post.caption}</span>
                </div>

                {/* Hashtag Pills */}
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.hashtags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => onTagClick(tag)}
                        className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded-md transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                {/* Inline Comment Drawer */}
                {showComments && (
                  <div className="pt-3 border-t border-slate-800 space-y-3 animate-in fade-in duration-150">
                    {post.comments && post.comments.length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {post.comments.map(c => (
                          <div key={c.id} className="text-xs flex items-start gap-2">
                            <img src={c.user.avatar} alt="" className="w-5 h-5 rounded-full object-cover mt-0.5" />
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-slate-200">{c.user.name}</span>
                                {c.user.isVerified && (
                                  <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400" />
                                )}
                              </div>
                              <p className="text-slate-300">{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <form
                      onSubmit={e => handleCommentSubmit(post.id, e)}
                      className="flex items-center gap-2 pt-1"
                    >
                      <input
                        type="text"
                        value={commentInput[post.id] || ''}
                        onChange={e =>
                          setCommentInput({ ...commentInput, [post.id]: e.target.value })
                        }
                        placeholder="Add a comment for the creator..."
                        className="flex-1 bg-slate-950 px-3 py-2 text-xs rounded-xl border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!commentInput[post.id]?.trim()}
                        className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
