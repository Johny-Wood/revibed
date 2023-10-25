import classNames from 'classnames';

import DateFormat from '@/components/common/date/DateFormat';
import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import Coin from '@/components/ui/currency/Coin';
import RadioButton from '@/components/ui/inputs/RadioButton';

import styles from './styles.module.scss';

const renderSubscriptionEndDate = ({ subscriptionEndDate }) => {
  if (!subscriptionEndDate) {
    return null;
  }

  return <DateFormat date={subscriptionEndDate} />;
};

function PlanPackageWantList({
  package: { id, name = '', description = '', sum = -1, color, archived, active, subscriptionEndDate, default: defaultPlan } = {},

  hasSumField,
  hasDescriptionField,
  hasNameField,

  current,

  checked,
  onChange = () => {},
}) {
  return (
    <label
      htmlFor={id}
      className={classNames(
        styles.wantListPlanPackage,
        archived && styles.wantListPlanPackage_archived,
        current && styles.wantListPlanPackage_current
      )}
      style={{ backgroundColor: color }}
    >
      <RadioButton
        id={id}
        name="balance-package"
        className={styles.radioButtonBlock}
        onChange={onChange}
        checked={checked}
        rounded
      />
      <div className={styles.wantListPlanPackage__columns}>
        {(name || hasNameField) && (
          <div className={styles.wantListPlanPackage__name}>
            <b>
              {name}
              &nbsp;
            </b>
            {archived && <span className={styles.wantListPlanPackage__name_archived}>(Archived)</span>}
          </div>
        )}
        <span
          className={classNames(
            styles.wantListPlanPackage__description,
            styles.wantListPlanPackage__description_current,
            'c-gray-2'
          )}
        >
          {current && (
            <>
              Current
              <DesktopLayout>&nbsp;plan</DesktopLayout>
              &nbsp;
            </>
          )}
          {(sum > 0 || archived) && active && !!subscriptionEndDate && (
            <span className={styles.wantListPlanPackage__date}>
              {defaultPlan && !archived ? (
                <>
                  Renew on
                  {renderSubscriptionEndDate({ subscriptionEndDate })}
                </>
              ) : (
                <>
                  Expires
                  {renderSubscriptionEndDate({ subscriptionEndDate })}
                </>
              )}
            </span>
          )}
        </span>
      </div>
      <div className={styles.wantListPlanPackage__columns}>
        {(description || hasDescriptionField) && <span className={styles.wantListPlanPackage__description}>{description}</span>}
        {(sum >= 0 || hasSumField) && (
          <span className={styles.wantListPlanPackage__sum}>
            {sum >= 0 && (
              <span>
                <Coin size={12}>{sum}</Coin>
                <span className="c-gray-2">&nbsp;/month</span>
              </span>
            )}
          </span>
        )}
      </div>
    </label>
  );
}

export default PlanPackageWantList;
