import { Component } from 'react';

import CommentInput from '@/components/common-ui/inputs/CommentInput';
import RipperCabinetCategoryLayout from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetCategoryLayout';
import RipperCabinetSave from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetSave';
import RipperCabinetFilesTable from '@/components/tables/RipperCabinetFilesTable';
import Input from '@/components/ui/inputs/Input';
import { changeInputHandler, validateField } from '@/utils/inputHandlersUtil';
import { ValidateBadRequestUtil } from '@/utils/validate/inputCheckValidate';

class RipperCabinetRipPending extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.validateField = validateField.bind(this);
    this.badRequest = ValidateBadRequestUtil.bind(this);

    this.state = {
      ripComment: '',
      ripCommentError: false,
      ripCommentErrorMsg: '',

      ripLink: '',
      ripLinkError: false,
      ripLinkErrorMsg: '',
    };
  }

  disableSave = () => {
    const { ripLink, ripLinkError, ripCommentError } = this.state;

    const { uploadedDocuments } = this.props;

    return (!ripLink || ripLinkError || ripCommentError) && uploadedDocuments.length === 0;
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
    } = this.props;

    const {
      ripComment,
      ripCommentError,
      ripCommentErrorMsg,

      ripLink,
      ripLinkError,
      ripLinkErrorMsg,
    } = this.state;

    return (
      <>
        <RipperCabinetCategoryLayout title="Rip">
          <div className="inputs">
            <div className="inputs__item w-100pct">
              <div className="m-bottom-10">
                <b>Link on rip</b>
              </div>
              <Input
                id="ripLink"
                label="Paste link"
                value={ripLink}
                invalid={ripLinkError}
                invalidMessage={ripLinkErrorMsg}
                onChange={this.changeInputHandler}
                onBlur={(e) => {
                  this.validateField(e, {
                    validateEmptyField: true,
                  });
                }}
              />
            </div>
            <CommentInput
              label="Comment"
              id="ripComment"
              comment={ripComment}
              commentError={ripCommentError}
              commentErrorMsg={ripCommentErrorMsg}
              validateField={this.validateField}
              onChange={this.changeInputHandler}
            />
          </div>
        </RipperCabinetCategoryLayout>
        <RipperCabinetFilesTable projectId={projectId} documents={documents} filesProps={filesProps} />
        <RipperCabinetSave
          statusName={statusName}
          projectId={projectId}
          projectTitle={projectTitle}
          projectCovers={projectCovers}
          ripLink={ripLink}
          ripComment={ripComment}
          uploadedDocuments={uploadedDocuments}
          disabled={this.disableSave()}
          badRequest={this.badRequest}
          filesProps={filesProps}
        />
      </>
    );
  }
}

export default RipperCabinetRipPending;
