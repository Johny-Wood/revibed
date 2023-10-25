import { useState } from 'react';

import classNames from 'classnames';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import { connect } from 'react-redux';

import { MobileLayout } from '@/components/layouts/ViewportLayouts';
import LinkDefault from '@/components/ui/links/LinkDefault';
import LinkRoute from '@/components/ui/links/LinkRoute';
import TranslateHook from '@/hooks/translate/TranslateHook';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import ArrowIcon from '@/icons/arrows/ArrowIcon';

import styles from './styles.module.scss';

const renderCategoryLinks = ({ category, userIsAuthorized }) =>
  category.map((categoryItem) => {
    const { tKey, alt, href, external, disabled, image, notAuthorized, notNotAuthorized } = categoryItem;

    const elementKey = `nav-${href}`;
    const elementClassName = classNames([!!image && 'link_with_img']);

    if (userIsAuthorized && notAuthorized) {
      return null;
    }

    if (!userIsAuthorized && notNotAuthorized) {
      return null;
    }

    const linkContent = () =>
      !!image && <Image src={image.src} blurDataURL={image.blurDataURL} placeholder="blur" alt={alt} width={114} height={83} />;

    if (external) {
      return (
        <LinkDefault key={elementKey} translateKey={tKey} href={href} disabled={disabled} className={elementClassName}>
          {linkContent()}
        </LinkDefault>
      );
    }

    return (
      <LinkRoute key={elementKey} translateKey={tKey} href={href} disabled={disabled} className={elementClassName}>
        {linkContent()}
      </LinkRoute>
    );
  });

const CategoryNavigation = ({
  items,

  userIsAuthorized,

  blackFooter
}) => {
  const t = TranslateHook();

  const [showedCategory, setShowedCategory] = useState('');
  const { isNotDesktop } = ViewportHook();

  return (
    <div className={classNames(styles.categoryNavigation, blackFooter && styles.categoryNavigation_black)}>
      <div className={styles.categoryNavigation__wrapper}>
        <div className={styles.categoryNavigation__container}>
          {items.map((category) => {
            const { categoryName, links, width, align = 'left', toggle = true } = category;

            return (
              <div
                key={`category-navigation-${categoryName}`}
                className={classNames([
                  width && `w-${width}`,
                  styles.categoryNavigation__category,
                  categoryName === 'getFreeKoins' && styles.categoryNavigation_getFreeKoins,
                  align === 'right' && styles.categoryNavigation_align_right,
                ])}
              >
                <div
                  className={classNames(['t-bold', styles.categoryNavigation__category__name])}
                  onClick={() => (isNotDesktop ? setShowedCategory(showedCategory !== categoryName ? categoryName : '') : {})}
                >
                  {t(categoryName)}
                  {toggle && (
                    <MobileLayout>
                      <div className="i-arrow">
                        <ArrowIcon isOpened={showedCategory === categoryName} />
                      </div>
                    </MobileLayout>
                  )}
                </div>
                <Collapse isOpened={showedCategory === categoryName || !isNotDesktop || !toggle}>
                  <div
                    className={classNames([
                      styles.categoryNavigation__category__links,
                      align === 'right' && styles.categoryNavigation_align_right__category__links,
                    ])}
                  >
                    {renderCategoryLinks({
                      category: links,
                      userIsAuthorized,
                    })}
                  </div>
                </Collapse>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

CategoryNavigation.defaultProps = {
  items: [],
};

CategoryNavigation.propTypes = {
  items: PropTypes.array,
};

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}))(CategoryNavigation);
