import { Component, createRef } from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';

import StickyLayout from '@/components/layouts/StickyLayout';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import CollapseSection from '@/components/primary/CollapseSection';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import FaqActiveContent from '@/pages/help/FAQ/FAQWrapper/_components/FaqList/_components/FaqActiveContent';
import { setFaqActiveCategoryAction } from '@/redux-actions/faq/faqActions';
import NextRouter from '@/services/NextRouter';
import ScrollService from '@/services/scroll/ScrollService';
import { parseToPathNameUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const TITLE_NAV = 'How to use?';

const clearCategorySymbols = (category = '') => category.replace('?', '');

class FaqList extends Component {
  constructor(props) {
    super(props);

    this.faqRef = createRef();

    this.state = {
      activeCategory: '',
      triggerClose: false,
    };

    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      ScrollBlockIdConstants.FAQ,
      RoutePathsConstants.FAQ,
      this.faqRef
    );
  }

  componentDidMount() {
    this.setActiveCategoryStore();
    this.setActiveCategoryLocal();
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeCategory } = this.state;
    const { activeCategory: activeCategoryPrev } = prevState;

    if (activeCategory !== activeCategoryPrev && !!activeCategoryPrev) {
      this.setActiveCategoryStore(activeCategory);

      ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).scrollTop({
        sectionId: ScrollBlockIdConstants.FAQ,
        behavior: 0,
        inRoute: true,
      });
    }
  }

  setActiveCategoryLocal = (href = '') => {
    this.setState({
      activeCategory: clearCategorySymbols(href || (this.getCategoryByUrl() || '').toLowerCase()),
    });
  };

  setActiveCategoryStore = (href) => {
    const { setFaqActiveCategory } = this.props;

    const category = clearCategorySymbols(href || this.getCategoryByUrl());

    setFaqActiveCategory({
      activeCategory: category,
      activeTitle: this.foundActiveTitle(category),
    });
  };

  foundActiveTitle = (href) => {
    const { faqList } = this.props;
    const { title: activeTitle = '' } =
      faqList.find(
        ({ title }) => clearCategorySymbols(parseToPathNameUtil(title).toLowerCase()) === clearCategorySymbols(href)
      ) || {};

    return activeTitle;
  };

  getCategoryByUrl = () => {
    const { faqList } = this.props;
    const { router = {} } = NextRouter.getInstance();
    const { title = '' } = faqList[0] || {};
    const { router: nextRouter = {} } = router || {};

    const categoryByUrl = nextRouter.query.category || parseToPathNameUtil(title).toLowerCase();

    return clearCategorySymbols(categoryByUrl);
  };

  renderNavigation = () => {
    const { faqList, activeCategory } = this.props;

    return faqList.map(({ title, id }) => {
      const href = clearCategorySymbols(parseToPathNameUtil(title).toLowerCase());

      return (
        <LinkRoute
          key={`faq-nav-title-${id}`}
          href={`${RoutePathsConstants.FAQ}/${href}`}
          text={title}
          className={classNames([
            'faqSwitcher__item button_string p-bottom-10 p-top-10',
            activeCategory === href && 'faqSwitcher__item_active',
          ])}
          type="button_string"
          onClick={() => {
            this.setActiveCategoryLocal(href);
            this.setState(
              {
                triggerClose: true,
              },
              () => {
                this.setState({
                  triggerClose: false,
                });
              }
            );
          }}
        />
      );
    });
  };

  renderActiveContent = () => {
    const { faqList, activeCategory } = this.props;

    const faqListTmp = cloneDeep(faqList);
    const faqListActive =
      faqListTmp.find(({ title }) => clearCategorySymbols(parseToPathNameUtil(title).toLowerCase()) === activeCategory) || {};

    if (isEmpty(faqListActive)) {
      return null;
    }

    return <FaqActiveContent faqListActive={faqListActive} />;
  };

  render() {
    const { triggerClose } = this.state;

    return (
      <div className={styles.faq} ref={this.faqRef}>
        <div className={styles.faqSwitcher}>
          <DesktopLayout>
            <StickyLayout topOffset={-50} top={121}>
              <div className={classNames([styles.faqSwitcher__title, 'p-bottom-10 p-top-10'])}>
                <b>{TITLE_NAV}</b>
              </div>
              {this.renderNavigation()}
            </StickyLayout>
          </DesktopLayout>
          <MobileLayout>
            <CollapseSection title={TITLE_NAV} borderColor="gray-4" triggerClose={triggerClose}>
              {this.renderNavigation()}
            </CollapseSection>
          </MobileLayout>
        </div>
        {this.renderActiveContent()}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    faqList: state.FaqReducer.faqList,
    activeCategory: state.FaqReducer.activeCategory,
  }),
  (dispatch) => ({
    setFaqActiveCategory: ({ activeCategory, activeTitle }) => {
      dispatch(setFaqActiveCategoryAction({ activeCategory, activeTitle }));
    },
  })
)(FaqList);
