/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { FeedView } from './components/FeedView';
import { ReelsView } from './components/ReelsView';
import { SecretChatView } from './components/SecretChatView';
import { LiveStreamView } from './components/LiveStreamView';
import { ProfileView } from './components/ProfileView';
import { CreatePostModal } from './components/CreatePostModal';
import { RazorpayModal } from './components/RazorpayModal';
import { CallModal } from './components/CallModal';
import { AuthModal } from './components/AuthModal';
import { UserSchema, PostSchema } from './types/schemas';
import { OWNER_USER, INITIAL_POSTS, DEMO_USERS } from './utils/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'feed' | 'reels' | 'chat' | 'live' | 'profile'>('feed');
  const [currentUser, setCurrentUser] = useState<UserSchema>(OWNER_USER);
  const [posts, setPosts] = useState<PostSchema[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Call State
  const [callConfig, setCallConfig] = useState<{
    isOpen: boolean;
    type: 'audio' | 'video';
    targetUser: UserSchema;
  }>({
    isOpen: false,
    type: 'video',
    targetUser: DEMO_USERS[1]
  });

  const handlePostCreated = (newPost: PostSchema) => {
    setPosts(prev => [newPost, ...prev]);
    // If it's a reel, switch to reels tab, otherwise feed tab
    if (newPost.type === 'reel') {
      setCurrentTab('reels');
    } else {
      setCurrentTab('feed');
    }
  };

  const handleLikeToggle = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
          };
        }
        return p;
      })
    );
  };

  const handleBookmarkToggle = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, isBookmarked: !p.isBookmarked };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const newComment = {
            id: `comm-${Date.now()}`,
            userId: currentUser.id,
            user: {
              id: currentUser.id,
              name: currentUser.name,
              username: currentUser.username,
              avatar: currentUser.avatar,
              isVerified: currentUser.isVerified
            },
            text,
            createdAt: 'Just now',
            likesCount: 0
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...(p.comments || []), newComment]
          };
        }
        return p;
      })
    );
  };

  const handleVerificationSuccess = (updatedUser: UserSchema) => {
    setCurrentUser(updatedUser);
    // Update posts made by this user to immediately reflect the blue checkmark
    setPosts(prev =>
      prev.map(p => {
        if (p.userId === updatedUser.id) {
          return {
            ...p,
            user: { ...p.user, isVerified: true }
          };
        }
        return p;
      })
    );
  };

  const handleInitiateCall = (type: 'audio' | 'video', targetUser: UserSchema) => {
    setCallConfig({
      isOpen: true,
      type,
      targetUser
    });
  };

  // Filter posts based on search query (tag, location, text)
  const filteredPosts = posts.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesCaption = p.caption.toLowerCase().includes(q);
    const matchesLocation = p.location?.toLowerCase().includes(q);
    const matchesTags = p.hashtags?.some(t => t.toLowerCase().includes(q));
    const matchesUser = p.user.name.toLowerCase().includes(q) || p.user.username.toLowerCase().includes(q);
    return matchesCaption || matchesLocation || matchesTags || matchesUser;
  });

  const reelsList = filteredPosts.filter(p => p.type === 'reel' || p.aspectRatio === '9:16');
  // Fallback to all posts if no 9:16 reels found in search
  const effectiveReels = reelsList.length > 0 ? reelsList : filteredPosts;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top and Bottom Navigation Shell */}
      <Navigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenRazorpayModal={() => setIsRazorpayModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {currentTab === 'feed' && (
          <FeedView
            posts={filteredPosts}
            currentUser={currentUser}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onAddComment={handleAddComment}
            onTagClick={tag => setSearchQuery(tag)}
            onOpenRazorpayModal={() => setIsRazorpayModalOpen(true)}
          />
        )}

        {currentTab === 'reels' && (
          <ReelsView
            reels={effectiveReels}
            currentUser={currentUser}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onTagClick={tag => setSearchQuery(tag)}
            onOpenRazorpayModal={() => setIsRazorpayModalOpen(true)}
          />
        )}

        {currentTab === 'chat' && (
          <div className="h-[calc(100vh-140px)] max-h-[820px]">
            <SecretChatView
              currentUser={currentUser}
              onInitiateCall={handleInitiateCall}
            />
          </div>
        )}

        {currentTab === 'live' && (
          <LiveStreamView
            currentUser={currentUser}
            onOpenRazorpayModal={() => setIsRazorpayModalOpen(true)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={currentUser}
            userPosts={posts.filter(p => p.userId === currentUser.id)}
            onOpenRazorpayModal={() => setIsRazorpayModalOpen(true)}
            onSwitchUser={user => setCurrentUser(user)}
          />
        )}
      </main>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        onPostCreated={handlePostCreated}
      />

      <RazorpayModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        currentUser={currentUser}
        onVerificationSuccess={handleVerificationSuccess}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={user => setCurrentUser(user)}
      />

      <CallModal
        isOpen={callConfig.isOpen}
        onClose={() => setCallConfig(prev => ({ ...prev, isOpen: false }))}
        callType={callConfig.type}
        targetUser={callConfig.targetUser}
        currentUser={currentUser}
      />
    </div>
  );
}
