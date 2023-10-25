import { useEffect, useState } from 'react';

import ImageLiteBoxContent from '@/components/global/ImageLiteBox/_components/ImageLiteBoxContent';
import ImageLiteBoxService from '@/services/ImageLiteBoxService';

function ImageLiteBox() {
  const [shown, setShown] = useState(false);
  const [imagesImageLiteBox, setImagesImageLiteBox] = useState([]);
  const [imageLiteBoxConfig, setImageLiteBoxConfig] = useState({});
  const [iframeLiteBox, setIframeLiteBox] = useState('');
  const [activeIdxImageLiteBox, setActiveIdxImageLiteBox] = useState(0);

  useEffect(() => {
    ImageLiteBoxService.setImagesCallback(() => {
      const { activeSlideIdx, images, opened, config, iframe } = ImageLiteBoxService.getInstance();

      setShown(opened);
      setImagesImageLiteBox(images);
      setImageLiteBoxConfig(config);
      setIframeLiteBox(iframe);
      setActiveIdxImageLiteBox(activeSlideIdx);
    });
  }, []);

  const onSetShowLiteBox = () => {
    const { images = [], iframe = '' } = ImageLiteBoxService.getInstance();

    ImageLiteBoxService.resetImages();
    ImageLiteBoxService.resetIframe();
    ImageLiteBoxService.setConfig({});
    ImageLiteBoxService.close();

    setShown(false);
    setImagesImageLiteBox(images);
    setImageLiteBoxConfig({});
    setIframeLiteBox(iframe);
    setActiveIdxImageLiteBox(0);
  };

  return (
    <ImageLiteBoxContent
      shownLiteBox={shown}
      images={imagesImageLiteBox}
      iframe={iframeLiteBox}
      activeSlideIdx={activeIdxImageLiteBox}
      onSetShowLiteBox={onSetShowLiteBox}
      {...imageLiteBoxConfig}
    />
  );
}

export default ImageLiteBox;
