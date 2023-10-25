import { useContext } from 'react';

import ViewPortContext from '@/services/viewport/ViewPortContext';

export type ViewportData = {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  isNotDesktop: boolean;
};

const ViewportHook = (): ViewportData => useContext(ViewPortContext.get());

export default ViewportHook;
