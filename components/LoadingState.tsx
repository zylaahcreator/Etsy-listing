import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <Loader2 className="w-16 h-16 text-etsy-orange animate-spin relative z-10" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-gray-800">กำลังวิเคราะห์ข้อมูลหนังสือ...</h3>
      <p className="mt-2 text-gray-500 max-w-md">
        AI กำลังอ่านไฟล์ PDF และวิเคราะห์หน้าปกเพื่อสร้าง Keywords และคำอธิบายที่ขายดีที่สุดสำหรับ Etsy
      </p>
    </div>
  );
};