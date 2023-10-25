/**
 * @param {String} imageSrc - Image File Object
 * @param {Object} crop - crop Object
 * @param {String} fileName - Name of the returned file in Promise
 */
function getCroppedImg(imageSrc, crop, fileName) {
  if (!imageSrc) {
    return;
  }

  const image = new Image();
  image.src = imageSrc;

  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  // As Base64 string
  // const base64Image = canvas.toDataURL('image/jpeg');

  // As a blob
  // eslint-disable-next-line consistent-return
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        blob.name = fileName;

        resolve({
          blobImage: blob,
          base64Image: canvas.toDataURL('image/jpeg'),
        });
      },
      'image/jpeg',
      1
    );
  });
}

export default getCroppedImg;
