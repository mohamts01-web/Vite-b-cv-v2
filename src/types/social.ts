export interface SocialPost {
  id: string;
  user_id: string;
  occasion_type: string;
  sender_name: string;
  recipient_name: string;
  message: string;
  style: SocialStyle;
  colors: string[];
  template_data: Record<string, any>;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export type SocialStyle = 'luxury' | 'fun' | 'minimal' | 'islamic' | 'romantic' | 'modern';

export interface SocialTemplate {
  id: string;
  name: string;
  occasion_type: string;
  style: SocialStyle;
  is_premium: boolean;
  thumbnail_url?: string;
  template_config: TemplateConfig;
  created_at: string;
}

export interface TemplateConfig {
  background?: string;
  textLayers: TextLayer[];
  decorations?: Decoration[];
}

export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  align: 'right' | 'center' | 'left';
  bold?: boolean;
}

export interface Decoration {
  id: string;
  type: 'shape' | 'pattern' | 'image';
  src?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SocialDesign {
  id: string;
  user_id: string;
  post_id: string;
  title: string;
  canvas_data: CanvasData;
  shareable_code: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CanvasData {
  width: number;
  height: number;
  background: string;
  layers: Layer[];
}

export interface Layer {
  id: string;
  type: 'text' | 'image' | 'shape';
  data: any;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
}

export const OCCASION_TYPES = [
  { value: 'eid', label: 'عيد', labelEn: 'Eid' },
  { value: 'graduation', label: 'تخرج', labelEn: 'Graduation' },
  { value: 'wedding', label: 'زواج', labelEn: 'Wedding' },
  { value: 'birthday', label: 'عيد ميلاد', labelEn: 'Birthday' },
  { value: 'ramadan', label: 'رمضان', labelEn: 'Ramadan' },
  { value: 'engagement', label: 'خطوبة', labelEn: 'Engagement' },
  { value: 'newborn', label: 'مولود جديد', labelEn: 'Newborn' },
  { value: 'promotion', label: 'ترقية', labelEn: 'Promotion' },
  { value: 'other', label: 'أخرى', labelEn: 'Other' },
];

export const STYLE_OPTIONS = [
  { value: 'luxury', label: 'فاخر', labelEn: 'Luxury' },
  { value: 'fun', label: 'مرح', labelEn: 'Fun' },
  { value: 'minimal', label: 'بسيط', labelEn: 'Minimal' },
  { value: 'islamic', label: 'إسلامي', labelEn: 'Islamic' },
  { value: 'romantic', label: 'رومانسي', labelEn: 'Romantic' },
  { value: 'modern', label: 'عصري', labelEn: 'Modern' },
];

export const COLOR_PALETTES = {
  desertGold: ['#D4AF37', '#C9A05C', '#F5E6D3', '#8B7355', '#DEB887'],
  islamicGreen: ['#006341', '#00A86B', '#D4E7C5', '#808000', '#3CB371'],
  royalBlue: ['#002147', '#4169E1', '#E0EFFF', '#000080', '#1E90FF'],
  elegantPurple: ['#4B0082', '#9370DB', '#E6E6FA', '#663399', '#DA70D6'],
  romanticPink: ['#FF69B4', '#FFC0CB', '#FFE4E1', '#FF1493', '#DB7093'],
  modernNeutral: ['#2C3E50', '#34495E', '#ECF0F1', '#95A5A6', '#7F8C8D'],
};
