import type { PropsWithChildren } from 'react';
import { Component } from 'react';

import type { ViewportData } from '@/hooks/viewport/ViewportHook';

import ViewPortContext from './ViewPortContext';

const MIN_WIDTH = 320;
const MOBILE_WIDTH = MIN_WIDTH;
const TABLET_WIDTH = 768;
const LAPTOP_WIDTH = 1025;
const DESKTOP_WIDTH = 1280;

type ViewportUserAgentData = {
  isMobileFromUserAgent: boolean;
  isTabletFromUserAgent: boolean;
};

const getWidth = ({ isMobileFromUserAgent, isTabletFromUserAgent }: ViewportUserAgentData) => {
  if (isTabletFromUserAgent) {
    return TABLET_WIDTH;
  }

  if (isMobileFromUserAgent) {
    return MOBILE_WIDTH;
  }

  return DESKTOP_WIDTH;
};

type ViewportProviderProps = ViewportUserAgentData & PropsWithChildren;

type ViewportProviderState = {
  value: ViewportData;
};

class ViewportProvider extends Component<ViewportProviderProps, ViewportProviderState> {
  constructor(props: ViewportProviderProps | Readonly<ViewportProviderProps>) {
    super(props);

    const { isMobileFromUserAgent, isTabletFromUserAgent } = props;

    const width = getWidth({ isMobileFromUserAgent, isTabletFromUserAgent });
    const height = 0;

    const isMobile = width < TABLET_WIDTH;
    const isTablet = width >= TABLET_WIDTH;
    const isLaptop = width >= LAPTOP_WIDTH;
    const isDesktop = width >= DESKTOP_WIDTH;
    const isNotDesktop = !isDesktop;

    ViewPortContext.init({
      width,
      height,
      isMobile,
      isTablet,
      isLaptop,
      isDesktop,
      isNotDesktop,
    });

    this.state = {
      value: {
        width,
        height,
        isMobile,
        isTablet,
        isLaptop,
        isDesktop,
        isNotDesktop,
      },
    };
  }

  componentDidMount() {
    this.handleWindowResize();

    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({
      value: {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= MOBILE_WIDTH,
        isTablet: window.innerWidth >= TABLET_WIDTH,
        isLaptop: window.innerWidth >= LAPTOP_WIDTH,
        isDesktop: window.innerWidth >= DESKTOP_WIDTH,
        isNotDesktop: window.innerWidth < DESKTOP_WIDTH,
      },
    });
  };

  render() {
    const { children } = this.props;
    const { value } = this.state;

    const Context = ViewPortContext.get();

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }
}

export default ViewportProvider;
