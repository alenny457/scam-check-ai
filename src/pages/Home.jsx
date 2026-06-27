import React, { useState } from 'react';
import { analyzeMessage } from '../services/aiService';
import { logScamCheck } from '../services/supabase';

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('message'); // 'message' or 'website'

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const aiAnalysis = await analyzeMessage(text);
      setResult(aiAnalysis);
      await logScamCheck(text, aiAnalysis);
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskStyles = (level) => {
    const risk = level?.toLowerCase() || '';
    if (risk.includes('high')) return { text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', badge: 'bg-red-600' };
    if (risk.includes('medium')) return { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: 'bg-amber-600' };
    return { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-600' };
  };

  const styles = getRiskStyles(result?.risk_level);

  return (
    <main className="min-h-screen bg-[#0B1220] text-white px-4 md:px-12 py-10">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12 border-b border-slate-800/60 pb-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-wider">
          <span className="text-blue-500">🛡️</span> SCAM <span className="text-blue-500">CHECK AI</span>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-sm font-semibold px-4 py-2 rounded-lg transition-all">
          Report Scam (v2)
        </button>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Control Input Block */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Detect Scams. <br />
              <span className="text-blue-500">Stay Safe.</span> Save Money.
            </h1>
            <p className="mt-4 text-gray-400 text-sm max-w-lg">
              Paste any suspicious message, email, SMS, website link, or online offer and receive an instant AI-powered scam analysis.
            </p>
          </div>

            <div className="flex w-full items-center border-b border-slate-800 pb-3 mb-4 gap-6 text-sm text-gray-400">
  <button
  type="button"
  onClick={() => setActiveTab('message')}
  className={`pb-3 font-medium cursor-pointer transition-all ${
    activeTab === 'message' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
  }`}
>
  💬 Check Message
</button>
<button
  type="button"
  onClick={() => setActiveTab('website')}
  className={`pb-3 font-medium cursor-pointer transition-all ${
    activeTab === 'website' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
  }`}
>
  🌐 Check Website (v2)
</button>
 </div>
<div className="w-full">
  {activeTab === 'message' ? (
    <textarea
      className="w-full h-44 bg-[#080D1A] text-gray-200 placeholder-gray-600 rounded-lg p-4 focus:outline-none focus:border-blue-500 text-base"
      placeholder="Paste suspicious message, email, or SMS here..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  ) : (
    <input
      type="text"
      className="w-full bg-[#080D1A] text-gray-200 placeholder-gray-600 rounded-lg p-4 border border-slate-800 focus:outline-none focus:border-blue-500 text-base"
      placeholder="Enter suspicious website URL here..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  )}
  
           <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mt-4">
  <p className="text-xs text-gray-500 flex items-center gap-1">
    🔒 System anonymizes data processing queries
  </p>
  <button
    disabled={loading || !text.trim()}
    onClick={handleAnalyze}
    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow transition-all active:scale-95 whitespace-nowrap"
  >
    {loading ? 'Analyzing Indicators...' : '🚀 Analyze Now'}
  </button>
</div>
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          </div>
        </div>

        {/* Right Output Result Box */}
        <div className="lg:col-span-5">
          {!result ? (
            <div className="border border-dashed border-slate-800 rounded-xl h-[450px] flex flex-col justify-center items-center text-center p-6 bg-[#111A2E]/10">
              <div className="text-4xl mb-3 opacity-30">🛡️</div>
              <h3 className="font-semibold text-gray-400">Awaiting Input Scan</h3>
              <p className="text-xs text-gray-600 max-w-xs mt-1">
                Provide a text payload on the left control pane to trigger automated threat identification models.
              </p>
            </div>
          ) : (
            <div className="bg-[#111A2E]/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="px-5 py-4 bg-[#16223F]/50 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs tracking-wider font-bold text-gray-400 uppercase">Analysis Engine Output</span>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded text-white tracking-widest ${styles.badge}`}>
                  {result.risk_level}
                </span>
              </div>

              <div className="p-5 space-y-5">
                <div className={`p-4 rounded-lg flex items-center gap-4 ${styles.bg} border ${styles.border}`}>
                  <div className={`text-2xl ${styles.text}`}>⚠️</div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-base ${styles.text}`}>{result.risk_level}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">Confidence Metric:</span>
                      <span className="text-xs font-bold text-white">{result.confidence}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${result.risk_level.includes('High') ? 'bg-red-500' : 'bg-amber-500'}`}
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Red Flags Detected</h5>
                  <ul className="space-y-1.5">
                    {result.red_flags.map((flag, idx) => (
                      <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span> {flag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1.5">Structural Analysis</h5>
                  <p className="text-xs text-gray-400 leading-relaxed">{result.explanation}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Recommended Safety Actions</h5>
                  <ul className="space-y-1.5">
                    {result.safety_advice.map((advice, idx) => (
                      <li key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                        <span className="text-emerald-500 text-[10px]">✅</span> {advice}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}