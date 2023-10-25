import Flag from '@/components/common/Flag';

import styles from './styles.module.scss';

function CountrySelectFlag({ labelGenerator, country, forRegistration, alias }) {
  return (
    <span className={styles.countrySelectFlag}>
      <Flag country={labelGenerator(country)} alias={forRegistration ? alias : ''} />
    </span>
  );
}

export default CountrySelectFlag;
