import classNames from 'classnames';

import ScrollbarLayout from '@/components/layouts/ScrollbarLayout';
import Button from '@/components/ui/buttons/Button';
import CloseIcon from '@/icons/control/close/CloseIcon';
import ImageLiteBoxService from '@/services/ImageLiteBoxService';
import { covertPx2RemUtil } from '@/utils/covertPx2RemUtil';

import styles from './styles.module.scss';

const renderList = ({ files, onRemove, readOnly, withLiteBox, containerClassName, itemClassName, imageClassName }) => (
  <div className={classNames(styles.uploadList__container, containerClassName)}>
    {files.map((item, idx) => {
      const { path, file, name, fileName, id } = item;

      return (
        <div key={`file-${id || fileName || name}`} className={classNames(styles.uploadList__item, itemClassName)}>
          <div
            onClick={() => {
              if (!withLiteBox) {
                return;
              }

              ImageLiteBoxService.setImages(files, idx);
              ImageLiteBoxService.open();
            }}
            style={{ backgroundImage: `url(${path || file})` }}
            className={classNames([styles.uploadList__image, imageClassName, withLiteBox && styles.uploadList__image_pointer])}
          />
          {!readOnly && (
            <Button
              className={styles.uploadList__remove}
              type="button_string"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(id);
              }}
            >
              <CloseIcon />
            </Button>
          )}
        </div>
      );
    })}
  </div>
);

function FileUploaderList({
  files = [],
  readOnly = false,
  inline = false,
  withScrollBar = false,
  withLiteBox = true,

  onRemove = () => {},

  className,
  containerClassName,
  itemClassName,
  imageClassName,
}) {
  if (files.length === 0) {
    return null;
  }

  if (withScrollBar) {
    return (
      <div className={classNames(styles.uploadList, inline && styles.uploadList_inline, className)}>
        <ScrollbarLayout height={!readOnly ? covertPx2RemUtil(110) : undefined}>
          {renderList({
            files,
            onRemove,
            readOnly,
            withLiteBox,
            containerClassName,
            itemClassName,
            imageClassName,
          })}
        </ScrollbarLayout>
      </div>
    );
  }

  return (
    <div className={classNames(styles.uploadList, !readOnly && styles.uploadList_inline, className)}>
      {renderList({
        files,
        onRemove,
        readOnly,
        withLiteBox,
        containerClassName,
        itemClassName,
        imageClassName,
      })}
    </div>
  );
}

export default FileUploaderList;
