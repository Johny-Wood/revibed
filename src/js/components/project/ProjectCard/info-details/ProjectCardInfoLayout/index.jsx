import classNames from 'classnames';

import styles from './styles.module.scss';

function ProjectCardInfoLayout({
  title,

  className,
  containerClassName,

  children,
}) {
  return (
    <div className={classNames(styles.projectCardDetails, className)}>
      {!!title && <h2 className={classNames(styles.projectCardDetails__title)}>{title}</h2>}
      <div className={classNames(styles.projectCardDetails__container, containerClassName)}>{children}</div>
    </div>
  );
}

export default ProjectCardInfoLayout;
