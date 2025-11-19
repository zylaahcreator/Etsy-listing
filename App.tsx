import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, FileText, AlertCircle, Wand2 } from 'lucide-react';
import { generateEtsyListing } from './services/geminiService';
import { EtsyListing, ProcessingStatus } from './types';
import { LoadingState } from './components/LoadingState';
import { ResultCard } from './components/ResultCard';

const App: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [listingData, setListingData] = useState<EtsyListing | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setError('กรุณาอัปโหลดไฟล์ PDF เท่านั้นสำหรับเนื้อหาหนังสือ');
        return;
      }
      setPdfFile(file);
      setError(null);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้นสำหรับหน้าปก');
        return;
      }
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!pdfFile || !coverFile) {
      setError('กรุณาอัปโหลดทั้งไฟล์ PDF และรูปหน้าปก');
      return;
    }

    setStatus(ProcessingStatus.PROCESSING);
    setError(null);

    try {
      const data = await generateEtsyListing(pdfFile, coverFile);
      setListingData(data);
      setStatus(ProcessingStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้ง หรือตรวจสอบ API Key');
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const resetApp = () => {
    setPdfFile(null);
    setCoverFile(null);
    setCoverPreview(null);
    setListingData(null);
    setStatus(ProcessingStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-etsy-orange text-white p-1.5 rounded-md">
              <Wand2 size={20} />
            </div>
            <h1 className="text-xl font-bold text-etsy-blue">Etsy Listing AI Generator</h1>
          </div>
          <div className="text-sm text-gray-500">Powered by Gemini 2.5</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Upload Section - Only show if no result yet */}
        {status !== ProcessingStatus.SUCCESS && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">เตรียมข้อมูลขาย Etsy ในไม่กี่วินาที</h2>
              <p className="text-gray-600">อัปโหลดสมุดภาพ (PDF) และภาพหน้าปก ให้ AI ช่วยเขียน Title, Description และ Tags แบบมือโปร</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-8">
              {/* Cover Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <ImageIcon size={18} className="text-etsy-orange" />
                  ภาพหน้าปก (Cover Image)
                </label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${coverFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-etsy-orange hover:bg-orange-50'}`}>
                   {coverPreview ? (
                     <div className="relative w-full h-48 flex items-center justify-center">
                       <img src={coverPreview} alt="Cover Preview" className="h-full object-contain rounded shadow-sm" />
                       <button 
                        onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                        className="absolute top-0 right-0 bg-white rounded-full p-1 shadow text-red-500 hover:bg-red-50"
                       >
                         <AlertCircle size={20} />
                       </button>
                     </div>
                   ) : (
                    <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleCoverChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center py-4 pointer-events-none">
                          <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600 font-medium">คลิกเพื่อเลือกรูปภาพ</span>
                          <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</span>
                        </div>
                    </div>
                   )}
                </div>
              </div>

              {/* PDF Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText size={18} className="text-etsy-orange" />
                  ไฟล์เนื้อหา (PDF)
                </label>
                 <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${pdfFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-etsy-orange hover:bg-orange-50'}`}>
                   {pdfFile ? (
                     <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                       <div className="flex items-center gap-3">
                         <div className="bg-red-100 p-2 rounded text-red-600">
                           <FileText size={20} />
                         </div>
                         <div className="text-left">
                           <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{pdfFile.name}</p>
                           <p className="text-xs text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                         </div>
                       </div>
                       <button onClick={() => setPdfFile(null)} className="text-gray-400 hover:text-red-500">
                         ยกเลิก
                       </button>
                     </div>
                   ) : (
                    <div className="relative">
                        <input 
                          type="file" 
                          accept="application/pdf" 
                          onChange={handlePdfChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                         <div className="flex flex-col items-center justify-center py-4 pointer-events-none">
                          <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600 font-medium">คลิกเพื่อเลือกไฟล์ PDF</span>
                          <span className="text-xs text-gray-400 mt-1">PDF สำหรับลงขาย (Digital/Print)</span>
                        </div>
                    </div>
                   )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start gap-2 text-sm">
                  <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Generate Button */}
              {status === ProcessingStatus.PROCESSING ? (
                <LoadingState />
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={!pdfFile || !coverFile}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2
                    ${(!pdfFile || !coverFile) 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-900 text-white hover:bg-etsy-orange hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                >
                  <Wand2 size={22} />
                  สร้างข้อมูล Listing
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Section */}
        {status === ProcessingStatus.SUCCESS && listingData && (
          <ResultCard data={listingData} onReset={resetApp} />
        )}
      </main>
    </div>
  );
};

export default App;