import { Component, createRef } from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';

import FileUploaderList from '@/components/common/FileUploader/_components/FileUploaderList';
import InProcessSpin from '@/components/common/InProcessSpin';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import Input from '@/components/ui/inputs/Input';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import FilesTypesConstants from '@/constants/files/types';
import AttachIcon from '@/icons/AttachIcon';
import CSVIcon from '@/icons/files/CSVIcon';
import PhotoIcon from '@/icons/PhotoIcon';

import styles from './styles.module.scss';

class FileUploader extends Component {
  constructor(props) {
    super(props);

    this.inputElement = createRef();

    const { inputId } = props;

    this.state = {
      [inputId]: '',
      [`${inputId}Error`]: false,
      [`${inputId}ErrorMsg`]: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { invalid } = this.props;
    const { invalid: invalidPrev } = prevProps;

    if (invalid !== invalidPrev && invalid) {
      this.setInvalidProp();
    }
  }

  setInvalidProp = () => {
    const { invalid, invalidMessage, inputId } = this.props;

    this.setState({
      [`${inputId}Error`]: invalid,
      [`${inputId}ErrorMsg`]: invalidMessage,
    });
  };

  onDrop = (e) => {
    e.preventDefault();
    if (this.uploadFilesOpen()) {
      this.onFileChange(e, e.dataTransfer.files);
    }
  };

  onFileChange = (event, f) => {
    const {
      files,
      filesBlob,
      callBackUploadFiles,
      callBackErrorRender,
      maxFiles,
      minSize,
      maxSize,
      callBackUploadBlobFiles,
      inputId,
      pattern,
      accept,
    } = this.props;

    this.setState({
      [`${inputId}Error`]: false,
      [`${inputId}ErrorMsg`]: '',
    });

    const Files = f || event.target.files;

    const stateFiles = cloneDeep(files);
    const stateBlobFiles = cloneDeep(filesBlob);
    const n = Files.length + files.length < maxFiles ? Files.length : maxFiles - files.length;

    for (let i = 0; i < n; i++) {
      const file = Files[i];
      const id = new Date().valueOf();

      const fileNameSplit = file.name.split('.') || [];
      const fileType = fileNameSplit[fileNameSplit.length - 1] || '';
      const isValidType = accept.indexOf(`.${fileType}`) > -1;

      if (!file) {
        return;
      }

      if (file.size > maxSize * 1024 * 1024) {
        callBackErrorRender('SIZE');

        this.setState({
          [`${inputId}Error`]: true,
          [`${inputId}ErrorMsg`]: `${CommonErrorMessages.MAX_FILE_SIZE} ${maxSize}Mb`,
        });

        return;
      }

      if (file.size < minSize * 1024 * 1024) {
        callBackErrorRender('SIZE');

        this.setState({
          [`${inputId}Error`]: true,
          [`${inputId}ErrorMsg`]: `${CommonErrorMessages.MIN_FILE_SIZE} ${minSize}Mb`,
        });

        return;
      }

      if ((file.type && !pattern.includes(file.type)) || (!file.type && !isValidType)) {
        callBackErrorRender('TYPE');

        this.setState({
          [`${inputId}Error`]: true,
          [`${inputId}ErrorMsg`]: `${CommonErrorMessages.FILE_TYPE} ${accept}`,
        });

        return;
      }

      stateBlobFiles.push({
        id,
        file,
        isAttachment: true,
        isBlob: true,
      });

      const reader = new FileReader();
      const fileName = file.name;
      reader.onload = () => {
        const newFile = {
          id,
          file: reader.result,
          fileName,
          isAttachment: true,
        };
        stateFiles.push(newFile);

        callBackUploadFiles(stateFiles);
      };

      reader.readAsDataURL(file);
    }

    callBackUploadBlobFiles(stateBlobFiles);
    this.resetInputForUploader();
  };

  resetInputForUploader = () => {
    if (this.inputElement.current) {
      const changeEvent = new Event('change');

      this.inputElement.current.value = null;
      this.inputElement.current.dispatchEvent(changeEvent);
    }
  };

  uploadFilesOpen = () => {
    const { files, maxFiles } = this.props;

    return files.length < maxFiles;
  };

  isFullVersion = () => {
    const { fullVersion } = this.props;

    return fullVersion;
  };

  renderLabel = () => {
    const {
      inputId,
      dragonDrop,
      attachDescription,
      attachButton: { text: attachButtonText } = {},
      uploadAttachDescriptionClassName,
      buttonAttachFileClassName,
    } = this.props;

    return (
      <label
        htmlFor={inputId}
        className={
          !dragonDrop ? classNames(styles.uploader__buttonAttachFile, buttonAttachFileClassName) : styles.uploader__label
        }
        title="Upload files"
      >
        {this.renderIconUpload()}
        {!!attachDescription && (
          <span className={classNames(styles.upload__attachDescription, uploadAttachDescriptionClassName)}>
            {attachDescription}
          </span>
        )}
        {!!attachButtonText && <div className="button gray-4 small-35 c-black">{attachButtonText}</div>}
      </label>
    );
  };

  renderInputFileUpload = () => {
    const {
      inputId,
      files,
      maxFiles,
      multiple,
      inputDisabled,
      onRemove,
      attachButton: { text: attachButtonText } = {},
      accept,
      onClick,
      inProcess,
      spinColor,
      blockClassName,
      listClassName,
      listContainerClassName,
      listItemClassName,
      listImageClassName,
      uploaderInputBlockClassName,
    } = this.props;

    return (
      <>
        <div
          className={classNames(
            styles.uploadBlock,
            't-center',
            blockClassName,
            inProcess || (inputDisabled && styles.uploadBlock_disabled),
            // eslint-disable-next-line react/destructuring-assignment
            !!this.state[`${inputId}Error`] && styles.uploadBlock_error,
            !!attachButtonText && styles.uploadBlock_only_button,
            // eslint-disable-next-line react/destructuring-assignment
            this.state[`${inputId}Error`] && !!attachButtonText && styles.uploadBlock_only_button_error
          )}
        >
          <TransitionLayout isShown={inProcess}>
            <InProcessSpin color={spinColor} />
          </TransitionLayout>
          {this.renderLabel()}
        </div>
        <TransitionLayout isShown={files.length > 0 && this.isFullVersion()}>
          <FileUploaderList
            className={classNames(styles.uploadList, listClassName)}
            containerClassName={classNames(styles.uploadList__container, listContainerClassName)}
            itemClassName={classNames(styles.uploadList__item, listItemClassName)}
            imageClassName={classNames(listImageClassName)}
            files={files}
            onRemove={onRemove}
            readOnly={inputDisabled}
          />
        </TransitionLayout>
        <Input
          className={classNames(styles.uploader__inputBlock, uploaderInputBlockClassName)}
          id={inputId}
          // eslint-disable-next-line react/destructuring-assignment
          invalid={this.state[`${inputId}Error`]}
          // eslint-disable-next-line react/destructuring-assignment
          invalidMessage={this.state[`${inputId}ErrorMsg`]}
          disabled={inputDisabled || inProcess}
          type="file"
          ref={this.inputElement}
          accept={accept}
          onChange={this.onFileChange}
          onClick={(e) => {
            e.stopPropagation();
            onClick(e);
          }}
          multiple={maxFiles > 1 ? multiple : false}
        />
      </>
    );
  };

  renderIconUpload = () => {
    const {
      accept,
      inputId,
      dragonDrop,
      attachButton: { text: attachButtonText } = {},
      attachDescriptionWithIcon = true,
    } = this.props;

    if (attachButtonText || !attachDescriptionWithIcon) {
      return null;
    }

    if (!dragonDrop) {
      return <AttachIcon />;
    }

    switch (accept) {
      case '.csv':
        return <CSVIcon />;
      default:
        return (
          <PhotoIcon
            // eslint-disable-next-line react/destructuring-assignment
            error={this.state[`${inputId}Error`]}
          />
        );
    }
  };

  render() {
    const { children, dragonDrop, dragonDropFile, className } = this.props;

    if (this.isFullVersion()) {
      return (
        <div
          className={classNames(
            className,
            styles.uploader,
            dragonDrop && styles.uploader_dragonDrop,
            dragonDropFile && styles.uploader_dragonDropFile
          )}
          onDragOver={(e) => e.preventDefault()}
          onDrop={this.onDrop}
        >
          {this.renderInputFileUpload()}
          {children}
        </div>
      );
    }

    return this.renderInputFileUpload();
  }
}

FileUploader.defaultProps = {
  files: [],
  filesBlob: [],
  callBackUploadFiles: () => {},
  callBackErrorRender: () => {},
  callBackUploadBlobFiles: () => {},
  onClick: () => {},
  maxFiles: 1,
  maxSize: 10,
  minSize: 0,
  fullVersion: false,
  inputDisabled: false,
  inputId: '',
  pattern: [FilesTypesConstants.IMAGE.JPEG, FilesTypesConstants.IMAGE.JPG, FilesTypesConstants.IMAGE.PNG],
  accept: 'image/jpeg,image/png,image/jpg',
  dragonDropFile: false,
  inProcess: false,
  spinColor: 'c-gray-2',
};

FileUploader.propTypes = {
  files: PropTypes.array,
  filesBlob: PropTypes.array,
  callBackUploadFiles: PropTypes.func,
  callBackErrorRender: PropTypes.func,
  callBackUploadBlobFiles: PropTypes.func,
  onClick: PropTypes.func,
  maxFiles: PropTypes.number,
  minSize: PropTypes.number,
  maxSize: PropTypes.number,
  inputId: PropTypes.string,
  inputDisabled: PropTypes.bool,
  fullVersion: PropTypes.bool,
  pattern: PropTypes.array,
  accept: PropTypes.string,
  dragonDropFile: PropTypes.bool,
  inProcess: PropTypes.bool,
  spinColor: PropTypes.string,
};

export default FileUploader;
