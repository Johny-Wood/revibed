import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import Button from '@/components/ui/buttons/Button';
import AttachIcon from '@/icons/AttachIcon';
import CloseIcon from '@/icons/control/close/CloseIcon';

import styles from './styles.module.scss';

const renderList = ({ files, onRemove }) => (
  <div className={styles.uploadListNames__container}>
    {files.map((item) => {
      const { name, fileName, id } = item;

      return (
        <div key={`file-${id || fileName || name}`} className={styles.uploadListNames__item}>
          <AttachIcon />
          <span className="t-ellipsis" title={fileName || name}>
            {fileName || name}
          </span>
          <Button
            className={styles.uploadListNames__remove}
            type="button_string"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
          >
            <CloseIcon />
          </Button>
        </div>
      );
    })}
  </div>
);

function FileUploaderListNames({
  files = [],

  onRemove = () => {},
}) {
  return (
    <TransitionLayout isShown={files.length > 0}>
      <div className={styles.uploadListNames}>{renderList({ files, onRemove })}</div>
    </TransitionLayout>
  );
}

export default FileUploaderListNames;
