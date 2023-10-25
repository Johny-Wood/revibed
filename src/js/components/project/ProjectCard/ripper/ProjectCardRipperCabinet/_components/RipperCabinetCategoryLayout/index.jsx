import styles from './styles.module.scss';

function RipperCabinetCategoryLayout({ title, children }) {
  return (
    <div className={styles.ripperCabinetCategory}>
      <h3 className={styles.ripperCabinetCategory__title}>{title}</h3>
      {children}
    </div>
  );
}

export default RipperCabinetCategoryLayout;
