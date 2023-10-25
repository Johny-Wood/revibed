import classNames from 'classnames';

import EmojiReplaceWrapper from '@/components/common/emoji/EmojiReplaceWrapper';
import EditFieldsButton from '@/components/forms/personal/profile/_components/EditFieldsButton';
import { PersonalEditModulesConstants } from '@/constants/personal/edit/module';
import { getDateFormatUtil } from '@/utils/dateUtils';

import styles from './styles.module.scss';

function ProfileBarShortInfo({ userInfo: { memberSince, about = '' } = {}, isMy }) {
  return (
    <div className={styles.profileBarShortInfo}>
      {(isMy || !!about) && (
        <span className={classNames(styles.profileBarShortInfo__item, styles.profileBarShortInfo__item_about)}>
          <b className={classNames(styles.profileBarShortInfo__description, 't-uppercase')}>About</b>
          <span className={styles.profileBarShortInfo__value}>
            <span>{about ? <EmojiReplaceWrapper text={about} /> : <i className="c-gray-2">{isMy && 'Add about'}</i>}</span>
            {isMy && <EditFieldsButton className="m-left-10" moduleName={PersonalEditModulesConstants.ABOUT} />}
          </span>
        </span>
      )}
      {!!memberSince && (
        <span className={styles.profileBarShortInfo__item}>
          <b className={classNames(styles.profileBarShortInfo__description, 't-uppercase')}>Member since:</b>
          <span className={styles.profileBarShortInfo__value}>{getDateFormatUtil(memberSince, 'MMMM DD, YYYY')}</span>
        </span>
      )}
    </div>
  );
}

export default ProfileBarShortInfo;
