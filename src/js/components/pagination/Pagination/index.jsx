import { Component, Fragment } from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';

import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import Button from '@/components/ui/buttons/Button';
import ArrowIcon from '@/icons/arrows/ArrowIcon';

import styles from './styles.module.scss';

let MAX_PAGE_BEFORE_CURRENT = 2;
let MAX_PAGE_AFTER_CURRENT = 2;

const IDX_SHOW_PAGINATION_DOTS = 3;

class Pagination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: [],
    };
  }

  componentDidMount() {
    this.generatePaginate();
  }

  componentDidUpdate(prevProps) {
    const { totalPage, currentPage } = this.props;
    const { pages } = this.state;

    this.computedMaxPageAfterAndBefore();

    if (totalPage !== prevProps.totalPage) {
      this.generatePaginate();
    } else if (currentPage !== prevProps.currentPage) {
      const statePages = cloneDeep(pages);

      statePages.forEach((page, idx) => {
        page.current = currentPage === page.pageNumber;

        page.show =
          (idx <= currentPage + MAX_PAGE_AFTER_CURRENT && idx >= currentPage - MAX_PAGE_BEFORE_CURRENT) ||
          idx === totalPage - 1 ||
          idx === 0 ||
          idx === statePages.length - 1 ||
          idx === currentPage;
      });

      this.setState({
        pages: statePages,
      });
    }
  }

  computedMaxPageAfterAndBefore = () => {
    const { totalPage, currentPage } = this.props;

    if (currentPage < IDX_SHOW_PAGINATION_DOTS - 2 && totalPage > IDX_SHOW_PAGINATION_DOTS + 1) {
      MAX_PAGE_AFTER_CURRENT = 2;
    } else {
      MAX_PAGE_AFTER_CURRENT = 1;
    }

    if (currentPage > totalPage - IDX_SHOW_PAGINATION_DOTS + 1 && totalPage > IDX_SHOW_PAGINATION_DOTS + 1) {
      MAX_PAGE_BEFORE_CURRENT = 2;
    } else {
      MAX_PAGE_BEFORE_CURRENT = 1;
    }
  };

  generatePaginate = () => {
    const pages = [];
    const { totalPage, currentPage } = this.props;

    this.computedMaxPageAfterAndBefore();

    for (let i = 0; i < totalPage; i++) {
      pages.push({
        pageNumber: i,
        current: currentPage === i,
        show:
          (i <= currentPage + MAX_PAGE_AFTER_CURRENT && i >= currentPage - MAX_PAGE_BEFORE_CURRENT) ||
          i === 0 ||
          i === totalPage - 1,
        active: true,
      });
    }

    this.setState({
      pages,
    });
  };

  getNextPage = () => {
    const { onChangePage, currentPage, isCircle, totalPage, setDirection } = this.props;

    if (this.nextPageDisabled()) {
      return;
    }

    const newPage = currentPage + 1;

    onChangePage(newPage > totalPage - 1 && isCircle ? 0 : newPage, 'next');

    if (setDirection) {
      setDirection('next');
    }
  };

  getPrevPage = () => {
    const { onChangePage, currentPage, isCircle, totalPage, setDirection } = this.props;

    if (this.prevPageDisabled()) {
      return;
    }

    const newPage = currentPage - 1;

    onChangePage(newPage === -1 && isCircle ? totalPage - 1 : newPage, 'prev');

    if (setDirection) {
      setDirection('prev');
    }
  };

  nextPageDisabled = () => {
    const { totalPage, currentPage, isCircle } = this.props;

    return currentPage + 1 === totalPage && !isCircle;
  };

  prevPageDisabled = () => {
    const { currentPage, isCircle } = this.props;

    return currentPage === 0 && !isCircle;
  };

  render() {
    const {
      type,
      className,
      prevClassName,
      nextClassName,
      totalPage,
      currentPage,
      withArrows,
      disabled,
      onChangePage,
      arrowSize = 'large',
      children,
      borderColor,
    } = this.props;

    const { pages } = this.state;

    if (!pages || totalPage <= 0 || totalPage <= currentPage) {
      return null;
    }

    return (
      <div className={classNames([styles.pagination, className])}>
        {withArrows && (
          <Button
            text=""
            size="small"
            className={classNames([styles.paginationPrev, prevClassName])}
            onClick={this.getPrevPage}
            disabled={this.prevPageDisabled() || disabled}
            borderColor={borderColor}
          >
            <ArrowIcon size={arrowSize} />
            {type !== 'short' && (
              <DesktopLayout>
                <span className="text">Prev</span>
              </DesktopLayout>
            )}
          </Button>
        )}
        {children}
        {type !== 'short' && pages.length > 0 && (
          <DesktopLayout>
            {pages.map((page, idx) => {
              if (page.show && page.active) {
                return (
                  <Fragment key={`paginate-${page.pageNumber}`}>
                    {idx === totalPage - 1 && currentPage < totalPage - IDX_SHOW_PAGINATION_DOTS && (
                      <Button
                        size="small"
                        className={classNames([styles.paginationNumber, styles.paginationMoreIndicator])}
                        text="..."
                      />
                    )}
                    <Button
                      size="small"
                      className={classNames([styles.paginationNumber, page.current && styles.paginationNumber_active])}
                      onClick={() => onChangePage(page.pageNumber)}
                      text={(page.pageNumber + 1).toString()}
                      disabled={disabled}
                    />
                    {idx === 0 && currentPage >= IDX_SHOW_PAGINATION_DOTS && (
                      <Button
                        size="small"
                        className={classNames([styles.paginationNumber, styles.paginationMoreIndicator])}
                        text="..."
                      />
                    )}
                  </Fragment>
                );
              }

              return null;
            })}
          </DesktopLayout>
        )}
        {withArrows && (
          <Button
            text=""
            size="small"
            className={classNames([styles.paginationNext, nextClassName])}
            onClick={this.getNextPage}
            disabled={this.nextPageDisabled() || disabled}
            borderColor={borderColor}
          >
            {type !== 'short' && (
              <DesktopLayout>
                <span className="text">Next</span>
              </DesktopLayout>
            )}
            <ArrowIcon size={arrowSize} />
          </Button>
        )}
      </div>
    );
  }
}

Pagination.defaultProps = {
  totalPage: 0,
  currentPage: 0,
  onChangePage: () => {},
  withArrows: false,
  disabled: false,
  isCircle: false,
};

Pagination.propTypes = {
  totalPage: PropTypes.number,
  currentPage: PropTypes.number,
  onChangePage: PropTypes.func,
  withArrows: PropTypes.bool,
  disabled: PropTypes.bool,
  isCircle: PropTypes.bool,
};

export default Pagination;
