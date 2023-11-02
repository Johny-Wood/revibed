import classNames from 'classnames';

import LinkDefault from '@/components/ui/links/LinkDefault';
import { RoutePathsConstants } from '@/constants/routes/routes';

type TermsLinkProps = {
  anchor?: string;
  text?: string;
  color?: string;
};

function TermsLink({ anchor = '', text = 'Terms of Use', color }: TermsLinkProps) {
  return (
    <LinkDefault
      href={`${RoutePathsConstants.TERMS_OF_USE}${anchor && `#${anchor}`}`}
      text={text}
      className={classNames('terms-link underline', color && `c-${color}`)}
    />
  );
}

export default TermsLink;
