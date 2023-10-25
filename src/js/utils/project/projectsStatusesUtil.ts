import { ProjectStatusesConstants } from '@/constants/projects/status';
import { projectParticipationInfoUtil } from '@/utils/project/projectParticipationInfoUtil';

const isOpenStatus = (statusName: string) => statusName === ProjectStatusesConstants.OPEN;

const isLastCallStatus = (statusName: string) => statusName === ProjectStatusesConstants.LAST_CALL;

const isInTransitStatus = (statusName: string) => statusName === ProjectStatusesConstants.IN_TRANSIT;

const isListedStatus = (statusName: string) => statusName === ProjectStatusesConstants.LISTED;

const isClosedStatus = (statusName: string) => statusName === ProjectStatusesConstants.CLOSED;

const isSoldStatus = (statusName: string) => statusName === ProjectStatusesConstants.SOLD;

const isDraftStatus = (statusName: string) => statusName === ProjectStatusesConstants.DRAFT;

const isRejectedStatus = (statusName: string) => statusName === ProjectStatusesConstants.REJECTED;

const isInModerationStatus = (statusName: string) => statusName === ProjectStatusesConstants.IN_MODERATION;

const isLegacyStatus = (statusName: string) => statusName === ProjectStatusesConstants.LEGACY;

const isArrivedStatus = (statusName: string) => statusName === ProjectStatusesConstants.ARRIVED;

const isRefundPendingStatus = (statusName: string) => statusName === ProjectStatusesConstants.REFUND_PENDING;

const isRippedStatus = (statusName: string) => statusName === ProjectStatusesConstants.RIPPED;

const isVoteForSaleStatus = (statusName: string) => statusName === ProjectStatusesConstants.VOTE_FOR_SALE;

const isRecordKeptStatus = (statusName: string) => statusName === ProjectStatusesConstants.RECORD_KEPT;

const isShippedStatus = (statusName: string) => statusName === ProjectStatusesConstants.SHIPPED;

const isRipPendingStatus = (statusName: string) => statusName === ProjectStatusesConstants.RIP_PENDING;

const isReceivedByRipperStatus = (statusName: string) => statusName === ProjectStatusesConstants.RECEIVED_BY_RIPPER;

const isToBeListedStatus = (statusName: string) => statusName === ProjectStatusesConstants.TO_BE_LISTED;

const isLateEntryStatus = (statusName: string) => statusName === ProjectStatusesConstants.LATE_ENTRY;

const isComingSoonStatus = (statusName: string) => statusName === ProjectStatusesConstants.COMING_SOON;

const canBeLateEntryStatus = (
  {
    requestedUserInfo,
    lateEntryStatus: {
      // @ts-ignore
      name: lateEntryName,
    } = {},
    lateEntryInfo: { slots: lateEntrySlots = [] } = {},
  }: any = {},
  { userIsAuthorized }: any = {}
) => {
  const participationContributor = projectParticipationInfoUtil(requestedUserInfo);

  return (
    lateEntryName &&
    !participationContributor &&
    // @ts-ignore
    (lateEntrySlots.filter(({ contributor }) => !contributor).length > 0 ||
      (!userIsAuthorized && isComingSoonStatus(lateEntryName)))
  );
};

const projectStatusesUtil = {
  isOpenStatus,
  isLastCallStatus,
  isInTransitStatus,
  isListedStatus,
  isClosedStatus,
  isSoldStatus,
  isDraftStatus,
  isRejectedStatus,
  isInModerationStatus,
  isLegacyStatus,
  isArrivedStatus,
  isRefundPendingStatus,
  isRippedStatus,
  isVoteForSaleStatus,
  isRecordKeptStatus,
  isShippedStatus,
  isRipPendingStatus,
  isReceivedByRipperStatus,
  isToBeListedStatus,
  isLateEntryStatus,
  isComingSoonStatus,
  canBeLateEntryStatus,
};

export default projectStatusesUtil;
