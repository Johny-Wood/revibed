import classNames from 'classnames';
import emojiData from 'emoji-datasource-twitter';
import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';

import Emoji from '@/components/common/emoji/Emoji';
import EmojiPickerButton from '@/components/common/emoji/EmojiPicker/_components/EmojiPickerButton';
import ClosedOnClickLayout from '@/components/layouts/ClosedOnClickLayout';
import ScrollbarLayout from '@/components/layouts/ScrollbarLayout';

import styles from './styles.module.scss';

const emojiGroupsArray = [...new Set(emojiData.map(({ category }) => category))]
  .filter((category) => category !== undefined)
  .reverse();

const emojiGroups = [
  emojiGroupsArray[0],
  emojiGroupsArray[2],
  emojiGroupsArray[3],
  emojiGroupsArray[4],
  emojiGroupsArray[5],
  emojiGroupsArray[6],
  emojiGroupsArray[7],
  emojiGroupsArray[8],
  emojiGroupsArray[9],
];

function EmojiPicker({ addEmojiCallBack, className, containerClassName, sectionClassName }) {
  return (
    <ClosedOnClickLayout className={classNames(styles.emojiContainer__block, className)} button={EmojiPickerButton}>
      <div className={classNames(styles.emojiContainer, containerClassName)}>
        <div className={classNames(styles.emojiContainer__section, sectionClassName)}>
          <div className={styles.emojiContainer__title}>SMILEYS</div>
        </div>
        <div className={styles.emojiContainer__content}>
          <ScrollbarLayout height={285}>
            <div className={styles.emojiContainer__wrapper}>
              {emojiGroups.map((groupName) => (
                <div key={`emoji-group-${groupName}`} className={styles.emojiContainer__group}>
                  <div className={styles.emojiContainer__groups}>
                    <span>{groupName}</span>
                  </div>
                  <div className={styles.emojiContainer__list}>
                    {orderBy(cloneDeep(emojiData), ['sort_order', 'short_name'], ['asc', 'asc'])
                      .filter(({ category, has_img_twitter: hasImgTwitter }) => category === groupName && hasImgTwitter)
                      .map(({ short_name: shortName = '', image = '', unified = '' }) => (
                        <div
                          key={`emoji-icon-${shortName}-${unified}`}
                          className={styles.emojiContainer__icon}
                          onClick={() => {
                            addEmojiCallBack({
                              image,
                              shortName,
                            });
                          }}
                        >
                          <Emoji shortName={shortName} />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollbarLayout>
        </div>
      </div>
    </ClosedOnClickLayout>
  );
}

export default EmojiPicker;
