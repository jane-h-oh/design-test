import { useState, useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { SearchIcon } from '@polaris/ui/icons';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui';
import { bibleTool, type BibleBook, type BibleVerse } from '@/api/bible';

export function BiblePage() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBible = async () => {
      try {
        await bibleTool.load();
        setBooks(bibleTool.getBooks());
      } catch (error) {
        console.error('Failed to load Bible:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBible();
  }, []);

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setVerses(bibleTool.getChapter(book.abbrev, 1));
  };

  const handleChapterChange = (chapter: number) => {
    if (selectedBook && chapter >= 1 && chapter <= selectedBook.chapters) {
      setSelectedChapter(chapter);
      setVerses(bibleTool.getChapter(selectedBook.abbrev, chapter));
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const results = bibleTool.search(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const oldTestament = books.slice(0, 39);
  const newTestament = books.slice(39);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">설교 연구소</h1>
        <p className="text-gray-500 mt-1">성경을 검색하고 연구하세요</p>
      </div>

      {/* 검색 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="성경 구절 검색 (예: 사랑, 믿음, 또는 구절: 요한복음 3:16)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : '검색'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 검색 결과 */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>검색 결과 ({searchResults.length}개)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-y-auto">
            {searchResults.slice(0, 20).map((verse, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-primary">
                  {verse.book} {verse.chapter}:{verse.verse}
                </p>
                <p className="text-sm text-gray-700 mt-1">{verse.text}</p>
              </div>
            ))}
            {searchResults.length > 20 && (
              <p className="text-sm text-gray-500 text-center">
                외 {searchResults.length - 20}개...
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 책 선택 */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                성경책
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              {/* 구약 */}
              <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">구약</h3>
                <div className="grid grid-cols-2 gap-1">
                  {oldTestament.map((book) => (
                    <Button
                      variant={selectedBook?.abbrev === book.abbrev ? 'primary' : 'ghost'}
                      size="xs"
                      key={book.abbrev}
                      onClick={() => handleBookSelect(book)}
                      className={`text-left px-2 py-1.5 rounded text-sm transition-colors ${
                        selectedBook?.abbrev === book.abbrev
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {book.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* 신약 */}
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">신약</h3>
                <div className="grid grid-cols-2 gap-1">
                  {newTestament.map((book) => (
                    <Button
                      variant={selectedBook?.abbrev === book.abbrev ? 'primary' : 'ghost'}
                      size="xs"
                      key={book.abbrev}
                      onClick={() => handleBookSelect(book)}
                      className={`text-left px-2 py-1.5 rounded text-sm transition-colors ${
                        selectedBook?.abbrev === book.abbrev
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {book.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 장 선택 및 구절 */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {selectedBook ? `${selectedBook.name} ${selectedChapter}장` : '책을 선택하세요'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBook ? (
                <>
                  {/* 장 네비게이션 */}
                  <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                    {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                      <Button
                        variant={selectedChapter === chapter ? 'primary' : 'tertiary'}
                        size="xs"
                        key={chapter}
                        onClick={() => handleChapterChange(chapter)}
                        className={`px-3 py-1 rounded text-sm whitespace-nowrap transition-colors ${
                          selectedChapter === chapter
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {chapter}
                      </Button>
                    ))}
                  </div>
                  
                  {/* 구절 */}
                  <div className="space-y-3 max-h-[450px] overflow-y-auto">
                    {verses.map((verse) => (
                      <div key={verse.verse} className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg">
                        <span className="text-primary font-medium text-sm min-w-[40px]">
                          {verse.verse}
                        </span>
                        <p className="text-gray-700 text-sm leading-relaxed">{verse.text}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>좌측에서 성경책을 선택하세요</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
