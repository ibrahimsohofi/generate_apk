import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦' }
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);

    // Set document direction for RTL support
    document.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;

    // Add/remove RTL class to body for Tailwind CSS support
    if (languageCode === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Select value={i18n.language} onValueChange={changeLanguage}>
      <SelectTrigger className="w-40 border-white/30 text-white hover:bg-white/10 focus:ring-orange-400 focus:border-orange-400">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span>{currentLanguage.flag}</span>
            <span className="hidden sm:inline">{currentLanguage.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border-blue-200">
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code} className="hover:bg-blue-50 focus:bg-blue-50">
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
