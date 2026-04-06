import { useState, useEffect } from 'react';
import { Award, Plus, Download, ExternalLink, Trash2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Certificate } from '../../types/certificate';

interface CertificatesDashboardProps {
  onNavigate: (page: string) => void;
}

export default function CertificatesDashboard({ onNavigate }: CertificatesDashboardProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificate = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشهادة؟')) return;

    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCertificates(certs => certs.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-3 rounded-xl shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">لوحة الشهادات</h1>
              <p className="text-slate-600">إدارة وإنشاء الشهادات الرقمية</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('create-certificate')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            إنشاء شهادة جديدة
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن شهادة..."
              className="w-full pr-12 pl-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              dir="rtl"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-600 mt-4">جاري التحميل...</p>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {searchTerm ? 'لا توجد نتائج' : 'لا توجد شهادات بعد'}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm ? 'حاول البحث بكلمات أخرى' : 'ابدأ بإنشاء أول شهادة لك'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => onNavigate('create-certificate')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-all"
              >
                <Plus className="w-5 h-5" />
                إنشاء شهادة
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">اسم المستلم</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">اسم الدورة</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">تاريخ الإصدار</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">الرقم التسلسلي</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {cert.recipient_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {cert.course_name}
                        {cert.hours && <span className="text-slate-500 mr-2">({cert.hours} ساعة)</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {new Date(cert.issue_date).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-600">
                        {cert.serial_number}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {cert.pdf_url && (
                            <a
                              href={cert.pdf_url}
                              download
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="تنزيل PDF"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => window.open(`/verify/${cert.verification_code}`, '_blank')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="عرض التحقق"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCertificate(cert.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
