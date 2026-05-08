'use client';

import { useState, useRef } from 'react';
import { BibleSearchWorkspace } from './bible-search-workspace';
import { Loader2, Sparkles, History, Archive, Download, Search } from 'lucide-react';
import { Modal } from '@/components/ui';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface ArchivedSermon {
  id: string;
  date: string;
  title: string;
  content: string;
}

const ARCHIVE_DATA: ArchivedSermon[] = [
  { 
    id: '1', 
    date: '2026.04.14', 
    title: '하나님의 크신 사랑과 은혜', 
    content: '우리가 아직 죄인 되었을 때에 그리스도께서 우리를 위하여 죽으심으로 하나님께서 우리에 대한 자기의 사랑을 확증하셨느니라...\n\n하나님의 사랑은 조건이 없습니다. 그분은 우리의 연약함에도 불구하고 우리를 사랑하십니다. 예수 그리스도의 십자가 사건이 그 증거입니다.' 
  },
  { 
    id: '2', 
    date: '2026.04.07', 
    title: '믿음으로 이기는 세상', 
    content: '무릇 하나님께로부터 난 자마다 세상을 이기느니라 세상을 이기는 승리는 이것이니 우리의 믿음이니라 (요한일서 5:4)\n\n세상의 거센 파도 속에서도 믿음의 닻을 굳건히 내릴 때 우리는 흔들리지 않습니다. 우리의 믿음은 단순한 긍정이 아니라, 살아계신 하나님에 대한 신뢰입니다.' 
  },
  { 
    id: '3', 
    date: '2026.03.31', 
    title: '성령의 열매를 맺는 삶', 
    content: '오직 성령의 열매는 사랑과 희락과 화평과 오래 참음과 자비와 양선과 충성과 온유와 절제니 이같은 것을 금지할 법이 없느니라 (갈라디아서 5:22-23)\n\n우리 안에 거하시는 성령님께 우리 삶의 주권을 내어드릴 때 비로소 진정한 열매가 맺힙니다. 나의 노력으로 맺는 열매가 아닌 성령의 역사로 맺는 열매입니다.' 
  }
];

