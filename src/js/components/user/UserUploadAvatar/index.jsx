import { useCallback, useState } from 'react';

import Cropper from 'react-easy-crop';

import FileUploader from '@/components/common/FileUploader';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import CloseIcon from '@/icons/control/close/CloseIcon';

import styles from './styles.module.scss';

function UserUploadAvatar({
  images = [],
  setImages = () => {},
  croppedAreaPixelsCallback,
  attachDescription,
  attachDescriptionWithIcon,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [initialWidth, setInitialWidth] = useState(null);

  const onCropComplete = useCallback(
    (_, croppedAreaPixelsNew) => {
      if (croppedAreaPixelsCallback) {
        croppedAreaPixelsCallback(croppedAreaPixelsNew);
      }

      if (!initialWidth) {
        setInitialWidth(croppedAreaPixelsNew.width);
      }
    },
    [croppedAreaPixelsCallback, initialWidth]
  );

  const onZoomChange = (zoomValue) => {
    setZoom(zoomValue);
  };

  return (
    <div className={styles.userUploadAvatar}>
      {images.length > 0 && (
        <ButtonIcon
          className={styles.buttonRemove}
          type="button_string"
          icon={CloseIcon}
          onClick={(e) => {
            e.stopPropagation();
            setImages([]);
          }}
        />
      )}
      {images.length <= 0 ? (
        <FileUploader
          className={styles.uploader}
          blockClassName={styles.uploadBlock}
          uploadAttachDescriptionClassName={styles.upload__attachDescription}
          inputId="avatar"
          files={images}
          maxFiles={1}
          maxSize={10}
          callBackUploadFiles={(files) => {
            setImages(files);
          }}
          dragonDrop
          attachDescription={attachDescription}
          attachDescriptionWithIcon={attachDescriptionWithIcon}
        />
      ) : (
        <Cropper
          image={images[0]?.file}
          crop={crop}
          zoom={zoom}
          maxZoom={initialWidth ? initialWidth / 350 : 1}
          aspect={4 / 4}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
          showGrid={false}
          cropShape="round"
        />
      )}
    </div>
  );
}

export default UserUploadAvatar;
