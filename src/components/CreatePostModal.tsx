import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Music,
  MapPin,
  Hash,
  Play,
  Pause,
  Sliders,
  Sparkles,
  Film,
  Image as ImageIcon,
  Check,
  Search,
  Volume2
} from 'lucide-react';
import { PostSchema, UserSchema, MusicTrack } from '../types/schemas';
import { MUSIC_CATALOG, audioSynth } from '../utils/musicTracks';
import { extractHashtags, getHashtagSuggestions } from '../utils/hashtagParser';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSchema;
  onPostCreated: (newPost: PostSchema) => void;
}

const POPULAR_LOCATIONS = [
  'Patna, Bihar, India',
  'Bihar, India',
  'Nalanda, Bihar, India',
  'Gaya, Bihar, India',
  'Mumbai, Maharashtra',
  'Bengaluru, Karnataka',
  'New Delhi, India',
  'Kolkata, West Bengal',
  'Dubai, UAE',
  'Singapore'
];

const PRESET_MEDIA = [
  {
    type: 'photo' as const,
    url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1080&auto=format&fit=crop&q=80',
    title: 'Historic Ghats & Heritage'
  },
  {
    type: 'photo' as const,
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&auto=format&fit=crop&q=80',
    title: 'Bihar Sunset Valley'
  },
  {
    type: 'video' as const,
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1080&auto=format&fit=crop&q=80',
    title: 'Studio Beats & Lights'
  },
  {
    type: 'reel' as const,
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1080&auto=format&fit=crop&q=80',
    title: 'Night Concert Glow'
  }
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPostCreated
}) => {
  const [postType, setPostType] = useState<'photo' | 'video' | 'reel'>('photo');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '9:16'>('4:5');
  const [mediaUrl, setMediaUrl] = useState<string>(PRESET_MEDIA[0].url);
  const [caption, setCaption] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>('Patna, Bihar, India');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');

  // Music Integration State
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack | null>(MUSIC_CATALOG[0]);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [musicSearch, setMusicSearch] = useState('');
  const [musicVolume, setMusicVolume] = useState<number>(85);
  const [musicStartSec, setMusicStartSec] = useState<number>(0);
  const [previewingTrackId, setPreviewingTrackId] = useState<string | null>(null);

  // Hashtag input & autocomplete
  const [hashtagInput, setHashtagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#MediaSourceHub', '#Bihar', '#RanjeetKumar']);

  // Filter Preset
  const [filterPreset, setFilterPreset] = useState<'none' | 'vibrant' | 'cinema' | 'noir' | 'sunset' | 'cyberpunk'>('none');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      if (file.type.startsWith('video')) {
        setPostType('video');
      } else {
        setPostType('photo');
      }
    }
  };

  const handleTogglePlayMusic = (track: MusicTrack) => {
    if (previewingTrackId === track.id) {
      audioSynth.stop();
      setPreviewingTrackId(null);
    } else {
      setPreviewingTrackId(track.id);
      audioSynth.playTrack(track, () => setPreviewingTrackId(null));
    }
  };

  const handleAddHashtag = (tag: string) => {
    const clean = tag.startsWith('#') ? tag : `#${tag}`;
    if (!selectedTags.includes(clean)) {
      setSelectedTags([...selectedTags, clean]);
    }
    setHashtagInput('');
  };

  const handleRemoveHashtag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl) return;

    // Merge hashtags found in caption with selectedTags
    const captionTags = extractHashtags(caption);
    const combinedTags = Array.from(new Set([...selectedTags, ...captionTags]));

    const newPost: PostSchema = {
      id: `post-${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      type: postType,
      aspectRatio,
      mediaUrl,
      caption,
      hashtags: combinedTags,
      location: selectedLocation || undefined,
      musicTrack: selectedMusic || undefined,
      musicVolume,
      musicStartSec,
      filterPreset,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      comments: [],
      createdAt: 'Just now'
    };

    audioSynth.stop();
    onPostCreated(newPost);
    onClose();
  };

  const filteredMusicCatalog = MUSIC_CATALOG.filter(t =>
    t.title.toLowerCase().includes(musicSearch.toLowerCase()) ||
    t.artist.toLowerCase().includes(musicSearch.toLowerCase()) ||
    t.genre.toLowerCase().includes(musicSearch.toLowerCase())
  );

  const filteredLocations = POPULAR_LOCATIONS.filter(loc =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const hashtagSuggestions = getHashtagSuggestions(hashtagInput, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Create New Post / Reel</h3>
              <p className="text-xs text-slate-400">Share high-res media with background soundtrack & location</p>
            </div>
          </div>
          <button
            onClick={() => {
              audioSynth.stop();
              onClose();
            }}
            aria-label="Close creation modal"
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Left Column: Media Preview & Presets */}
          <div className="p-6 flex flex-col gap-4 bg-slate-950/40">
            {/* Post Format & Aspect Ratio Toggle */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setPostType('photo');
                    setAspectRatio('4:5');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    postType === 'photo' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPostType('reel');
                    setAspectRatio('9:16');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    postType === 'reel' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Reel (9:16)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('video')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    postType === 'video' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Video</span>
                </button>
              </div>

              {/* Aspect Ratio */}
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl text-xs">
                {(['1:1', '4:5', '9:16'] as const).map(ratio => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2 py-1 rounded-md font-mono ${
                      aspectRatio === ratio ? 'bg-slate-700 text-blue-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Media Preview Frame */}
            <div className="relative w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[320px] max-h-[380px] group shadow-inner">
              <img
                src={mediaUrl}
                alt="Upload preview"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  filterPreset === 'vibrant'
                    ? 'saturate-150 contrast-110'
                    : filterPreset === 'cinema'
                    ? 'contrast-125 sepia-[0.2] brightness-90'
                    : filterPreset === 'noir'
                    ? 'grayscale contrast-130'
                    : filterPreset === 'sunset'
                    ? 'sepia-[0.4] hue-rotate-[-15deg] saturate-130'
                    : filterPreset === 'cyberpunk'
                    ? 'hue-rotate-[180deg] saturate-150'
                    : ''
                }`}
              />

              {/* Sound overlay indicator on preview */}
              {selectedMusic && (
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white border border-white/20">
                  <Music className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  <span className="font-medium truncate max-w-[150px]">{selectedMusic.title}</span>
                  {previewingTrackId === selectedMusic.id && (
                    <span className="flex gap-0.5 items-end h-3">
                      <span className="w-0.5 bg-blue-400 wave-bar-anim" style={{ animationDelay: '0.1s' }} />
                      <span className="w-0.5 bg-blue-400 wave-bar-anim" style={{ animationDelay: '0.3s' }} />
                      <span className="w-0.5 bg-blue-400 wave-bar-anim" style={{ animationDelay: '0.2s' }} />
                    </span>
                  )}
                </div>
              )}

              {/* Location Badge on preview */}
              {selectedLocation && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-slate-200 border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span className="truncate max-w-[180px]">{selectedLocation}</span>
                </div>
              )}

              {/* Upload trigger button overlay */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-black/70 hover:bg-black/90 text-white text-xs font-semibold rounded-xl backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-colors shadow-lg"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace Media</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,video/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Quick Gallery Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Preset Media
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_MEDIA.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setMediaUrl(preset.url);
                      setPostType(preset.type);
                    }}
                    className={`relative rounded-xl overflow-hidden h-14 border-2 transition-all ${
                      mediaUrl === preset.url ? 'border-blue-500 scale-[1.02]' : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                    {preset.type === 'reel' && (
                      <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] px-1 rounded text-white font-bold">
                        9:16
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Visual Filter Style
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                {(['none', 'vibrant', 'cinema', 'sunset', 'noir', 'cyberpunk'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilterPreset(f)}
                    className={`px-3 py-1 rounded-xl capitalize shrink-0 border ${
                      filterPreset === f
                        ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 font-bold'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700/50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Audio, Location, Hashtags, Caption & Publish */}
          <div className="p-6 flex flex-col gap-4 overflow-y-auto">
            {/* Caption Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Post Caption & Thoughts
              </label>
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Write your story, tag friends, or add #MediaSourceHub #Bihar..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Background Music Integration Section */}
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200">Background Soundtrack</span>
                    <p className="text-[11px] text-slate-400">Pair songs to play with your post/reel</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMusicPicker(!showMusicPicker)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2.5 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20"
                >
                  {showMusicPicker ? 'Done' : 'Change Song'}
                </button>
              </div>

              {/* Selected Music Card */}
              {selectedMusic ? (
                <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={selectedMusic.coverUrl}
                      alt={selectedMusic.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{selectedMusic.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{selectedMusic.artist} • {selectedMusic.genre}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTogglePlayMusic(selectedMusic)}
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                      title={previewingTrackId === selectedMusic.id ? 'Pause' : 'Play Preview'}
                    >
                      {previewingTrackId === selectedMusic.id ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMusic(null)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowMusicPicker(true)}
                  className="w-full py-2.5 px-3 border border-dashed border-slate-700 hover:border-blue-500 rounded-xl text-xs text-slate-400 hover:text-blue-400 flex items-center justify-center gap-2 transition-colors"
                >
                  <Music className="w-4 h-4" />
                  <span>Choose Background Audio Track</span>
                </button>
              )}

              {/* Audio Volume & Trim Slider */}
              {selectedMusic && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Music Volume</span>
                      <span className="font-mono text-slate-300">{musicVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={musicVolume}
                      onChange={e => setMusicVolume(parseInt(e.target.value, 10))}
                      className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Start Trim</span>
                      <span className="font-mono text-slate-300">{musicStartSec}s</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      value={musicStartSec}
                      onChange={e => setMusicStartSec(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Music Search & Picker Drawer */}
              {showMusicPicker && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5 animate-in slide-in-from-top-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={musicSearch}
                      onChange={e => setMusicSearch(e.target.value)}
                      placeholder="Search songs, Bollywood, Bhojpuri, Lo-Fi..."
                      className="w-full bg-slate-950 pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="max-h-36 overflow-y-auto divide-y divide-slate-800/60 pr-1">
                    {filteredMusicCatalog.map(track => (
                      <div
                        key={track.id}
                        className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-colors ${
                          selectedMusic?.id === track.id ? 'bg-blue-600/20 text-blue-300' : 'hover:bg-slate-800/50 text-slate-300'
                        }`}
                      >
                        <div
                          className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                          onClick={() => {
                            setSelectedMusic(track);
                            setShowMusicPicker(false);
                          }}
                        >
                          <img src={track.coverUrl} alt={track.title} className="w-7 h-7 rounded object-cover" />
                          <div className="truncate">
                            <p className="font-medium truncate">{track.title}</p>
                            <span className="text-[10px] text-slate-500">{track.artist}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleTogglePlayMusic(track)}
                          className="p-1 rounded text-slate-400 hover:text-white"
                        >
                          {previewingTrackId === track.id ? (
                            <Pause className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <Play className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Location Tagging Section */}
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200">Location Tagging</span>
                    <p className="text-[11px] text-slate-400">Tag your city or landmark (Optional)</p>
                  </div>
                </div>

                {selectedLocation ? (
                  <button
                    type="button"
                    onClick={() => setSelectedLocation(null)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowLocationPicker(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    + Add Location
                  </button>
                )}
              </div>

              {selectedLocation && (
                <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-medium">{selectedLocation}</span>
                </div>
              )}

              {/* Location Picker Chips & Search */}
              {showLocationPicker && (
                <div className="space-y-2 pt-1 animate-in slide-in-from-top-1">
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={e => setLocationSearch(e.target.value)}
                    placeholder="Search locations (e.g. Bihar, Patna...)"
                    className="w-full bg-slate-900 px-3 py-1.5 text-xs rounded-lg border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {filteredLocations.map(loc => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setShowLocationPicker(false);
                        }}
                        className="text-[11px] px-2.5 py-1 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hashtag Support Section with Autocomplete */}
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200">Hashtag Suggestions</span>
                    <p className="text-[11px] text-slate-400">Boost discovery with trending tags</p>
                  </div>
                </div>
              </div>

              {/* Selected Hashtags Pills */}
              <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-blue-600/15 border border-blue-500/30 text-blue-300 text-xs px-2.5 py-0.5 rounded-full"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHashtag(tag)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Tag Input */}
              <div className="relative">
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={e => setHashtagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && hashtagInput.trim()) {
                      e.preventDefault();
                      handleAddHashtag(hashtagInput.trim());
                    }
                  }}
                  placeholder="Type a tag e.g. #Bihar, #Trending..."
                  className="w-full bg-slate-900 px-3 py-1.5 text-xs rounded-lg border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Trending suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {hashtagSuggestions.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddHashtag(tag)}
                    className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-blue-300 px-2 py-0.5 rounded-md transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish to Media Source Hub</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
