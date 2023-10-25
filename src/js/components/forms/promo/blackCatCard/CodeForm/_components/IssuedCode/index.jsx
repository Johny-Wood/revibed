import CopyButton from '@/components/ui/buttons/CopyButton';

import styles from './styles.module.scss';

function IssuedCode({ code }) {
  return (
    <div className={styles.blackCatCardCopyCode}>
      <span className={styles.blackCatCardCopyCode__text} title={code}>
        {code}
      </span>
      <CopyButton value={code} />
    </div>
  );
}

export default IssuedCode;
