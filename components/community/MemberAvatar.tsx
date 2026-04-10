'use client';

import { useState } from 'react';
import { getInitials, stringToColor } from '@/lib/utils';

interface MemberAvatarProps {
  name: string;
  size?: number;
  avatarUrl?: string | null;
}

export function MemberAvatar({ name, size = 36, avatarUrl }: MemberAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const dicebearUrl = `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(name)}&backgroundColor=1a1a2e,0f0f1a,111827`;

  const src = avatarUrl && !imgError ? avatarUrl : (!imgError ? dicebearUrl : null);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          background: stringToColor(name),
        }}
      />
    );
  }

  // Fallback: initials
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: stringToColor(name),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: 600,
        color: '#FFFFFF',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {getInitials(name)}
    </div>
  );
}
