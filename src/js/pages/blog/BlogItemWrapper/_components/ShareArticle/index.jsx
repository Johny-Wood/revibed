import { connect } from 'react-redux';

import ShareLinks from '@/components/share/ShareLinks';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { parseReplaceTextUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function ShareArticle({ slug, variablesList: { HOST = '' } = {} }) {
  return (
    <div className={styles.blogShareArticle}>
      <div className={styles.blogShareArticle__title}>Share article</div>
      <ShareLinks
        href={`${HOST}${parseReplaceTextUtil(RoutePathsConstants.BLOG_ITEM, slug)}`}
        withNames={false}
        linkClassName={styles.blogShareArticle__link}
        monoChromeIcons
      />
    </div>
  );
}

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
}))(ShareArticle);
