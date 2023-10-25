import { Component } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import CommentInput from '@/components/common-ui/inputs/CommentInput';
import FileUploader from '@/components/common/FileUploader';
import FileUploaderListNames from '@/components/common/FileUploader/_components/FileUploaderListNames';
import Popup from '@/components/primary/Popup';
import Button from '@/components/ui/buttons/Button';
import Input from '@/components/ui/inputs/Input';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import { addProjectCardAdditionalExpensesAction } from '@/redux-actions/project/projectCardActions';
import { changeInputHandler, pressEnterKeyInputHandler, validateField } from '@/utils/inputHandlersUtil';

import styles from './styles.module.scss';

class AddAdditionalExpensesPopup extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.validateField = validateField.bind(this);

    this.state = {
      sum: '',
      sumError: false,
      sumErrorMsg: '',

      expenseComment: '',
      expenseCommentError: false,
      expenseCommentErrorMsg: '',

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
    const { filesBlob, sum, sumError, expenseComment, expenseCommentError } = this.state;

    return filesBlob.length === 0 || !sum || sumError || !expenseComment || expenseCommentError;
  };

  saveDocument = () => {
    const {
      popupId = PopupProjectIdsConstants.AddAdditionalExpensesPopup,
      popupData: { projectId } = {},

      addProjectCardAdditionalExpenses,
      closePopup,
    } = this.props;

    const { expenseComment, filesBlob, sum } = this.state;

    if (this.disableButton()) {
      return;
    }

    const expense = {
      id: new Date().getTime(),
      sum,
      comment: expenseComment,
      filesBlob,
    };

    addProjectCardAdditionalExpenses({
      projectCardId: projectId,
      expense,
    });

    closePopup(popupId);
  };

  render() {
    const {
      popupId = PopupProjectIdsConstants.AddAdditionalExpensesPopup,
      popupData: { fileMaxSize, fileMinSize, maxFiles = 1, accept, pattern } = {},
    } = this.props;

    const {
      sum,
      sumError,
      sumErrorMsg,

      expenseComment,
      expenseCommentError,
      expenseCommentErrorMsg,

      files,
      filesBlob,
    } = this.state;

    return (
      <Popup popupId={popupId} textAlign="left" headerText="Additional Expenses" classCustom={styles.AddAdditionalExpensesPopup}>
        <div className="m-top-5 w-100pct">
          <b>
            Amount
            <span className="footnote-red" />
          </b>
          <Input
            id="sum"
            placeholder="Euro"
            value={sum}
            invalid={sumError}
            invalidMessage={sumErrorMsg}
            fractionDigits={2}
            typeValue="float"
            min={0}
            onChange={this.changeInputHandler}
            onKeyDown={(e) => pressEnterKeyInputHandler(e, this.saveDocument)}
          />
        </div>
        <div className="m-top-5 w-100pct">
          <b>
            Comment
            <span className="footnote-red" />
          </b>
          <CommentInput
            id="expenseComment"
            comment={expenseComment}
            commentError={expenseCommentError}
            commentErrorMsg={expenseCommentErrorMsg}
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
        <Button className="w-100pct m-top-30" text="Add expenses" disabled={this.disableButton()} onClick={this.saveDocument} />
      </Popup>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    addProjectCardAdditionalExpenses: ({ expense, projectCardId }) => {
      dispatch(
        addProjectCardAdditionalExpensesAction({
          expense,
          projectCardId,
        })
      );
    },
  })
)(AddAdditionalExpensesPopup);
