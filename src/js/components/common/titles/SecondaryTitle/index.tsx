import classNames from 'classnames';

import styles from './styles.module.scss';

type SecondaryTitleProps = {
  title: string;
  icon?: JSX.Element;
  className?: string;
};

function SecondaryTitle({ title, icon, className }: SecondaryTitleProps) {
  return (
    <h2 className={classNames(styles.SecondaryTitle, className)}>
      {!!icon && <span className={classNames(styles.SecondaryTitle__icon)}>{icon}</span>}
      {title}
    </h2>
  );
}

export default SecondaryTitle;
