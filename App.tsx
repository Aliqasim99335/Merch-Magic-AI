
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { LogoUploader } from './components/LogoUploader';
import { MockupCard } from './components/MockupCard';
import { PRODUCTS, EDIT_SUGGESTIONS } from './constants';
import { ProductType, AppStatus } from './types';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>(PRODUCTS[0]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const geminiRef = useRef<GeminiService | null>(null);

  useEffect(() => {
    try {
      geminiRef.current = new GeminiService();
    } catch (e) {
      setError("Failed to initialize AI service. Please check your configuration.");
    }
  }, []);

  const handleGenerate = async () => {
    if (!logo || !geminiRef.current) return;
    
    setStatus(AppStatus.GENERATING);
    setError(null);
    try {
      const result = await geminiRef.current.generateMockup(logo, selectedProduct.basePrompt);
      setMockupUrl(result);
      setStatus(AppStatus.IDLE);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate mockup. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleEdit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mockupUrl || !editPrompt || !geminiRef.current) return;

    setStatus(AppStatus.EDITING);
    setError(null);
    try {
      const result = await geminiRef.current.editMockup(mockupUrl, editPrompt);
      setMockupUrl(result);
      setEditPrompt('');
      setStatus(AppStatus.IDLE);
    } catch (err: any) {
      console.error(err);
      setError("Failed to edit image. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  const downloadImage = () => {
    if (!mockupUrl) return;
    const link = document.createElement('a');
    link.href = mockupUrl;
    link.download = `merch-mockup-${Date.now()}.png`;
    link.click();
  };

  const isLoading = status === AppStatus.GENERATING || status === AppStatus.EDITING;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">MerchMagic AI</h1>
            <p className="text-xs text-slate-500 font-medium">Powered by Gemini 2.5</p>
          </div>
        </div>
        
        {mockupUrl && !isLoading && (
          <button
            onClick={downloadImage}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export High-Res
          </button>
        )}
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Configuration */}
        <aside className="lg:col-span-4 space-y-6">
          <section>
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs">1</span>
              Upload Identity
            </h2>
            <LogoUploader logo={logo} onUpload={setLogo} />
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs">2</span>
              Choose Product
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {PRODUCTS.map((product) => (
                <MockupCard
                  key={product.id}
                  product={product}
                  isSelected={selectedProduct.id === product.id}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </section>

          <button
            onClick={handleGenerate}
            disabled={!logo || isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
              !logo || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 shadow-blue-200'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Magic...
              </>
            ) : (
              <>
                Generate Mockup
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
              {error}
            </div>
          )}
        </aside>

        {/* Right Panel: Preview & Editing */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-700">PREVIEW CANVAS</h2>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              </div>
            </div>

            <div className="flex-1 relative bg-slate-900/5 flex items-center justify-center p-8 min-h-[400px]">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-900 font-bold text-lg">
                      {status === AppStatus.GENERATING ? "AI is drawing your merch..." : "Applying your edits..."}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">This usually takes about 10-15 seconds.</p>
                  </div>
                </div>
              ) : mockupUrl ? (
                <img
                  src={mockupUrl}
                  alt="Mockup result"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in duration-500"
                />
              ) : (
                <div className="text-center max-w-xs">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium">Your creative vision will appear here after generation.</p>
                </div>
              )}
            </div>

            {mockupUrl && !isLoading && (
              <div className="p-6 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">✨</span>
                  <h3 className="font-bold text-slate-800">Edit with AI</h3>
                </div>
                <form onSubmit={handleEdit} className="relative">
                  <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="E.g., 'Make it look like a street photo at night' or 'Add retro film grain'..."
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={!editPrompt}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-slate-900 text-white rounded-lg font-bold text-xs hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Apply Magic
                  </button>
                </form>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter self-center mr-1">Quick Edits:</span>
                  {EDIT_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setEditPrompt(suggestion)}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all font-medium shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-start">
            <div className="text-blue-600 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">Pro Tip</p>
              <p className="text-sm text-blue-700 leading-relaxed">
                For best results, use a transparent PNG logo. Gemini 2.5 Flash Image will automatically adjust the lighting and texture of your logo to match the product fabric and environment.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-slate-200 text-center text-slate-400 text-xs font-medium">
        &copy; {new Date().getFullYear()} MerchMagic AI. All mockup assets generated dynamically via Gemini 2.5 Flash Image.
      </footer>
    </div>
  );
};

export default App;
