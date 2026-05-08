import { Moon, Sun } from 'lucide-react';
import { BellIcon, EarthIcon, InfoCircleIcon, SettingsIcon } from '@polaris/ui/icons';
import { Button, Card, CardContent, CardHeader, CardTitle, Select, Switch } from '@/components/ui';
import { useAppStore } from '@/store';

export function SettingsPage() {
  const { theme, setTheme } = useAppStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-500 mt-1">앱 설정을 관리하세요</p>
      </div>

      {/* 테마 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-primary" />
            표시 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <p className="font-medium">테마</p>
                <p className="text-sm text-gray-500">앱의 색상 테마를 선택하세요</p>
              </div>
            </div>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              {theme === 'light' ? '다크 모드' : '라이트 모드'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 알림 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-primary" />
            알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">푸시 알림</p>
              <p className="text-sm text-gray-500">중요 알림을 받으시겠습니까?</p>
            </div>
            <Switch defaultChecked aria-label="중요 알림" />
          </div>
        </CardContent>
      </Card>

      {/* 언어 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EarthIcon className="w-5 h-5 text-primary" />
            언어 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">언어</p>
              <p className="text-sm text-gray-500">앱의 표시 언어를 선택하세요</p>
            </div>
            <Select
              aria-label="언어"
              containerClassName="w-32"
              defaultValue="ko"
              options={[
                { value: 'ko', label: '한국어' },
                { value: 'en', label: 'English' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InfoCircleIcon className="w-5 h-5 text-primary" />
            앱 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">버전</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">개발</span>
              <span>목회메이트 팀</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
