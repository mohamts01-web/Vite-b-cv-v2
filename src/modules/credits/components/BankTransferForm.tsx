import { useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Building2 } from 'lucide-react';
import { BankDetails } from '../../../types/credits';

interface BankTransferFormProps {
  onSubmit: (file: File, referenceNumber: string) => void;
  loading: boolean;
}

const BANK_ACCOUNTS: BankDetails[] = [
  {
    bank_name: 'مصرف الراجحي',
    account_holder: 'محمد فهد محمد الجنيح',
    account_number: '475000010006086029957',
    iban: 'SA5580000475608016029957',
    swift_code: 'RJHISARI',
  },
  {
    bank_name: 'مصرف الإنماء',
    account_holder: 'محمد فهد الجنيح',
    account_number: '68206493958000',
    iban: 'SA3505000068206493958000',
    swift_code: '',
  },
  {
    bank_name: 'بنك STC',
    account_holder: 'محمد فهد محمد الجنيح',
    account_number: '-',
    iban: 'استخدم رمز QR للتحويل السريع',
    swift_code: '',
  },
];

export default function BankTransferForm({ onSubmit, loading }: BankTransferFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      alert('حجم الملف يجب أن يكون أقل من 5MB');
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('فقط ملفات PNG و JPG و PDF مسموحة');
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }

  function handleRemoveFile() {
    setFile(null);
    setPreview(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !referenceNumber.trim()) {
      alert('الرجاء رفع الإيصال وإدخال رقم مرجعي');
      return;
    }
    onSubmit(file, referenceNumber);
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-3">تنبيه: خدمة التحويل البنكي مؤقتة</h4>
        <ol className="text-sm text-yellow-700 space-y-2 list-decimal list-inside">
          <li>قم بالتحويل إلى أحد الحسابات أدناه</li>
          <li>استخدم بريدك الإلكتروني كرقم مرجعي</li>
          <li>ارفع صورة واضحة من إيصال التحويل</li>
          <li>سنقوم بالمراجعة والموافقة في خلال 24-48 ساعة</li>
        </ol>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          حوّل إلى أحد الحسابات التالية
        </h4>
        <div className="grid gap-4">
          {BANK_ACCOUNTS.map((bank, index) => (
            <div key={index} className="bg-white rounded-lg p-5 border-2 border-slate-200 hover:border-blue-300 transition-colors">
              <div className="font-semibold text-slate-900 mb-4 text-lg flex items-center gap-2">
                🏦 {bank.bank_name}
              </div>
              <div className="grid gap-3 text-sm">
                <div>
                  <div className="text-slate-600 font-medium">الاسم</div>
                  <div className="text-slate-900 font-semibold mt-1">{bank.account_holder}</div>
                </div>
                {bank.account_number !== '-' && (
                  <div>
                    <div className="text-slate-600 font-medium">رقم الحساب</div>
                    <div className="text-slate-900 font-mono bg-slate-50 p-2 rounded mt-1 border border-slate-200">{bank.account_number}</div>
                  </div>
                )}
                <div>
                  <div className="text-slate-600 font-medium">IBAN</div>
                  <div className="text-slate-900 font-mono bg-slate-50 p-2 rounded mt-1 border border-slate-200">{bank.iban}</div>
                </div>
                {bank.swift_code && (
                  <div>
                    <div className="text-slate-600 font-medium">SWIFT</div>
                    <div className="text-slate-900 font-mono">{bank.swift_code}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-900 font-semibold mb-2 text-sm">
            رقم مرجعي أو رقم التحويل (اختياري)
          </label>
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="أدخل رقم التحويل أو معرف المعاملة"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            dir="rtl"
          />
        </div>

        <div>
          <label className="block text-slate-900 font-semibold mb-2 text-sm">
            إرفاق إيصال التحويل (PNG, JPG, PDF - بحد أقصى 5MB)
          </label>

          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all bg-white">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-slate-400 mb-3" />
                <p className="mb-2 text-sm text-slate-600">
                  <span className="font-semibold">اضغط لرفع</span> أو اسحب والصق
                </p>
                <p className="text-xs text-slate-500">PNG أو JPG أو PDF (أقصى 5MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,application/pdf"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="relative bg-white border border-slate-300 rounded-lg p-4">
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {preview ? (
                <div className="flex items-center gap-4">
                  <img
                    src={preview}
                    alt="معاينة الإيصال"
                    className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-slate-900 mb-1">
                      <ImageIcon className="w-4 h-4" />
                      <span className="font-medium text-right">{file.name}</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                    <FileText className="w-12 h-12 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-slate-900 mb-1">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium text-right">{file.name}</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold text-base hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'جاري الإرسال...' : 'تأكيد التحويل'}
        </button>
      </form>
    </div>
  );
}
