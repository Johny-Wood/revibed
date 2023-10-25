import Select from '@/components/ui/selects/Select';

import styles from './styles.module.scss';

const ITEMS_OPTIONS = [
  {
    id: 10,
    value: 10,
    label: '10',
  },
  {
    id: 15,
    value: 15,
    label: '15',
  },
  {
    id: 25,
    value: 25,
    label: '25',
  },
  {
    id: 50,
    value: 50,
    label: '50',
  },
];

function ItemsPerPage({ size, totalPages, currentNumber, onChange, itemsOption = ITEMS_OPTIONS }) {
  if (totalPages <= 0 || totalPages <= currentNumber) {
    return null;
  }

  const defaultSelectSize = ITEMS_OPTIONS.map(({ value }) => value).reduce((prev, curr) =>
    Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev
  );

  return (
    <div className={styles.itemsPerPage}>
      <Select
        itemsPerPage
        toggled
        selected={[itemsOption.find(({ value }) => value === (size || defaultSelectSize))]}
        options={itemsOption}
        optionListPositionX="right"
        onSelectItem={(item, selectItemId) => {
          onChange(item, selectItemId);
        }}
        className={styles.select}
      />
    </div>
  );
}

export default ItemsPerPage;
