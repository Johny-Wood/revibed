import { connect } from 'react-redux';

import RipperCabinetCategoryLayout from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetCategoryLayout';
import Button from '@/components/ui/buttons/Button';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import LinkDefault from '@/components/ui/links/LinkDefault';
import Table from '@/components/ui/Table';
import { CommonMessagesConstants } from '@/constants/common/message';
import ComponentsCommonConstants from '@/constants/components/common';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import CloseIcon from '@/icons/control/close/CloseIcon';
import DownloadFileIcon from '@/icons/files/DownloadFileIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { removeProjectCardAdditionalExpensesAction } from '@/redux-actions/project/projectCardActions';
import { getDateFormatUtil } from '@/utils/dateUtils';

import styles from './styles.module.scss';

const renderActions = ({ documents = [], filesBlob = [], removeProjectCardAdditionalExpenses, id, projectId }) => (
  <>
    {documents.length > 0 && (
      <>
        {documents.map(({ id: documentId, path }) => (
          <LinkDefault
            key={`ripper-expenses-${documentId}`}
            className={styles.buttonRipperDownloadFile}
            href={path}
            icon={DownloadFileIcon}
          />
        ))}
      </>
    )}
    {filesBlob.length > 0 && (
      <ButtonIcon
        className={styles.buttonRipperDownloadFile}
        icon={CloseIcon}
        onClick={() => {
          removeProjectCardAdditionalExpenses({
            expenseId: id,
            projectCardId: projectId,
          });
        }}
      />
    )}
  </>
);

const itemMapper = ({
  isNotDesktop,
  id,
  sum,
  comment,
  date,
  documents,
  filesBlob,
  projectId,

  removeProjectCardAdditionalExpenses,
}) =>
  isNotDesktop
    ? [
        {
          key: `${id}-1`,
          component: sum,
        },
        {
          key: `${id}-2`,
          component: <span className="t-ellipsis">{comment}</span>,
        },
        {
          key: `${id}-4`,
          component: (
            <>
              {renderActions({
                documents,
                filesBlob,
                removeProjectCardAdditionalExpenses,
                id,
                projectId,
              })}
            </>
          ),
        },
      ]
    : [
        {
          key: `${id}-1`,
          component: sum,
        },
        {
          key: `${id}-2`,
          component: <span className="t-ellipsis">{comment}</span>,
        },
        {
          key: `${id}-3`,
          component: <span className="f-y-center w-100pct">{date ? getDateFormatUtil(date) : '---'}</span>,
        },
        {
          key: `${id}-4`,
          component: (
            <>
              {renderActions({
                documents,
                filesBlob,
                removeProjectCardAdditionalExpenses,
                id,
                projectId,
              })}
            </>
          ),
        },
      ];

function RipperCabinetAdditionalExpensesTable({
  projectId,
  expenses = [],
  fileMaxSize,
  fileMinSize,
  accept,
  pattern,
  removeProjectCardAdditionalExpenses,
  showPopup,
}) {
  const { isNotDesktop } = ViewportHook();

  return (
    <RipperCabinetCategoryLayout title="Additional Expenses">
      <div className={styles.ripperAdditionalExpenses}>
        <Button
          className={styles.button}
          text={CommonMessagesConstants.ADD}
          color="gray-4"
          size={ComponentsCommonConstants.Size.SMALL40}
          onClick={() => {
            showPopup(PopupProjectIdsConstants.AddAdditionalExpensesPopup, {
              projectId,
              fileMaxSize,
              fileMinSize,
              accept,
              pattern,
            });
          }}
        />
        <div className={styles.ripperAdditionalExpenses__content}>
          <Table
            items={expenses.map((item) =>
              itemMapper({
                ...item,
                isNotDesktop,
                projectId,
                removeProjectCardAdditionalExpenses,
              })
            )}
            headerColumns={
              isNotDesktop
                ? [
                    {
                      key: 1,
                      name: 'Amount',
                      keyItem: 'sum',
                      align: 'start',
                      width: 80,
                      minWidth: 80,
                    },
                    {
                      key: 2,
                      name: 'Comment',
                      keyItem: 'comment',
                      align: 'start',
                      width: '55%',
                      grow: 1,
                    },
                    {
                      key: 4,
                      name: 'Image',
                      align: 'end',
                      width: 50,
                      minWidth: 50,
                    },
                  ]
                : [
                    {
                      key: 1,
                      name: 'Amount',
                      keyItem: 'sum',
                      align: 'start',
                      width: 120,
                      grow: 1,
                    },
                    {
                      key: 2,
                      name: 'Comment',
                      keyItem: 'comment',
                      align: 'start',
                      width: 300,
                    },
                    {
                      key: 3,
                      name: 'Date',
                      align: 'start',
                      width: 140,
                    },
                    {
                      key: 4,
                      name: 'Image',
                      align: 'end',
                      width: 50,
                    },
                  ]
            }
            withHeaderOnly
          />
        </div>
      </div>
    </RipperCabinetCategoryLayout>
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    removeProjectCardAdditionalExpenses: ({ expenseId, projectCardId }) => {
      dispatch(
        removeProjectCardAdditionalExpensesAction({
          expenseId,
          projectCardId,
        })
      );
    },
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(RipperCabinetAdditionalExpensesTable);
