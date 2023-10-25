import { connect } from 'react-redux';

import LinkDefault from '@/components/ui/links/LinkDefault';

function BetaEmail({ variablesList: { emails: { beta: betaEmail = '' } = {} } = {}, text = betaEmail }) {
  return <LinkDefault href={`mailto:${betaEmail}`} text={text} className="c-blue" />;
}

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
}))(BetaEmail);
