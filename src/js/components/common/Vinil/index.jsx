import React, { useState } from 'react';

import classNames from 'classnames';
import Image from 'next/image';

import styles from './index.module.scss';

const Vinil = ({ src, width, height, alt = 'vinil', quality = 100, className }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUnHovered, setIsUnhovered] = useState(false);

  return (
    <Image
      className={classNames(
        className,
        styles.vinil,
        isClicked && styles['vinil--stop'],
        isHovered && styles['vinil--zoom'],
        isUnHovered && styles['vinil--out']
      )}
      src={src}
      width={width}
      height={height}
      alt={alt}
      quality={quality}
      onClick={() => setIsClicked((prev) => !prev)}
      onMouseEnter={() => {
        setIsUnhovered(false);
        setIsHovered((prev) => !prev);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsClicked(false);
        setIsUnhovered((prev) => !prev);
      }}
    />
  );
};

export default Vinil;
