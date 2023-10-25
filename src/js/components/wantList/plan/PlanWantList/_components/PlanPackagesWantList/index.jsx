import { Fragment } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import { connect } from 'react-redux';

import Button from '@/components/ui/buttons/Button';
import PlanPackageWantList from '@/components/wantList/plan/PlanWantList/_components/PlanPackageWantList';
import { PopupProjectIdsConstants, PopupWantListIdsConstants } from '@/constants/popups/id';
import { showPopupAction } from '@/redux-actions/components/popupActions';

import styles from './styles.module.scss';

function PlanPackagesWantList({
  items = [],
  selectedId,
  currentPlanId,
  selectedPlan,
  onChange,
  userInfo: { balance: userBalance } = {},

  showPopup,
}) {
  const {
    id: selectedPlanId,
    name: selectedPlanName,
    description: selectedPlanDescription,
    sum: selectedPlanSum,
    activationStartDate: selectedActivationStartDate,
    releaseCount: selectedPlanReleaseCount,
  } = selectedPlan;

  const hasNameField = items.findIndex(({ name }) => name) > -1;
  const hasDescriptionField = items.findIndex(({ description }) => description) > -1;
  const hasSumField = items.findIndex(({ sum }) => sum >= 0) > -1;

  return (
    <>
      <div className={styles.wantListPlanPackages}>
        {orderBy(cloneDeep(items), ['archived', 'sum'], ['asc', 'asc']).map((packageItem) => {
          const { id } = packageItem;

          return (
            <Fragment key={`plan-want-list-${id}`}>
              <PlanPackageWantList
                package={packageItem}
                checked={selectedPlanId === id || (!selectedPlanId && currentPlanId === id)}
                onChange={() => onChange(packageItem)}
                hasNameField={hasNameField}
                hasDescriptionField={hasDescriptionField}
                hasSumField={hasSumField}
                current={currentPlanId === id}
              />
            </Fragment>
          );
        })}
      </div>
      <div className={styles.wantListPlanPackages__action}>
        <Button
          text="Change plan"
          transparent
          borderColor="gray-3"
          disabled={selectedId === -1 || currentPlanId === selectedPlanId}
          onClick={() => {
            if (selectedId === -1 || currentPlanId === selectedPlanId) {
              return;
            }

            if (userBalance < selectedPlanSum) {
              showPopup(PopupProjectIdsConstants.InsufficientFundsPopup);
            } else {
              showPopup(PopupWantListIdsConstants.ChangePlanWantListPopup, {
                selectedPlanNew: {
                  selectedPlanId,
                  selectedPlanName,
                  selectedPlanDescription,
                  selectedPlanReleaseCount,
                  selectedPlanSum,
                  selectedActivationStartDate,
                },
              });
            }
          }}
        />
      </div>
    </>
  );
}

export default connect(
  (state) => ({
    userInfo: state.AuthReducer.userInfo,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(PlanPackagesWantList);
