import { connect } from 'react-redux';

import BlockDisabledLayout from '@/components/layouts/BlockDisabledLayout';

function MarketplaceBlockDisabledLayout({ variablesList: { DIGITAL_MARKETPLACE_ENABLED } = {}, children }) {
  return <BlockDisabledLayout disabled={!DIGITAL_MARKETPLACE_ENABLED}>{children}</BlockDisabledLayout>;
}

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
}))(MarketplaceBlockDisabledLayout);
