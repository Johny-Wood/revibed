import { Component } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import CommentInput from '@/components/common-ui/inputs/CommentInput';
import FileUploader from '@/components/common/FileUploader';
import FileUploaderListNames from '@/components/common/FileUploader/_components/FileUploaderListNames';
import Popup from '@/components/primary/Popup';
import Button from '@/components/ui/buttons/Button';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import { addProjectCardDocumentAction } from '@/redux-actions/project/projectCardActions';
import { changeInputHandler, validateField } from '@/utils/inputHandlersUtil';

import styles from './styles.module.scss';

class ProjectUploadFilesPopup extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.validateField = validateField.bind(this);

    this.state = {
      commentFile: '',
      commentFileError: false,
      commentFileErrorMsg: '',

      files: [],
      filesBlob: [],
    };
  }

  onRemoveFiles = (id) => {
    const { files, filesBlob } = this.state;

    const tmpFiles = cloneDeep(files);
    const tmpBlobFiles = cloneDeep(filesBlob);

    const findFilesIdx = tmpFiles.findIndex((f) => f.id === id);
    const findBlobIdx = tmpBlobFiles.findIndex((f) => f.id === id);

    tmpFiles.splice(findFilesIdx, 1);
    tmpBlobFiles.splice(findBlobIdx, 1);

    this.setState({
      files: tmpFiles,
      filesBlob: tmpBlobFiles,
    });
  };

  disableButton = () => {
    const { files } = this.state;

    return files <= 0;
  };

  saveDocument = () => {
    const {
      popupId = PopupProjectIdsConstants.ProjectUploadFilesPopup,
      popupData: { projectId } = {},

      addProjectCardDocument,
      closePopup,
    } = this.props;

    const { commentFile, filesBlob } = this.state;

    if (this.disableButton()) {
      return;
    }

    const document = {
      id: new Date().getTime(),
      comment: commentFile,
      fileBlob: filesBlob[0],
    };

    addProjectCardDocument({
      projectCardId: projectId,
      document,
    });

    closePopup(popupId);
  };

  render() {
    const {
      popupId = PopupProjectIdsConstants.ProjectUploadFilesPopup,
      popupData: { fileMaxSize, fileMinSize, maxFiles = 1, accept, pattern } = {},
    } = this.props;

    const {
      commentFile,
      commentFileError,
      commentFileErrorMsg,

      files,
      filesBlob,
    } = this.state;

    return (
      <Popup
        popupId={popupId}
        textAlign="left"
        headerText="Upload file"
        classCustom={styles.ProjectUploadFilesPopup}
        maxWidth={450}
      >
        <div className="m-top-5 w-100pct">
          <b>Comment</b>
          <CommentInput
            id="commentFile"
            comment={commentFile}
            commentError={commentFileError}
            commentErrorMsg={commentFileErrorMsg}
            onChange={this.changeInputHandler}
            placeholder="Comment"
            validateField={this.validateField}
            sendRequest={this.saveDocument}
          />
        </div>
        <FileUploaderListNames files={files} onRemove={this.onRemoveFiles} />
        {files.length < maxFiles && (
          <FileUploader
            className="m-top-5"
            maxFiles={maxFiles}
            maxSize={fileMaxSize}
            minSize={fileMinSize}
            attachButton={{
              text: 'Choose file',
            }}
            accept={accept}
            pattern={pattern}
            files={files}
            filesBlob={filesBlob}
            inputId="files"
            callBackUploadFiles={(filesList) => {
              this.setState({
                files: filesList,
              });
            }}
            callBackUploadBlobFiles={(filesList) => {
              this.setState({
                filesBlob: filesList,
              });
            }}
            buttonAttachFileClassName={styles.uploader__buttonAttachFile}
            uploaderInputBlockClassName="w-100pct m-top-5"
          />
        )}
        <Button className="w-100pct m-top-30" text="Upload" disabled={this.disableButton()} onClick={this.saveDocument} />
      </Popup>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    addProjectCardDocument: ({ document, projectCardId }) => {
      dispatch(addProjectCardDocumentAction({ document, projectCardId }));
    },
  })
)(ProjectUploadFilesPopup);
