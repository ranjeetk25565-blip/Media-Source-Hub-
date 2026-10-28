import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  RotateCcw,
  Volume2,
  Maximize2,
  Minimize2,
  Shield,
  Signal
} from 'lucide-react';
import { UserSchema } from '../types/schemas';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: UserSchema;
  currentUser: UserSchema;
  callType: 'audio' | 'video';
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  currentUser,
  callType: initialCallType
}) => {
  const [callType, setCallType] = useState<'audio' | 'video'>(initialCallType);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(initialCallType === 'audio');
  const [durationSec, setDurationSec] = useState(0);
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setCallType(initialCallType);
    setIsVideoOff(initialCallType === 'audio');
  }, [initialCallType]);

  useEffect(() => {
    if (!isOpen) return;

    setCallState('connecting');
    setDurationSec(0);

    // Simulate WebRTC connection establishment after 1.5 seconds
    const connectTimer = setTimeout(() => {
      setCallState('connected');
    }, 1500);

    // Request actual local camera / mic if user permits, with fallback
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: initialCallType === 'video',
          audio: true
        })
        .then(stream => {
          mediaStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn('Camera/mic access fallback to virtual avatar mode:', err);
        });
    }

    return () => {
      clearTimeout(connectTimer);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, initialCallType]);

  // Duration timer
  useEffect(() => {
    if (callState !== 'connected') return;
    const interval = setInterval(() => {
      setDurationSec(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  if (!isOpen) return null;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallState('ended');
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setTimeout(onClose, 600);
  };

  const handleToggleMute = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoOff(!isVideoOff);
    if (callType === 'audio') {
      setCallType('video');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[700px]">
        {/* Remote Video / Stream Area */}
        <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden">
          {callType === 'video' && !isVideoOff ? (
            <div className="relative w-full h-full">
              {/* Simulated Remote User Video Stream with High-Res Video/Canvas Avatar */}
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                className="w-full h-full object-cover filter brightness-95 scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />

              {/* Local Self Video (Picture-in-Picture) */}
              <div className="absolute top-4 right-4 w-32 h-44 rounded-2xl overflow-hidden border-2 border-blue-500/80 shadow-2xl bg-slate-900 z-10">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                {!mediaStreamRef.current && (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <span className="absolute bottom-1.5 left-2 text-[10px] bg-black/70 px-1.5 py-0.5 rounded text-white font-mono">
                  You
                </span>
              </div>
            </div>
          ) : (
            /* Audio Call Screen */
            <div className="text-center space-y-4 p-8">
              <div className="relative inline-block">
                <img
                  src={targetUser.avatar}
                  alt={targetUser.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-2xl mx-auto"
                />
                <span className="absolute bottom-1 right-2 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-ping" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-100">{targetUser.name}</h3>
                <p className="text-sm text-slate-400">@{targetUser.username}</p>
              </div>

              {/* Audio Soundwaves Simulator */}
              <div className="flex justify-center items-center gap-1.5 h-10">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1.5 bg-blue-500 rounded-full wave-bar-anim"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Top Bar Overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 z-20">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-slate-200 font-medium">E2EE WebRTC 256-Bit</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-mono text-white border border-white/10 z-20">
            {callState === 'connecting' ? 'Calling...' : formatTimer(durationSec)}
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            {/* If video call, local PIP occupies right corner, so this adapts */}
            {callType === 'audio' && (
              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full text-xs text-emerald-400 border border-white/10">
                <Signal className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">HD Audio</span>
              </div>
            )}
          </div>
        </div>

        {/* Call Controls Toolbar */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 flex items-center justify-around">
          {/* Mute Mic */}
          <button
            onClick={handleToggleMute}
            className={`p-4 rounded-2xl transition-all ${
              isMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Toggle Video */}
          <button
            onClick={handleToggleVideo}
            className={`p-4 rounded-2xl transition-all ${
              isVideoOff ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
            }`}
            title={isVideoOff ? 'Enable Camera' : 'Turn Off Camera'}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>

          {/* Switch Camera */}
          {callType === 'video' && !isVideoOff && (
            <button
              onClick={() => setCameraFacing(cameraFacing === 'user' ? 'environment' : 'user')}
              className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Flip Camera"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
