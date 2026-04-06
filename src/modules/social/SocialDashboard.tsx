import { useState, useEffect } from 'react';
import { Plus, Trash2, CreditCard as Edit, Share2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SocialDesign } from '../../types/social';

interface SocialDashboardProps {
  onNavigate: (page: string) => void;
}

export default function SocialDashboard({ onNavigate }: SocialDashboardProps) {
  const [designs, setDesigns] = useState<SocialDesign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('social_designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error('Error loading designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDesign = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التصميم؟')) return;

    try {
      const { error } = await supabase
        .from('social_designs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDesigns(designs.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting design:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const shareDesign = (code: string) => {
    const url = `${window.location.origin}/share/${code}`;
    navigator.clipboard.writeText(url);
    alert('تم نسخ رابط المشاركة!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-3 rounded-xl shadow-lg">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">تصاميمي</h1>
              <p className="text-slate-600">إدارة منشوراتك المحفوظة</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('social-home')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            تصميم جديد
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-600 mt-4">جاري التحميل...</p>
          </div>
        ) : designs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد تصاميم بعد</h3>
            <p className="text-slate-600 mb-6">ابدأ بإنشاء أول تصميم لك</p>
            <button
              onClick={() => onNavigate('social-home')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all"
            >
              <Plus className="w-5 h-5" />
              إنشاء تصميم
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {designs.map((design) => (
              <div
                key={design.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                  {design.thumbnail_url ? (
                    <img
                      src={design.thumbnail_url}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-purple-300" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-2 truncate">{design.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    {new Date(design.created_at).toLocaleDateString('ar-SA')}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('editor')}
                      className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => shareDesign(design.shareable_code)}
                      className="flex-1 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="مشاركة"
                    >
                      <Share2 className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => deleteDesign(design.id)}
                      className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
          <p className="text-sm text-purple-800">
            <strong>الخطة المجانية:</strong> يمكنك حفظ تصميم واحد فقط. قم بالترقية للحصول على تصاميم غير محدودة!
          </p>
        </div>
      </div>
    </div>
  );
}
