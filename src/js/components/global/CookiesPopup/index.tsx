import { useState } from 'react';

import CookiesPopupContent from '@/components/global/CookiesPopup/_components/CookiesPopupContent';

type CookiesPopupProps = {
  shownCookiesPopup?: boolean;
};

function CookiesPopup({ shownCookiesPopup = false }: CookiesPopupProps) {
  const [shown, setShown] = useState(shownCookiesPopup);

  return <CookiesPopupContent shown={shown} closePopup={() => setShown(false)} />;
}

export default CookiesPopup;
