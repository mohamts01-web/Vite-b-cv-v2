import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Award, Calendar, FileText, Hash } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Certificate } from '../../types/certificate';

interface CertificateVerifyProps {
  verificationCode: string;
}

export default function CertificateVerify({ verificationCode }: CertificateVerifyProps) {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    verifyCertificate();
  }, [verificationCode]);

  const verifyCertificate = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('verification_code', verificationCode)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCertificate(data);
        setValid(true);
      } else {
        setValid(false);
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setValid(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 text-lg">جاري التحقق من الشهادة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-4 rounded-2xl shadow-xl">
              <Award className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">التحقق من الشهادة</h1>
          <p className="text-slate-600 mt-2">Certificate Verification</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-slate-100">
          {valid && certificate ? (
            <div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
                <CheckCircle className="w-16 h-16 text-white mx-auto mb-3" />
                <h2 className="text-3xl font-bold text-white mb-2">شهادة صالحة</h2>
                <p className="text-green-100">Valid Certificate</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">اسم المستلم</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{certificate.recipient_name}</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">اسم الدورة</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{certificate.course_name}</p>
                  </div>

                  {certificate.hours && (
                    <div className="bg-slate-50 p-6 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">عدد الساعات</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{certificate.hours} ساعة</p>
                    </div>
                  )}

                  <div className="bg-slate-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">تاريخ الإصدار</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">
                      {new Date(certificate.issue_date).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl md:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <Hash className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">الرقم التسلسلي</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900 font-mono">{certificate.serial_number}</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-green-800 font-medium">
                    هذه الشهادة صادرة من منصة CvSira وموثقة رسمياً
                  </p>
                  <p className="text-green-600 text-sm mt-2">
                    This certificate is issued by CvSira platform and officially verified
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-center">
                <XCircle className="w-16 h-16 text-white mx-auto mb-3" />
                <h2 className="text-3xl font-bold text-white mb-2">شهادة غير صالحة</h2>
                <p className="text-red-100">Invalid Certificate</p>
              </div>

              <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                  <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-900 mb-2">
                    لم يتم العثور على الشهادة
                  </h3>
                  <p className="text-red-700 mb-6">
                    كود التحقق <span className="font-mono font-bold">{verificationCode}</span> غير صحيح أو الشهادة غير موجودة في النظام
                  </p>
                  <p className="text-red-600 text-sm">
                    Certificate not found. The verification code may be incorrect or the certificate doesn't exist in our system.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            للتحقق من شهادة أخرى، يرجى استخدام رابط التحقق المرفق مع الشهادة
          </p>
        </div>
      </div>
    </div>
  );
}
