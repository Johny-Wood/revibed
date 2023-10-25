import classNames from 'classnames';

import LinkDefault from '@/components/ui/links/LinkDefault';
import { RoutePathsConstants } from '@/constants/routes/routes';

function TermsLink({ anchor = '', text = 'Terms of Use', color }) {
  return (
    <LinkDefault
      href={`${RoutePathsConstants.TERMS_OF_USE}${anchor && `#${anchor}`}`}
      text={text}
      className={classNames('terms-link underline', color && `c-${color}`)}
    />
  );
}

export default TermsLink;
