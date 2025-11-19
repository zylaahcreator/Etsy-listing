import React, { useState } from 'react';
import { Copy, Check, Tag, BookOpen, DollarSign } from 'lucide-react';
import { EtsyListing } from '../types';

interface ResultCardProps {
  data: EtsyListing;
  onReset: () => void;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium border ${
        copied
          ? 'bg-green-100 text-green-700 border-green-200'
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
      }`}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
    </button>
  );
};

export const ResultCard: React.FC<ResultCardProps> = ({ data, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">ผลลัพธ์การวิเคราะห์</h2>
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-etsy-orange underline"
        >
          เริ่มใหม่
        </button>
      </div>

      {/* Title Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-etsy-blue font-semibold">
            <BookOpen size={20} />
            <span>Listing Title (ชื่อสินค้า)</span>
          </div>
          <CopyButton text={data.title} />
        </div>
        <div className="p-6">
          <p className="text-lg text-gray-800 font-medium">{data.title}</p>
          <p className="text-xs text-gray-400 mt-2 text-right">{data.title.length} / 140 ตัวอักษร</p>
        </div>
      </div>

      {/* Tags Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-etsy-blue font-semibold">
            <Tag size={20} />
            <span>Tags (13 คำค้นหา)</span>
          </div>
          <CopyButton text={data.tags.join(', ')} />
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, idx) => (
              <span key={idx} className="bg-orange-50 text-etsy-orange px-3 py-1 rounded-full text-sm border border-orange-100 font-medium">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">จำนวน: {data.tags.length} Tags (ควรใส่ให้ครบ 13 ใน Etsy)</p>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-etsy-blue font-semibold">
            <span className="text-lg">📝</span>
            <span>Description (รายละเอียดสินค้า)</span>
          </div>
          <CopyButton text={data.description} />
        </div>
        <div className="p-6">
          <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 h-96 overflow-y-auto">
            {data.description}
          </div>
        </div>
      </div>

      {/* Meta Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 text-green-600 font-semibold mb-3">
                <DollarSign size={20} />
                <span>ราคาแนะนำ</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{data.priceSuggestion}</p>
        </div>

        {/* Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 text-purple-600 font-semibold mb-3">
                <span>📂</span>
                <span>หมวดหมู่ (Category)</span>
            </div>
            <p className="text-gray-800 font-medium">{data.category}</p>
        </div>
      </div>

       {/* Attributes */}
       {data.attributes && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h3 className="font-semibold text-gray-700 mb-4 border-b pb-2">คุณลักษณะสินค้า (Attributes)</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(data.attributes).map(([key, value]) => (
                    <div key={key} className="text-sm">
                        <span className="block text-gray-500 capitalize">{key}</span>
                        <span className="block text-gray-800 font-medium truncate">{value}</span>
                    </div>
                ))}
             </div>
        </div>
       )}

    </div>
  );
};