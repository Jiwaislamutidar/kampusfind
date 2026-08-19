import React from 'react';
import { 
  IconCalendar, 
  IconTag, 
  IconUser, 
  IconMessageDots, 
  IconPhone, 
  IconCheck, 
  IconX, 
  IconEye 
} from '@tabler/icons-react';

interface ClaimData {
  id: string;
  itemImage: string | null;
  itemName: string;
  category: string;
  dateFound: string;
  claimantName: string;
  claimantStatus: string;
  claimantPhone: string;
  featureAnswer: string;
  locationAnswer: string;
}

interface VerificationCardProps {
  claim: ClaimData;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetail: (id: string) => void;
}

const VerificationCard: React.FC<VerificationCardProps> = ({ 
  claim, 
  onApprove, 
  onReject, 
  onViewDetail 
}) => {
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString || '-';
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('id-ID', options);
    } catch {
      return dateString || '-';
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden font-sans">
      
      {/* --- HEADER KARTU (INFORMASI BARANG) --- */}
      <div className="p-6 bg-gray-50/50 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-white border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden p-1 shrink-0 shadow-inner">
            {claim.itemImage ? (
              <img src={claim.itemImage} alt={claim.itemName} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <IconTag className="w-8 h-8 text-gray-300" />
            )}
          </div>

          <div className="flex-grow">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-gray-950">{claim.itemName}</h3>
              <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200 shadow-inner">
                ID: #{claim.id}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                {claim.category}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 text-sm text-gray-600">
              <IconCalendar size={16} className="text-gray-400" />
              <span>Ditemukan: {formatDate(claim.dateFound)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- BODY KARTU (INFORMASI PENGKLAIM & JAWABAN) --- */}
      <div className="p-6 space-y-6">
        
        <div>
          <div className="flex items-center gap-2 mb-3">
            <IconUser size={18} className="text-gray-400" />
            <h4 className="text-sm font-semibold text-gray-900 tracking-tight">Informasi Pengklaim</h4>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm">
            <div>
              <p className="font-semibold text-gray-950">{claim.claimantName}</p>
              <p className="text-xs text-gray-500 mt-0.5">{claim.claimantStatus}</p>
            </div>
            <a 
              href={`tel:${claim.claimantPhone}`} 
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100 transition"
            >
              <IconPhone size={16} />
              {claim.claimantPhone}
            </a>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <IconMessageDots size={18} className="text-gray-400" />
            <h4 className="text-sm font-semibold text-gray-900 tracking-tight">Jawaban Verifikasi</h4>
          </div>
          
          <div className="space-y-4">
            <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-5 border-l-4 border-l-sky-500 shadow-inner">
              <p className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-2">Ciri Khusus Item</p>
              <p className="text-[14px] leading-relaxed text-slate-800 font-medium">"{claim.featureAnswer}"</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 border-l-4 border-l-slate-500 shadow-inner">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Lokasi Terakhir Dilihat</p>
              <p className="text-[14px] leading-relaxed text-slate-800 font-medium">"{claim.locationAnswer}"</p>
            </div>
          </div>
        </div>

      </div>

      {/* --- FOOTER KARTU (TOMBOL AKSI) --- */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/20">
        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => onApprove(claim.id)}
            className="flex items-center justify-center gap-2.5 rounded-xl bg-gray-950 py-3.5 text-[14px] font-semibold text-white transition hover:bg-gray-800 shadow-md active:scale-[0.98]"
          >
            <IconCheck size={18} stroke={3} />
            Setujui
          </button>
          
          <button 
            type="button"
            onClick={() => onReject(claim.id)}
            className="flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white py-3.5 text-[14px] font-semibold text-gray-800 transition hover:bg-gray-50 shadow-sm active:scale-[0.98]"
          >
            <IconX size={18} stroke={3} />
            Tolak
          </button>
        </div>
        
        <button 
          type="button"
          onClick={() => onViewDetail(claim.id)}
          className="w-full mt-5 flex items-center justify-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 transition py-1"
        >
          <IconEye size={16} />
          Lihat Detail Lengkap
        </button>
      </div>

    </div>
  );
};

export default VerificationCard;