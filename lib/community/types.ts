export type PostType = 'benchmark' | 'beta' | 'educacion' | 'evento' | 'discusion' | 'anuncio';
export type MemberLevel = 'invisible' | 'visible' | 'referente' | 'embajador';

export interface CommunityMember {
  id: string;
  clerk_user_id: string;
  email: string;
  name: string;
  company: string | null;
  job_title: string | null;
  country: string | null;
  linkedin_url: string | null;
  bio: string | null;
  points: number;
  level: MemberLevel;
  invite_code_used: string | null;
  is_founder: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  author_name: string;
  author_company: string | null;
  author_is_founder: boolean;
  title: string;
  body: string;
  post_type: PostType;
  is_pinned: boolean;
  is_published: boolean;
  views: number;
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  parent_id: string | null;
  body: string;
  created_at: string;
  replies?: Comment[];
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  category: string;
  level: string;
  duration_min: number | null;
  vimeo_id: string | null;
  thumbnail_url: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

export interface InviteCode {
  id: string;
  code: string;
  created_by: string | null;
  max_uses: number;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
}