function QuickSearchPanel({ onInsertVerse }: { onInsertVerse: (ref: string, text: string) => void }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<{ reference: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQ = q) => {
    if (!searchQ.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/tools/bible/search?q=${encodeURIComponent(searchQ)}&limit=15&version=basic`);
    const data = await res.json() as { results: { reference: string; text: string }[] };
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <p className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          성경 구절 검색
        </p>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && void handleSearch()}
            placeholder="키워드 또는 구절 (예: 사랑, 로마 8:28)"
            className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 placeholder:text-slate-300"
          />
          <button
            onClick={() => void handleSearch()}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors disabled:opacity-60 flex items-center"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : '검색'}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {results.length > 0 ? (
          results.map(v => (
            <div
              key={v.reference}
              onClick={() => onInsertVerse(v.reference, v.text)}
              className="group p-2.5 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 cursor-pointer transition-all"
            >
              <p className="text-[11px] font-bold text-primary mb-1">{v.reference}</p>
              <p className="text-[12px] leading-relaxed text-slate-600">{v.text}</p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-slate-300 gap-2">
            <Search className="w-6 h-6 opacity-30" />
            <p className="text-xs">성경 구절을 검색하세요</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SermonLabWorkspace() {
  const [sermonTitle, setSermonTitle] = useState('');
  const [sermonContent, setSermonContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState<ArchivedSermon | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertVerse = (reference: string, text: string) => {
    const insertText = `\n${reference} - ${text}\n`;
    setSermonContent(prev => prev + insertText);
    
    // Scroll to bottom
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleGenerateDraft = async () => {
    if (!sermonTitle.trim() && !sermonContent.trim()) {
      alert('설교 제목이나 본문을 먼저 입력해주세요.');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI generation with typing effect
    const draftText = "\n\n[AI 초안]\n사랑하는 성도 여러분, 오늘 우리가 함께 읽은 본문은 깊은 은혜를 담고 있습니다. 하나님의 사랑은 우리의 생각보다 훨씬 더 넓고 깊으며, 우리가 어떤 상황에 처해 있더라도 우리를 찾아오십니다...\n";
    
    let i = 0;
    const typingInterval = setInterval(() => {
      setSermonContent(prev => prev + draftText.charAt(i));
      i++;
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
      if (i >= draftText.length) {
        clearInterval(typingInterval);
        setIsGenerating(false);
      }
    }, 20); // 20ms per character
  };

  const handleSaveToArchive = () => {
    // In a real app, this would send data to an API
    alert('사역 아카이브에 성공적으로 저장되었습니다.');
  };

  const handleDownloadDocx = async () => {
    const titleText = sermonTitle || '설교 원고';
    const lines = sermonContent.split('\n');

    const paragraphs = [
      new Paragraph({
        text: titleText,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      ...lines.map(line =>
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 24, // 12pt
              font: '맑은 고딕',
            }),
          ],
          spacing: { line: 360, after: 120 },
        })
      ),
    ];

    const doc = new Document({
      sections: [{ properties: {}, children: paragraphs }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${titleText}.docx`);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* 1. Sidebar Left (25%): Bible Search */}
      <div className="w-1/4 h-full flex flex-col bg-white rounded-[28px] shadow-sm border border-slate-100 overflow-hidden">
        <BibleSearchWorkspace onInsertVerse={handleInsertVerse} />
      </div>

      {/* 2. Center Main (50%): Text Editor */}
      <div className="w-2/4 h-full flex flex-col bg-white rounded-[28px] shadow-sm border border-slate-100 p-8 overflow-hidden">
        <div className="flex items-start justify-between gap-4 mb-6">
          <input 
            type="text" 
            value={sermonTitle}
            onChange={(e) => setSermonTitle(e.target.value)}
            placeholder="설교 제목을 입력하세요" 
            className="text-3xl font-bold text-slate-900 placeholder:text-slate-300 outline-none w-full bg-transparent"
          />
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={handleSaveToArchive}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Archive className="w-4 h-4" />
              <span>사역 아카이브에 저장</span>
            </button>
            <button 
              onClick={() => void handleDownloadDocx()}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Word로 저장</span>
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={sermonContent}
            onChange={(e) => setSermonContent(e.target.value)}
            placeholder="이곳에 설교 원고를 작성하세요. 좌측에서 성경 구절을 클릭하면 자동으로 삽입됩니다."
            className="w-full h-full resize-none outline-none text-lg leading-relaxed text-slate-700 placeholder:text-slate-300 bg-transparent"
          />
        </div>
      </div>

      {/* 3. Sidebar Right (25%): AI Assistant */}
      <div className="w-1/4 h-full flex flex-col gap-4">
        <div className="bg-slate-950 rounded-[28px] p-6 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <h3 className="font-semibold text-primary-100">AI 초안 작성</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              현재 작성된 제목과 본문, 성경 구절을 바탕으로 AI가 설교 초안을 작성합니다.
            </p>
          </div>
          
          <button 
            onClick={handleGenerateDraft}
            disabled={isGenerating}
            className="w-full bg-white text-slate-950 font-bold py-3 rounded-xl hover:bg-slate-100 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? '작성 중...' : 'AI 초안 생성하기'}
          </button>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100 flex-1 overflow-y-auto">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            과거 설교 내역
          </h3>
          <div className="flex flex-col gap-3">
            {ARCHIVE_DATA.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedArchive(item)}
                className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <p className="text-xs text-slate-400 mb-1">{item.date}</p>
                <p className="text-sm font-semibold text-slate-700">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        <QuickSearchPanel onInsertVerse={handleInsertVerse} />
      </div>

      {/* ── ARCHIVE POPUP ─────────────────────────────────── */}
      <Modal 
        isOpen={!!selectedArchive} 
        onClose={() => setSelectedArchive(null)} 
        title="사역 아카이브 원고"
      >
        {selectedArchive && (
          <div className="grid gap-5">
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">{selectedArchive.date}</p>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedArchive.title}</h2>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 max-h-[400px] overflow-y-auto">
              <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{selectedArchive.content}</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSelectedArchive(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">닫기</button>
              <button 
                onClick={() => {
                  setSermonTitle(selectedArchive.title);
                  setSermonContent(selectedArchive.content);
                  setSelectedArchive(null);
                }}
                className="bg-nova-secondary px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                이 원고로 불러오기
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
