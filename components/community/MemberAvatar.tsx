import { getInitials, stringToColor } from '@/lib/utils';

interface MemberAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function MemberAvatar({ name, size = 36 }: MemberAvatarProps) {
  const bg = stringToColor(name);
  const initials = getInitials(name);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
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
      {initials}
    </div>
  );
}
