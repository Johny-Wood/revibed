import CommentInput from '@/components/common-ui/inputs/CommentInput';
import MediaConditionSelect from '@/components/common-ui/selects/MediaConditionSelect';
import SleeveConditionSelect from '@/components/common-ui/selects/SleeveConditionSelect';

import styles from './styles.module.scss';

function RipperCabinetFactualConditions({
  realMediaCondition = {},
  realSleeveCondition = {},
  realMediaCondition: { id: selectedRealMediaConditionId } = {},
  realSleeveCondition: { id: selectedSleeveMediaConditionId } = {},
  comment,
  commentError,
  commentErrorMsg,

  changeMediaCondition,
  changeSleeveCondition,
  validateField,
  changeInputHandler,
}) {
  return (
    <div className={styles.ripperRealConditions}>
      <div className="inputs-column-2">
        <div className="inputs-column__item">
          <div className="m-bottom-10">
            <b>Factual media condition</b>
          </div>
          <MediaConditionSelect
            label="Choose Media Condition"
            targetPredicate={({ forRipper = true }) => !!forRipper}
            selected={[
              {
                id: realMediaCondition.id,
                name: realMediaCondition.label || realMediaCondition.shortTitle,
                value: realMediaCondition.id,
                label: realMediaCondition.label
                  ? realMediaCondition.label
                  : realMediaCondition.title
                  ? `${realMediaCondition.title} (${realMediaCondition.shortTitle})`
                  : '',
              },
            ]}
            changeItems={changeMediaCondition}
            conditionId={selectedRealMediaConditionId}
          />
        </div>
        <div className="inputs-column__item">
          <div className="m-bottom-10">
            <b>Factual sleeve condition</b>
          </div>
          <SleeveConditionSelect
            label="Choose Sleeve Condition"
            targetPredicate={({ forRipper = true }) => !!forRipper}
            selected={[
              {
                id: realSleeveCondition.id,
                name: realSleeveCondition.label || realSleeveCondition.shortTitle,
                value: realSleeveCondition.id,
                label: realSleeveCondition.label
                  ? realSleeveCondition.label
                  : realSleeveCondition.title
                  ? `${realSleeveCondition.title} (${realSleeveCondition.shortTitle})`
                  : '',
              },
            ]}
            changeItems={changeSleeveCondition}
            conditionId={selectedSleeveMediaConditionId}
          />
        </div>
      </div>
      <CommentInput
        label="Comment"
        comment={comment}
        commentError={commentError}
        commentErrorMsg={commentErrorMsg}
        validateField={validateField}
        onChange={changeInputHandler}
      />
    </div>
  );
}

export default RipperCabinetFactualConditions;
