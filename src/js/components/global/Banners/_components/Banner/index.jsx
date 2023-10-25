import { Component } from 'react';

import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import LinkDefault from '@/components/ui/links/LinkDefault';
import LinkRoute from '@/components/ui/links/LinkRoute';

import styles from './styles.module.scss';

class Banner extends Component {
  renderLink = () => {
    const { internalLink, link } = this.props;
    const linkSplit = link.split('?');

    const href = linkSplit[1] ? { pathname: linkSplit[0], query: linkSplit[1] } : linkSplit[0];

    if (internalLink) {
      return (
        <LinkRoute className={styles.banner__wrapper} href={href}>
          {this.renderContent()}
        </LinkRoute>
      );
    }

    return (
      <LinkDefault className={styles.banner__wrapper} href={link}>
        {this.renderContent()}
      </LinkDefault>
    );
  };

  renderContent = () => {
    const { content } = this.props;

    return <>{parse(content)}</>;
  };

  render() {
    const { link } = this.props;

    return <div className={styles.banner}>{link ? this.renderLink() : this.renderContent()}</div>;
  }
}

Banner.defaultProps = {
  link: '',
  content: '',
};

Banner.propTypes = {
  link: PropTypes.string,
  content: PropTypes.string,
};

export default Banner;
