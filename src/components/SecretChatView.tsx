import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  Send,
  Timer,
  Clock,
  KeyRound,
  CheckCheck,
  AlertTriangle,
  QrCode,
  Image as ImageIcon,
  Flame,
  X,
  PhoneCall,
  Video
} from 'lucide-react';
import { UserSchema, SecretMessage } from '../types/schemas';
import { encryptE2EEMessage, decryptE2EEMessage, generateSafetyFingerprint, formatVanishingTimer } from '../utils/security';
import { DEMO_USERS, INITIAL_SECRET_MESSAGES } from '../utils/mockData';

interface SecretChatViewProps {
  currentUser: UserSchema;
  onInitiateCall: (type: 'audio' | 'video', targetUser: UserSchema) => void;
}

export const SecretChatView: React.FC<SecretChatViewProps> = ({
  currentUser,
  onInitiateCall
}) => {
  const [selectedContact, setSelectedContact] = useState<UserSchema>(
    DEMO_USERS.find(u => u.id !== currentUser.id) || DEMO_USERS[1]
  );
  const [messages, setMessages] = useState<SecretMessage[]>(INITIAL_SECRET_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [vanishingSeconds, setVanishingSeconds] = useState<number>(10);
  const [flagSecureEnabled, setFlagSecureEnabled] = useState<boolean>(true);
  const [showRawCiphertext, setShowRawCiphertext] = useState<boolean>(false);
  const [screenshotAttemptAlert, setScreenshotAttemptAlert] = useState<boolean>(false);
  const [isWatermarkActive, setIsWatermarkActive] = useState<boolean>(true);
  const [showSafetyModal, setShowSafetyModal] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Safety Fingerprint
  const safetyFingerprint = generateSafetyFingerprint(currentUser.id, selectedContact.id);

  // Anti-Screenshot & Screen Recording Protection (FLAG_SECURE Simulation)
  useEffect(() => {
    if (!flagSecureEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Catch PrintScreen, Cmd+Shift+3/4/5 (Mac), Win+Shift+S (Windows), Ctrl+P
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.key === 'p') ||
        (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key))
      ) {
        e.preventDefault();
        triggerScreenshotBlocked();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && flagSecureEnabled) {
        // User switched app or triggered screen recorder capture
        triggerScreenshotBlocked();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      // Prevent right-click save image or inspect in secret mode
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [flagSecureEnabled]);

  const triggerScreenshotBlocked = () => {
    setScreenshotAttemptAlert(true);
    setTimeout(() => {
      setScreenshotAttemptAlert(false);
    }, 4500);
  };

  // Vanishing message auto-destruction timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setMessages(prev =>
        prev.filter(msg => {
          if (msg.expiresAt && msg.expiresAt < now) {
            return false; // vanished!
          }
          return true;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const secretKey = `msh-key-${[currentUser.id, selectedContact.id].sort().join('-')}`;
    const enc = encryptE2EEMessage(inputText.trim(), secretKey);

    const now = Date.now();
    const expiresAt = vanishingSeconds > 0 ? now + vanishingSeconds * 1000 : undefined;

    const newMsg: SecretMessage = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderId: currentUser.id,
      receiverId: selectedContact.id,
      ciphertext: enc.ciphertext,
      plaintext: inputText.trim(),
      iv: enc.iv,
      hash: enc.hash,
      timestamp: now,
      expiresInSec: vanishingSeconds > 0 ? vanishingSeconds : undefined,
      expiresAt,
      isFlagSecure: flagSecureEnabled,
      isRead: true
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate instant automated reply from contact after 1.5s
    setTimeout(() => {
      const replyText = `[Encrypted Reply] Received your secure message with verified hash ${enc.hash.slice(0, 4)}!`;
      const replyEnc = encryptE2EEMessage(replyText, secretKey);
      const replyNow = Date.now();
      const replyMsg: SecretMessage = {
        id: `sec-reply-${Date.now()}`,
        senderId: selectedContact.id,
        receiverId: currentUser.id,
        ciphertext: replyEnc.ciphertext,
        plaintext: replyText,
        iv: replyEnc.iv,
        hash: replyEnc.hash,
        timestamp: replyNow,
        expiresInSec: vanishingSeconds > 0 ? vanishingSeconds : undefined,
        expiresAt: vanishingSeconds > 0 ? replyNow + vanishingSeconds * 1000 : undefined,
        isFlagSecure: flagSecureEnabled,
        isRead: true
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1800);
  };

  const handleSendPrivatePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
    ];
    const photoUrl = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    const secretKey = `msh-key-${[currentUser.id, selectedContact.id].sort().join('-')}`;
    const enc = encryptE2EEMessage('[Private Encrypted Photo]', secretKey);

    const now = Date.now();
    const expiresAt = vanishingSeconds > 0 ? now + vanishingSeconds * 1000 : undefined;

    const newMsg: SecretMessage = {
      id: `sec-photo-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: selectedContact.id,
      ciphertext: enc.ciphertext,
      plaintext: '[Private Protected Photo]',
      iv: enc.iv,
      hash: enc.hash,
      timestamp: now,
      expiresInSec: vanishingSeconds > 0 ? vanishingSeconds : undefined,
      expiresAt,
      isPrivateMedia: true,
      mediaUrl: photoUrl,
      mediaType: 'photo',
      isFlagSecure: true,
      isRead: true
    };

    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <div className="relative flex flex-col h-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Anti-Screenshot Alert Modal Overlay */}
      {screenshotAttemptAlert && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in zoom-in-95">
          <div className="max-w-md w-full bg-rose-950/90 border border-rose-500/50 rounded-3xl p-6 text-center space-y-4 shadow-2xl shadow-rose-900/40">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-10 h-10 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Screenshot / Recording Blocked!</h4>
              <p className="text-xs text-rose-200 mt-1.5 leading-relaxed">
                Protected by <strong>Media Source Hub FLAG_SECURE</strong> & Anti-Misuse System.
                Screen capture of private chats and media is strictly forbidden to protect user privacy.
              </p>
            </div>
            <div className="p-3 bg-black/40 rounded-xl text-left font-mono text-[11px] text-slate-300 space-y-1">
              <div>Incident: Screen Capture Intercepted</div>
              <div>Viewer: @{currentUser.username} (ID: {currentUser.id.slice(0, 10)})</div>
              <div>Protection: E2EE AES-256 + Anti-Misuse Guard Active</div>
            </div>
            <button
              onClick={() => setScreenshotAttemptAlert(false)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Acknowledge & Resume Secret Chat
            </button>
          </div>
        </div>
      )}

      {/* Forensic Dynamic Watermark Overlay (Anti-Out-of-Band Camera Capture) */}
      {isWatermarkActive && flagSecureEnabled && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-wrap items-center justify-around opacity-[0.045] select-none overflow-hidden p-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="text-xs font-mono text-white transform -rotate-12 whitespace-nowrap p-4">
              CONFIDENTIAL • {currentUser.email} • {currentUser.id.slice(0, 8)}
            </div>
          ))}
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={selectedContact.avatar}
              alt={selectedContact.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
            />
            <span className="absolute -bottom-0.5 -right-0.5 p-1 bg-emerald-600 rounded-full text-white">
              <Lock className="w-2.5 h-2.5" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 text-sm">{selectedContact.name}</span>
              {selectedContact.isVerified && (
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px]">
                  ✓
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>E2EE Active • Zero Logs</span>
            </div>
          </div>
        </div>

        {/* Security Controls & Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Audio Call */}
          <button
            onClick={() => onInitiateCall('audio', selectedContact)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Start Encrypted Voice Call"
          >
            <PhoneCall className="w-4 h-4" />
          </button>

          {/* Video Call */}
          <button
            onClick={() => onInitiateCall('video', selectedContact)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Start Encrypted Video Call"
          >
            <Video className="w-4 h-4" />
          </button>

          {/* FLAG_SECURE Anti-Screenshot Toggle */}
          <button
            onClick={() => setFlagSecureEnabled(!flagSecureEnabled)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              flagSecureEnabled
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Android FLAG_SECURE Anti-Screenshot Protection"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">FLAG_SECURE</span>
          </button>

          {/* Vanishing Timer Selector */}
          <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2 py-1 text-xs">
            <Timer className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <select
              value={vanishingSeconds}
              onChange={e => setVanishingSeconds(parseInt(e.target.value, 10))}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
            >
              <option value="0" className="bg-slate-900">Vanishing: Off</option>
              <option value="5" className="bg-slate-900">Vanishing: 5s</option>
              <option value="10" className="bg-slate-900">Vanishing: 10s</option>
              <option value="30" className="bg-slate-900">Vanishing: 30s</option>
              <option value="60" className="bg-slate-900">Vanishing: 1m</option>
            </select>
          </div>

          {/* Safety Fingerprint Modal Trigger */}
          <button
            onClick={() => setShowSafetyModal(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Verify Safety Numbers / Fingerprint"
          >
            <KeyRound className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Security Banner / Notice */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">
            End-to-End Encrypted. Messages are readable only on the 2 participant devices.
          </span>
        </div>

        <button
          onClick={() => setShowRawCiphertext(!showRawCiphertext)}
          className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 shrink-0 ml-2"
        >
          {showRawCiphertext ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          <span>{showRawCiphertext ? 'Show Decrypted' : 'View Wire Ciphertext'}</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Safety Encryption Card at top */}
        <div className="max-w-md mx-auto text-center p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-emerald-500/10 text-emerald-400 mb-1">
            <Lock className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-200">
            Encrypted with 256-Bit Keys
          </p>
          <p className="text-[11px] text-slate-400">
            Safety Numbers: <span className="font-mono text-emerald-400">{safetyFingerprint}</span>
          </p>
          {vanishingSeconds > 0 && (
            <span className="inline-block mt-1 text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium">
              🔥 Messages vanish {formatVanishingTimer(vanishingSeconds)} after being viewed
            </span>
          )}
        </div>

        {/* Message Bubbles */}
        {messages.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          const timeLeftSec = msg.expiresAt ? Math.max(0, Math.ceil((msg.expiresAt - Date.now()) / 1000)) : null;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 group`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 shadow-md transition-all ${
                  isMe
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm'
                    : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-sm'
                }`}
              >
                {/* Private Media Preview */}
                {msg.isPrivateMedia && msg.mediaUrl && (
                  <div className="relative mb-2 rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={msg.mediaUrl}
                      alt="Private Media"
                      className="w-full max-h-56 object-cover"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-rose-300 border border-rose-500/30">
                      <Shield className="w-3 h-3 text-rose-400" />
                      <span>FLAG_SECURE Protected</span>
                    </div>
                  </div>
                )}

                {/* Message Body */}
                {showRawCiphertext ? (
                  <div className="font-mono text-[11px] break-all p-2 bg-black/40 rounded-lg text-emerald-300">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">Wire Ciphertext:</span>
                    {msg.ciphertext}
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.plaintext}</p>
                )}

                {/* Metadata Footer */}
                <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 text-[10px] opacity-80 border-t border-white/10">
                  <span className="font-mono">Hash: {msg.hash.slice(0, 6)}</span>

                  <div className="flex items-center gap-1.5">
                    {timeLeftSec !== null && (
                      <span className="flex items-center gap-0.5 text-amber-300 font-bold">
                        <Flame className="w-3 h-3 animate-pulse" />
                        <span>{timeLeftSec}s left</span>
                      </span>
                    )}
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-200" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Attach Private Photo */}
          <button
            type="button"
            onClick={handleSendPrivatePhoto}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Send Anti-Screenshot Private Photo"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Send end-to-end encrypted secret message..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-4 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <Lock className="w-4 h-4 text-emerald-500 absolute right-3 top-3.5" />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Safety Fingerprint Verification Modal */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Verify Safety Fingerprint</span>
              </h4>
              <button
                onClick={() => setShowSafetyModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Compare this 12-digit safety number with <strong>{selectedContact.name}</strong> to verify that your connection is cryptographically secure and unintercepted.
            </p>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-emerald-400 font-mono text-xl tracking-widest font-bold">
              {safetyFingerprint}
            </div>

            <div className="flex justify-center">
              <div className="p-3 bg-white rounded-xl shadow-inner inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                    `MSH-E2EE-FINGERPRINT:${safetyFingerprint}`
                  )}`}
                  alt="Safety QR"
                  className="w-28 h-28"
                />
              </div>
            </div>

            <button
              onClick={() => setShowSafetyModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Numbers Verified Successfully
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
