import { Component } from 'react';

import RipperCabinetCategoryLayout from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetCategoryLayout';
import RipperCabinetConditions from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetConditions';
import RipperCabinetFactualConditions from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetFactualConditions';
import RipperCabinetSave from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetSave';
import RipperCabinetAdditionalExpensesTable from '@/components/tables/RipperCabinetAdditionalExpensesTable';
import RipperCabinetFilesTable from '@/components/tables/RipperCabinetFilesTable';
import { changeInputHandler, validateField } from '@/utils/inputHandlersUtil';

class RipperCabinetShipped extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.validateField = validateField.bind(this);

    const { realConditions: { realMediaCondition, realSleeveCondition } = {} } = props;

    this.state = {
      realMediaCondition,
      realSleeveCondition,
      comment: '',
      commentError: false,
      commentErrorMsg: '',
    };
  }

  changeMediaCondition = (realMediaCondition) => {
    this.setState({
      realMediaCondition: realMediaCondition[0] || {},
    });
  };

  changeSleeveCondition = (realSleeveCondition) => {
    this.setState({
      realSleeveCondition: realSleeveCondition[0] || {},
    });
  };

  disableSave = () => {
    const {
      commentError,
      realMediaCondition: { id: realMediaConditionId } = {},
      realSleeveCondition: { id: realSleeveConditionId } = {},
    } = this.state;

    const { uploadedDocuments, uploadedExpenses } = this.props;

    return (
      commentError ||
      (uploadedDocuments.length === 0 && uploadedExpenses.length === 0 && (!realMediaConditionId || !realSleeveConditionId)) ||
      (realMediaConditionId && !realSleeveConditionId) ||
      (!realMediaConditionId && realSleeveConditionId)
    );
  };

  render() {
    const {
      statusName,
      projectId,

      conditions,
      realConditions,

      projectTitle,
      projectCovers,

      documents,
      uploadedDocuments,

      expenses,
      uploadedExpenses,

      withExpenses = true,
      filesProps,
    } = this.props;

    const {
      comment,
      commentError,
      commentErrorMsg,

      realMediaCondition,
      realSleeveCondition,
    } = this.state;

    return (
      <>
        <RipperCabinetCategoryLayout title="Item condition">
          <RipperCabinetConditions conditions={conditions} />
          <RipperCabinetFactualConditions
            conditions={realConditions}
            comment={comment}
            commentError={commentError}
            commentErrorMsg={commentErrorMsg}
            validateField={this.validateField}
            changeInputHandler={this.changeInputHandler}
            changeMediaCondition={this.changeMediaCondition}
            changeSleeveCondition={this.changeSleeveCondition}
            realMediaCondition={realMediaCondition}
            realSleeveCondition={realSleeveCondition}
          />
        </RipperCabinetCategoryLayout>
        <RipperCabinetFilesTable projectId={projectId} documents={documents} filesProps={filesProps} />
        {withExpenses && <RipperCabinetAdditionalExpensesTable projectId={projectId} expenses={expenses} {...filesProps} />}
        <RipperCabinetSave
          statusName={statusName}
          projectId={projectId}
          projectTitle={projectTitle}
          projectCovers={projectCovers}
          realMediaCondition={realMediaCondition}
          realSleeveCondition={realSleeveCondition}
          realConditionComment={comment}
          uploadedDocuments={uploadedDocuments}
          uploadedExpenses={withExpenses ? uploadedExpenses : undefined}
          disabled={this.disableSave()}
          filesProps={filesProps}
        />
      </>
    );
  }
}

export default RipperCabinetShipped;
