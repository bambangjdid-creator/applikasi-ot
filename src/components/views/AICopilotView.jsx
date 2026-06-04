import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send } from 'lucide-react';

export default function AICopilotView({ overtime, karyawan, callGeminiAPI, geminiApiKey, showToast }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! Saya **Overtime Copilot** bertenaga Gemini AI. Saya memiliki akses instan ke seluruh catatan kerja lembur & daftar staf karyawan Anda. Tanyakan apa saja seperti "Siapa karyawan terboros?", "Rekomendasikan efisiensi biaya", atau "Berapa jam total lembur divisi GUDANG PONCOL?".'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    if (!geminiApiKey) {
      showToast('Masukkan Gemini API Key terlebih dahulu di tab Settings!', 'warning');
      return;
    }

    const userMessageText = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessageText }]);
    setSending(true);

    const systemPrompt = `Anda adalah asisten virtual ahli analisis data SDM (HR Data Analyst & Overtime Expert).\nGunakan data real-time berikut untuk menjawab pertanyaan pengguna dengan akurat, objektif, dan sopan dalam Bahasa Indonesia.\nTampilkan perhitungan matematis singkat jika diperlukan. Jangan pernah membuat asumsi data di luar konteks ini.\n\nDATA LEMBUR SAAT INI (OVERTIME):\n${JSON.stringify(overtime.map(ot => ({
      idDoc: ot.idDoc,
      tanggal: ot.tanggalLembur,
      divisi: ot.divisi,
      kegiatan: ot.jenisLembur,
      nama: ot.namaKaryawan,
      durasiJam: ot.durasiLembur,
      nominalRp: ot.nominal,
      status: ot.statusDocument,
      alasan: ot.alasanLembur
    })))}\n\nDATA KARYAWAN MASTER:\n${JSON.stringify(karyawan.map(k => ({
      id: k.idKaryawan,
      nama: k.namaKaryawan,
      divisi: k.divisi,
      jabatan: k.jabatan,
      area: k.areaKerja
    })))}\n`;

    try {
      const resultText = await callGeminiAPI(systemPrompt, userMessageText);
      setMessages(prev => [...prev, { role: 'assistant', content: resultText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Terjadi kegagalan komunikasi dengan server Gemini. Pastikan API Key Anda benar dan kuota tersedia.' }]);
    } finally {
      setSending(false);
    }
  };

  const loadSuggestion = (suggestion) => {
    setInputValue(suggestion);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col h-[520px] animate-fade-in justify-between">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
            <Brain className="h-5 w-5 text-indigo-400" /> Overtime Copilot (Analisis AI)
          </h2>
          <p className="text-xs text-slate-400">Analisis pengeluaran, pantau tren, audit kepatuhan, & cari tahu fakta menarik dari database Anda.</p>
        </div>
        <button
          onClick={() => {
            setMessages([
              { role: 'assistant', content: 'Riwayat obrolan di-reset. Ada analisis data lembur yang bisa saya bantu hari ini?' }
            ]);
          }}
          className="text-slate-500 hover:text-slate-300 text-[10px] font-bold uppercase tracking-wider"
        >
          Reset Chat
        </button>
      </div>

      {messages.length === 1 && (
        <div className="pt-3 flex flex-wrap gap-2 text-[10px] font-bold">
          {[
            'Siapa yang mengumpulkan uang lembur terbanyak?',
            'Berapa rata-rata jam kerja lembur staf?',
            'Analisis tingkat risiko kepatuhan data lembur saat ini',
            'Sebutkan divisi dengan pengeluaran lembur terbesar'
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => loadSuggestion(chip)}
              className="bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/20 text-indigo-300 px-2.5 py-1 rounded-xl transition-all text-left"
            >
              💡 {chip}
            </button>
          ))}
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-grow my-4 overflow-y-auto space-y-4 pr-2 text-xs leading-relaxed"
      >
        {messages.map((m, idx) => (
          <div
            key={`msg-${idx}`}
            className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black flex-shrink-0 ${
              m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-violet-400 border border-slate-700'
            }`}>
              {m.role === 'user' ? 'U' : 'AI'}
            </div>
            <div className={`p-3.5 rounded-2xl whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="h-8 w-8 rounded-full bg-slate-800 text-violet-400 flex items-center justify-center font-black animate-spin">
              ⚡
            </div>
            <div className="p-3.5 bg-slate-900 border border-slate-800 text-slate-400 italic rounded-2xl rounded-tl-none flex items-center gap-2">
              <span className="animate-pulse">Copilot sedang menganalisis database...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder={geminiApiKey ? 'Ketik pertanyaan Anda di sini...' : '❌ Harap masukkan Gemini API Key di Settings terlebih dahulu...'}
          value={inputValue}
          disabled={!geminiApiKey || sending}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!geminiApiKey || sending || !inputValue.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
