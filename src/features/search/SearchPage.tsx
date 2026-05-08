import { useState, useEffect } from 'react';
import { Loader2, Copy } from 'lucide-react';
import { CheckIcon, SearchIcon } from '@polaris/ui/icons';
import { Card, CardContent, Input, Button } from '@/components/ui';
import { bibleTool, type BibleVerse } from '@/api/bible';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      await bibleTool.load();
      setLoaded(true);
    };
    load();
  }, []);

  const handleSearch = async () => {
    if (!query.trim() || !loaded) return;
    
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const searchResults = bibleTool.search(query);
    setResults(searchResults);
    setIsSearching(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const getBookName = (abbrev: string) => {
    const book = bibleTool.getBookByAbbrev(abbrev);
    return book?.name || abbrev;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">성경 검색</h1>
        <p className="text-gray-500 mt-1">성경 구절을 검색하고 복사하세요</p>
      </div>

      {/* 검색 입력 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="검색어를 입력하세요 (예: 사랑, 믿음,盼望 등)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !loaded}>
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : '검색'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 결과 */}
      {results.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-4">
              '{query}' 검색 결과: {results.length}개
            </p>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {results.map((verse, index) => (
                <div 
                  key={index}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-primary">
                      {getBookName(verse.book)} {verse.chapter}:{verse.verse}
                    </p>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                      {verse.text}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleCopy(`${getBookName(verse.book)} ${verse.chapter}:${verse.verse} ${verse.text}`)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="복사"
                  >
                    {copied === `${verse.book}${verse.chapter}${verse.verse}` ? (
                      <CheckIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
            {results.length > 50 && (
              <p className="text-sm text-gray-500 text-center mt-4">
                처음 50개 결과만 표시됩니다
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* 초기 상태 */}
      {results.length === 0 && query && !isSearching && (
        <Card>
          <CardContent className="text-center py-12">
            <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">검색 결과가 없습니다</p>
            <p className="text-sm text-gray-400 mt-1">다른 검색어를 시도해 보세요</p>
          </CardContent>
        </Card>
      )}

      {!loaded && (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      )}
    </div>
  );
}
