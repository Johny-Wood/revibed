import { useState } from 'react';

import CookiesPopupContent from '@/components/global/CookiesPopup/_components/CookiesPopupContent';

function CookiesPopup({ shownCookiesPopup }) {
  const [shown, setShown] = useState(shownCookiesPopup);

  return <CookiesPopupContent shown={shown} closePopup={() => setShown(false)} />;
}

export default CookiesPopup;
