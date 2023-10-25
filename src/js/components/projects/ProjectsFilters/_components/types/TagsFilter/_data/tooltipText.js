import { ProjectStatusesConstants } from '@/constants/projects/status';

const statusesTooltips = {
  [ProjectStatusesConstants.OPEN]: {
    text: 'The project is&nbsp;available for contribution',
    maxWidth: 180,
  },
  [ProjectStatusesConstants.LAST_CALL]: {
    text: 'Less than 24&nbsp;hours or&nbsp;less than&nbsp;25% remains before the end of&nbsp;the project funding',
    maxWidth: 240,
  },
  [ProjectStatusesConstants.IN_TRANSIT]: {
    text: 'Project was successfully funded, item purchased and it&rsquo;s heading to&nbsp;sound lab',
    maxWidth: 210,
  },
  [ProjectStatusesConstants.ARRIVED]: {
    text: 'Item successfully reached the sound lab',
    maxWidth: 180,
  },
  [ProjectStatusesConstants.VOTE_FOR_SALE]: {
    text: 'Archive copy available to&nbsp;contributors for listening, voting on&nbsp;further actions is&nbsp;underway',
    maxWidth: 240,
  },
  [ProjectStatusesConstants.REFUND_PENDING]: {
    text: 'Item arrived not as&nbsp;described by&nbsp;seller and being in&nbsp;route to&nbsp;seller',
    maxWidth: 210,
  },
  [ProjectStatusesConstants.LISTED]: {
    text: 'The item is&nbsp;listed for sale',
    maxWidth: 180,
  },
  [ProjectStatusesConstants.SOLD]: {
    text: 'The item is&nbsp;sold, refund issued, archive copy is&nbsp;not available for download',
    maxWidth: 210,
  },
  [ProjectStatusesConstants.RECORD_KEPT]: {
    text: 'Either being held before the voting period starts, or&nbsp;contributors have decided to&nbsp;not sell the item',
    maxWidth: 240,
  },
  [ProjectStatusesConstants.CLOSED]: {
    text: 'The funding was not successful, project is&nbsp;closed and contributions refunded',
    maxWidth: 230,
  },
  [ProjectStatusesConstants.LEGACY]: {
    text: 'Project was announced/funded in&nbsp;the past',
    maxWidth: 180,
  },
  [ProjectStatusesConstants.IN_MODERATION]: {
    text: 'Project is&nbsp;being moderated before funding starts',
    maxWidth: 180,
  },
  [ProjectStatusesConstants.REJECTED]: {
    text: 'Project has not passed the moderation',
    maxWidth: 180,
  },
  [ProjectStatusesConstants.DRAFT]: {
    text: 'Project not published',
    maxWidth: 160,
  },
};

export default statusesTooltips;
