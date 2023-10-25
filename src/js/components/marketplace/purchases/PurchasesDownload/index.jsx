import { useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ComponentsCommonConstants from '@/constants/components/common';
import DownloadFileIcon from '@/icons/files/DownloadFileIcon';
import { downloadPurchasesRequestAction } from '@/redux-actions/personal/purchasesActions';
import ProcessService from '@/services/ProcessService';

import styles from './styles.module.scss';

function PurchasesDownload({
  isAll,
  targetType,
  targetId,
  downloadPurchasesInProcessIds,
  downloadPurchasesRequest,
  size = ComponentsCommonConstants.Size.SMALL35,
  ...restProps
}) {
  const [progress, setProgress] = useState(0);

  const isInProcess = useMemo(() => downloadPurchasesInProcessIds.includes(targetId), [downloadPurchasesInProcessIds, targetId]);

  const isDisabled = useMemo(() => downloadPurchasesInProcessIds.length > 0, [downloadPurchasesInProcessIds]);

  useEffect(
    () => () => {
      ProcessService.setProcess({
        id: targetId,
        params: {
          callback: null,
        },
      });
    },
    [targetId]
  );

  useEffect(() => {
    if (!isInProcess) {
      setProgress(0);

      return;
    }

    ProcessService.setProcess({
      id: targetId,
      params: {
        callback: ({ progressValue } = {}) => {
          if (progressValue > 0) {
            setProgress(progressValue);
          }
        },
      },
    });
  }, [isInProcess, targetId]);

  useEffect(() => {
    if (progress === 99) {
      setProgress(100);
    }
    if (progress === 100) {
      setProgress(0);
    }
  }, [progress]);

  if (!targetType || !targetId) {
    return null;
  }

  return (
    <ButtonIcon
      className={classNames(
        styles.purchaseDownloadButton,
        size === ComponentsCommonConstants.Size.LARGE && styles.purchaseDownloadButton_large
      )}
      text={!isInProcess && progress === 0 ? `Download${isAll ? ' All' : ''}` : ''}
      icon={!isInProcess && progress === 0 && DownloadFileIcon}
      isInProcess={isInProcess && progress === 0}
      progress={progress}
      disabled={isDisabled}
      transparent
      borderColor="gray-3"
      size={size}
      {...restProps}
      onClick={() => {
        if (isDisabled) {
          return;
        }

        downloadPurchasesRequest({ targetType, targetId });
      }}
    />
  );
}

export default connect(
  (state) => ({
    downloadPurchasesInProcessIds: state.PurchasesReducer.downloadPurchasesInProcessIds,
  }),
  (dispatch) => ({
    downloadPurchasesRequest: (params = {}) => downloadPurchasesRequestAction({ ...params, dispatch }),
  })
)(PurchasesDownload);
