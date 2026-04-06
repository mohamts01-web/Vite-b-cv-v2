import { useState } from 'react';
import { ArrowLeft, Sparkles, Eye, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CertificateFormData } from '../../types/certificate';
import { getCurrentUserProfile } from '../../services/creditService';

interface CreateCertificateProps {
  onNavigate: (page: string) => void;
}

const CERTIFICATE_TEMPLATES = [
  {
    id: 'classic',
    name: 'كلاسيكي',
    color: 'from-amber-100 to-amber-50',
    borderColor: '#d4af37',
    textColor: '#1e3a8a',
  },
  {
    id: 'modern',
    name: 'عصري',
    color: 'from-blue-100 to-blue-50',
    borderColor: '#2563eb',
    textColor: '#0c4a6e',
  },
  {
    id: 'elegant',
    name: 'أنيق',
    color: 'from-slate-900 to-slate-800',
    borderColor: '#d4af37',
    textColor: '#ffffff',
  },
];

export default function CreateCertificate({ onNavigate }: CreateCertificateProps) {
  const [formData, setFormData] = useState<CertificateFormData>({
    recipient_name: '',
    course_name: '',
    hours: '',
    issue_date: new Date().toISOString().split('T')[0],
    template_id: 'classic',
  });
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [saved, setSaved] = useState(false);
  const [credits, setCredits] = useState(0);

  useState(() => {
    loadCredits();
  });

  async function loadCredits() {
    try {
      const profile = await getCurrentUserProfile();
      if (profile) {
        setCredits(profile.credits_balance);
      }
    } catch (error) {
      console.error('Error loading credits:', error);
    }
  }

  const updateField = (field: keyof CertificateFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateCertificate = async () => {
    if (!formData.recipient_name || !formData.course_name || !formData.issue_date) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setGenerating(true);

    try {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
      const serial_number = `CERT-${year}-${random}`;
      const verification_code = Math.random().toString(36).substring(2, 14).toUpperCase();

      const certificateHTML = generateCertificateHTML(
        formData.recipient_name,
        formData.course_name,
        formData.hours || '',
        formData.issue_date,
        serial_number,
        verification_code,
        formData.template_id
      );

      const response = await fetch('https://cv-pdf-service-production-a4a4.up.railway.app/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: certificateHTML }),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);

      const { data, error } = await supabase
        .from('certificates')
        .insert([
          {
            recipient_name: formData.recipient_name,
            course_name: formData.course_name,
            hours: formData.hours,
            issue_date: formData.issue_date,
            template_id: formData.template_id,
            serial_number,
            verification_code,
            pdf_url: pdfUrl,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setSaved(true);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `certificate-${serial_number}.pdf`;
      link.click();

      setTimeout(() => {
        onNavigate('certificates-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('حدث خطأ أثناء إنشاء الشهادة');
    } finally {
      setGenerating(false);
    }
  };

  const generateCertificateHTML = (
    recipientName: string,
    courseName: string,
    hours: string,
    issueDate: string,
    serialNumber: string,
    verificationCode: string,
    templateId: string
  ) => {
    const template = CERTIFICATE_TEMPLATES.find(t => t.id === templateId) || CERTIFICATE_TEMPLATES[0];

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 landscape;
      margin: 2cm;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 29.7cm;
      height: 21cm;
      padding: 2cm;
      direction: rtl;
      font-family: 'Cairo', 'Tajawal', sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .certificate {
      width: 100%;
      height: 100%;
      background: ${templateId === 'elegant' ? '#1e293b' : 'white'};
      border: 15px solid ${template.borderColor};
      border-radius: 20px;
      padding: 3cm;
      position: relative;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .ornament {
      position: absolute;
      width: 150px;
      height: 150px;
      border: 3px solid ${template.borderColor};
      border-radius: 50%;
    }

    .ornament.top-right { top: 20px; right: 20px; }
    .ornament.bottom-left { bottom: 20px; left: 20px; }

    .header {
      text-align: center;
      margin-bottom: 2cm;
    }

    .title {
      font-size: 48px;
      font-weight: 900;
      color: ${template.textColor};
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 3px;
    }

    .subtitle {
      font-size: 20px;
      color: ${templateId === 'elegant' ? '#cbd5e1' : '#64748b'};
      font-weight: 500;
    }

    .content {
      text-align: center;
      margin: 2cm 0;
    }

    .label {
      font-size: 18px;
      color: ${templateId === 'elegant' ? '#e2e8f0' : '#475569'};
      margin-bottom: 15px;
    }

    .recipient-name {
      font-size: 56px;
      font-weight: 700;
      color: ${template.textColor};
      margin: 20px 0;
      border-bottom: 3px solid ${template.borderColor};
      display: inline-block;
      padding-bottom: 10px;
    }

    .course-info {
      font-size: 24px;
      color: ${templateId === 'elegant' ? '#cbd5e1' : '#334155'};
      margin: 30px 0;
      line-height: 1.8;
    }

    .course-name {
      font-weight: 700;
      color: ${template.textColor};
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 2cm;
    }

    .qr-section {
      text-align: center;
    }

    .signature-section {
      text-align: center;
    }

    .signature-line {
      width: 200px;
      height: 2px;
      background: ${templateId === 'elegant' ? '#64748b' : '#cbd5e1'};
      margin: 10px auto;
    }

    .serial {
      font-size: 14px;
      color: ${templateId === 'elegant' ? '#94a3b8' : '#64748b'};
      font-family: monospace;
      text-align: center;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="ornament top-right"></div>
    <div class="ornament bottom-left"></div>

    <div class="header">
      <div class="title">شهادة تقدير</div>
      <div class="subtitle">Certificate of Appreciation</div>
    </div>

    <div class="content">
      <div class="label">تُمنح هذه الشهادة إلى</div>
      <div class="recipient-name">${recipientName}</div>

      <div class="course-info">
        وذلك لإتمامه/ها بنجاح دورة<br>
        <span class="course-name">${courseName}</span>
        ${hours ? `<br>بعدد ساعات تدريبية: <strong>${hours}</strong> ساعة` : ''}
      </div>

      <div class="label">
        تاريخ الإصدار: ${new Date(issueDate).toLocaleDateString('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>

    <div class="footer">
      <div class="qr-section">
        <div style="font-size: 12px; color: ${templateId === 'elegant' ? '#94a3b8' : '#64748b'};">رمز التحقق</div>
        <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: ${template.textColor}; margin-top: 5px;">
          ${verificationCode}
        </div>
      </div>

      <div class="signature-section">
        <div style="font-size: 14px; color: ${templateId === 'elegant' ? '#cbd5e1' : '#64748b'}; margin-bottom: 40px;">التوقيع</div>
        <div class="signature-line"></div>
        <div style="font-size: 12px; color: ${templateId === 'elegant' ? '#94a3b8' : '#64748b'}; margin-top: 5px;">المدير العام</div>
      </div>
    </div>

    <div class="serial">
      الرقم التسلسلي: ${serialNumber}
    </div>
  </div>
</body>
</html>`;
  };

  if (saved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-emerald-100 p-3 rounded-full">
              <CheckCircle className="w-16 h-16 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">تم الحفظ بنجاح!</h2>
          <p className="text-slate-600">تم إنشاء الشهادة وتنزيلها بنجاح. جاري إعادة التوجيه...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50" dir="rtl">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('certificates-dashboard')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>رجوع</span>
            </button>
            <h1 className="text-2xl font-bold text-slate-900">إنشاء شهادة جديدة</h1>
            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-amber-700">النقاط: <span className="font-bold">{credits}</span></span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">اختر القالب</h3>
              <div className="space-y-3">
                {CERTIFICATE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => updateField('template_id', template.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-right ${
                      formData.template_id === template.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">{template.name}</span>
                      <div className={`w-8 h-8 rounded border-2 ${
                        formData.template_id === template.id
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-slate-300'
                      }`}>
                        {formData.template_id === template.id && (
                          <CheckCircle className="w-full h-full text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  اسم المتدرب *
                </label>
                <input
                  type="text"
                  value={formData.recipient_name}
                  onChange={(e) => updateField('recipient_name', e.target.value)}
                  placeholder="أحمد محمد علي"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  اسم الدورة *
                </label>
                <input
                  type="text"
                  value={formData.course_name}
                  onChange={(e) => updateField('course_name', e.target.value)}
                  placeholder="دورة البرمجة المتقدمة"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  الساعات (اختياري)
                </label>
                <input
                  type="text"
                  value={formData.hours || ''}
                  onChange={(e) => updateField('hours', e.target.value)}
                  placeholder="30"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  تاريخ الإصدار *
                </label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => updateField('issue_date', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-800 leading-relaxed">
                <span className="font-semibold">ملاحظة:</span> سيتم إنشاء رقم تسلسلي وكود تحقق فريد تلقائياً لكل شهادة. الخطوط تدعم العربية بالكامل.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all text-sm"
              >
                <Eye className="w-4 h-4" />
                معاينة
              </button>

              <button
                onClick={generateCertificate}
                disabled={generating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    إنشاء وتنزيل
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            {showPreview && (
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                <h3 className="text-lg font-bold text-slate-900 mb-4">معاينة مباشرة</h3>
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-12 flex items-center justify-center min-h-96">
                  {formData.recipient_name && formData.course_name ? (
                    <div className="w-full bg-white rounded-lg border-4" style={{ borderColor: CERTIFICATE_TEMPLATES.find(t => t.id === formData.template_id)?.borderColor }}>
                      <div className="p-8 text-center space-y-4">
                        <div className="text-3xl font-bold" style={{ color: CERTIFICATE_TEMPLATES.find(t => t.id === formData.template_id)?.textColor }}>
                          شهادة تقدير
                        </div>
                        <div className="text-sm text-slate-600">تُمنح هذه الشهادة إلى</div>
                        <div className="text-4xl font-bold pb-2 border-b-2" style={{ color: CERTIFICATE_TEMPLATES.find(t => t.id === formData.template_id)?.textColor, borderColor: CERTIFICATE_TEMPLATES.find(t => t.id === formData.template_id)?.borderColor }}>
                          {formData.recipient_name}
                        </div>
                        <div className="text-lg text-slate-700 space-y-2">
                          <div>وذلك لإتمامه/ها بنجاح دورة</div>
                          <div className="font-bold" style={{ color: CERTIFICATE_TEMPLATES.find(t => t.id === formData.template_id)?.textColor }}>
                            {formData.course_name}
                          </div>
                          {formData.hours && (
                            <div className="text-sm">بعدد ساعات: <strong>{formData.hours}</strong></div>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 pt-4">
                          {new Date(formData.issue_date).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500">
                      <Eye className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p>املأ البيانات لرؤية المعاينة</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
