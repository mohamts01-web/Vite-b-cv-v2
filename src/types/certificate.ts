export interface Certificate {
  id: string;
  user_id: string;
  recipient_name: string;
  course_name: string;
  hours?: string;
  issue_date: string;
  template_id: string;
  serial_number: string;
  verification_code: string;
  pdf_url?: string;
  logo_url?: string;
  signature_url?: string;
  created_at: string;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  html_template: string;
  is_premium: boolean;
  thumbnail_url?: string;
  created_at: string;
}

export interface CertificateFormData {
  recipient_name: string;
  course_name: string;
  hours?: string;
  issue_date: string;
  template_id: string;
  logo?: File;
  signature?: File;
}

export interface CertificateVerification {
  valid: boolean;
  certificate?: Certificate;
  message: string;
}
