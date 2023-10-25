import type { PropsWithChildren } from 'react';

import Error404PageWrapper from '@/components/common/error/Error404PageWrapper';

type PageDisabledLayoutProps = PropsWithChildren & {
  disabled: boolean;
};

const PageDisabledLayout = ({ disabled, children }: PageDisabledLayoutProps) => {
  if (disabled) {
    return <Error404PageWrapper />;
  }

  return children;
};

export default PageDisabledLayout;
