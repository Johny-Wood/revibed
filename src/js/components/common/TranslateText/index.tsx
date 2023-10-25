import TranslateHook from '@/hooks/translate/TranslateHook';

type TranslateTextProps = {
  translateKey: string;
};

function TranslateText({ translateKey }: TranslateTextProps) {
  const t = TranslateHook();

  return <>{t(translateKey)}</>;
}

export default TranslateText;
