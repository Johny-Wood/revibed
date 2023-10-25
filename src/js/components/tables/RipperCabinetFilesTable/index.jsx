import { connect } from 'react-redux';

import RipperCabinetCategoryLayout from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetCategoryLayout';
import ProjectUploadFiles from '@/components/project/ProjectUploadFiles';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import LinkDefault from '@/components/ui/links/LinkDefault';
import Table from '@/components/ui/Table';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import CloseIcon from '@/icons/control/close/CloseIcon';
import DownloadFileIcon from '@/icons/files/DownloadFileIcon';
import { removeProjectCardDocumentAction } from '@/redux-actions/project/projectCardActions';
import { getDateFormatUtil } from '@/utils/dateUtils';

import styles from './styles.module.scss';

const renderActions = ({ path, fileBlob, removeProjectCardDocument, id, projectId }) => (
  <>
    {!!path && <LinkDefault href={path} icon={DownloadFileIcon} className={styles.buttonRipperDownloadFile} />}
    {!!fileBlob && (
      <ButtonIcon
        className={styles.buttonRipperDownloadFile}
        icon={CloseIcon}
        onClick={() => {
          removeProjectCardDocument({ documentId: id, projectCardId: projectId });
        }}
      />
    )}
  </>
);

const itemMapper = ({
  id,
  comment,
  createdAt,
  path,
  fileBlob,
  isNotDesktop,
  projectId,

  removeProjectCardDocument,
}) =>
  isNotDesktop
    ? [
        {
          key: `${id}-1`,
          component: <span className="t-ellipsis">{comment}</span>,
        },
        {
          key: `${id}-3`,
          component: (
            <>
              {renderActions({
                path,
                fileBlob,
                removeProjectCardDocument,
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
          component: <span className="t-ellipsis">{comment}</span>,
        },
        {
          key: `${id}-2`,
          component: <span className="f-y-center w-100pct">{createdAt ? getDateFormatUtil(createdAt) : '---'}</span>,
        },
        {
          key: `${id}-3`,
          component: (
            <>
              {renderActions({
                path,
                fileBlob,
                removeProjectCardDocument,
                id,
                projectId,
              })}
            </>
          ),
        },
      ];

function RipperCabinetFilesTable({
  documents = [],
  projectId,
  canUpload = true,

  filesProps,
  removeProjectCardDocument,
}) {
  const { isNotDesktop } = ViewportHook();

  return (
    <RipperCabinetCategoryLayout title="Files">
      {canUpload && <ProjectUploadFiles projectId={projectId} {...filesProps} />}
      <div className={styles.ripperCabinetFiles}>
        <Table
          items={documents.map((item) =>
            itemMapper({
              ...item,
              isNotDesktop,
              projectId,
              removeProjectCardDocument,
            })
          )}
          headerColumns={
            isNotDesktop
              ? [
                  {
                    key: 1,
                    name: 'Comment',
                    keyItem: 'comment',
                    align: 'start',
                    width: '72%',
                    grow: 1,
                  },
                  {
                    key: 2,
                    name: 'Download',
                    align: 'end',
                    width: 80,
                    minWidth: 80,
                  },
                ]
              : [
                  {
                    key: 1,
                    name: 'Comment',
                    keyItem: 'comment',
                    align: 'start',
                    width: 360,
                    grow: 1,
                  },
                  {
                    key: 2,
                    name: 'Date',
                    align: 'start',
                    width: 140,
                  },
                  {
                    key: 3,
                    name: 'Download',
                    align: 'end',
                    width: 80,
                  },
                ]
          }
          withHeaderOnly
        />
      </div>
    </RipperCabinetCategoryLayout>
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    removeProjectCardDocument: ({ documentId, projectCardId }) => {
      dispatch(removeProjectCardDocumentAction({ documentId, projectCardId }));
    },
  })
)(RipperCabinetFilesTable);
