import { useState } from 'react';

import { connect } from 'react-redux';

import PlanPackagesWantList from '@/components/wantList/plan/PlanWantList/_components/PlanPackagesWantList';

function PlanWantList({ plansWantList, wantListInfo: { plan: currentPlan = {} } = {} }) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);

  const { id: currentPlanId } = currentPlan;

  if (plansWantList.length === 0) {
    return null;
  }

  return (
    <div className="want-list-plan">
      <PlanPackagesWantList
        items={plansWantList}
        selectedPlan={selectedPlan}
        currentPlanId={currentPlanId}
        onChange={(packageItem) => setSelectedPlan(packageItem)}
      />
    </div>
  );
}

export default connect((state) => ({
  plansWantList: state.WantListReducer.plansWantList,
  wantListInfo: state.WantListReducer.wantListInfo,
}))(PlanWantList);
