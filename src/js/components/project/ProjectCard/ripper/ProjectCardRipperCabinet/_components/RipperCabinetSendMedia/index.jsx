import { Component } from 'react';

import classNames from 'classnames';

import CommentInput from '@/components/common-ui/inputs/CommentInput';
import RipperCabinetCategoryLayout from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetCategoryLayout';
import RipperCabinetSave from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetSave';
import RipperCabinetFilesTable from '@/components/tables/RipperCabinetFilesTable';
import { changeInputHandler, validateField } from '@/utils/inputHandlersUtil';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';
import { ValidateBadRequestUtil } from '@/utils/validate/inputCheckValidate';

import styles from './styles.module.scss';

class RipperCabinetSendMedia extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.validateField = validateField.bind(this);
    this.badRequest = ValidateBadRequestUtil.bind(this);

    this.state = {
      comment: '',
      commentError: false,
      commentErrorMsg: '',
    };
  }

  disableSave = () => {
    const { uploadedDocuments } = this.props;

    const { comment, commentError } = this.state;

    return (!comment && uploadedDocuments.length === 0) || commentError;
  };

  render() {
    const {
      statusName,
      projectId,

      projectTitle,
      projectCovers,

      documents,
      uploadedDocuments,
      filesProps,

      shippingInfo: { shippingBudget, address, name, country: { title_en: countryName } = {} } = {},
    } = this.props;

    const { comment, commentError, commentErrorMsg } = this.state;

    const hasAddressInfo = !!address || !!name || !!countryName;
    const hasBudgetInfo = shippingBudget >= 0;

    return (
      <>
        <RipperCabinetCategoryLayout title="Shipping">
          <div className={classNames(styles.ripperCabinetMediaSold, 'inputs p-bottom-30')}>
            {(hasAddressInfo || hasBudgetInfo) && (
              <div className={classNames(styles.inputs__wrapper, 'p-bottom-30 m-bottom-30')}>
                {hasAddressInfo && (
                  <div className={styles.inputsItem}>
                    <div className={styles.inputsItem__name}>Shipping Address</div>
                    <p className={styles.inputsItem__descript}>
                      {name}
                      <br />
                      {address}
                      <br />
                      {countryName}
                    </p>
                  </div>
                )}
                {hasBudgetInfo && (
                  <div>
                    <div className={styles.inputsItem__name}>Shipping budget</div>
                    <p className={styles.inputsItem__descript}>
                      {floatWithCommaFixedUtil(shippingBudget)}
                      &euro;
                    </p>
                  </div>
                )}
              </div>
            )}
            <CommentInput
              label="Comment or tracking number"
              id="comment"
              comment={comment}
              commentError={commentError}
              commentErrorMsg={commentErrorMsg}
              validateField={this.validateField}
              onChange={this.changeInputHandler}
            />
          </div>
          <RipperCabinetFilesTable projectId={projectId} documents={documents} filesProps={filesProps} />
        </RipperCabinetCategoryLayout>
        <RipperCabinetSave
          statusName={statusName}
          projectId={projectId}
          projectTitle={projectTitle}
          projectCovers={projectCovers}
          comment={comment}
          uploadedDocuments={uploadedDocuments}
          changeStatus
          disabled={this.disableSave()}
          badRequest={this.badRequest}
          text="I've sent the media"
          filesProps={filesProps}
        />
      </>
    );
  }
}

export default RipperCabinetSendMedia;
