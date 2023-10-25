import { useCallback, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';

import HorizontalScrollLayout from '@/components/layouts/HorizontalScrollLayout';
import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import ProjectStatus from '@/components/projects/Project/_components/ProjectStatus';
import TagTooltipContent from '@/components/projects/ProjectsFilters/_components/types/TagsFilter/_components/TagTooltipContent';
import ToolTip from '@/components/ui/ToolTip';
import ComponentsCommonConstants from '@/constants/components/common';
import TranslateHook from '@/hooks/translate/TranslateHook';

import statusesTooltips from './_data/tooltipText';
import styles from './styles.module.scss';

const TagsFilter = ({ location, items, selectedFilterCategory, multi, changeFilter }) => {
  const t = TranslateHook();

  const [shownTooltip, setShownTooltip] = useState(false);
  const [hoveredStatus, setHoveredStatus] = useState('');

  const containerRef = useRef(null);
  const hoveredStatusLeft = useRef(0);
  const hoveredTooltip = useRef(false);

  const filterItems = useMemo(
    () => cloneDeep(items).filter(({ excludeLocations = [] }) => !excludeLocations.includes(location)),
    [items, location]
  );

  const getTooltipInfo = useCallback(() => {
    const { text, maxWidth } = statusesTooltips[hoveredStatus] || {};

    if (!hoveredStatus) {
      return {};
    }

    return {
      text: `<b>${t(hoveredStatus)}</b>`,
      width: maxWidth,
      childrenEnd: TagTooltipContent,
      childrenEndProps: {
        text,
        hoveredStatus,
      },
    };
  }, [hoveredStatus, t]);

  const toggleShownTooltip = useCallback((newShownTooltip) => {
    if (hoveredTooltip.current && !newShownTooltip) {
      return;
    }

    setShownTooltip(newShownTooltip);
  }, []);

  const onMouseEnter = ({ currentTarget }, { queryParam }) => {
    const { offsetWidth } = currentTarget;

    hoveredStatusLeft.current =
      currentTarget.getBoundingClientRect().left - containerRef.current.getBoundingClientRect().left + offsetWidth / 2 - 10;

    toggleShownTooltip(true);

    setHoveredStatus(queryParam);
  };

  const onMouseLeave = useCallback(() => {
    toggleShownTooltip(false);
  }, [toggleShownTooltip]);

  const beforeScrollContent = useCallback(
    () => (
      <DesktopLayout>
        <ToolTip
          shown={shownTooltip}
          withButton={false}
          color="white"
          size={ComponentsCommonConstants.Size.NORMAL}
          withCloseButton={false}
          position="top"
          tooltipButtonLeft={hoveredStatusLeft.current}
          {...getTooltipInfo()}
          onMouseEnter={() => {
            hoveredTooltip.current = true;
            toggleShownTooltip(true);
          }}
          onMouseLeave={() => {
            hoveredTooltip.current = false;
            onMouseLeave();
          }}
        />
      </DesktopLayout>
    ),
    [getTooltipInfo, onMouseLeave, shownTooltip, toggleShownTooltip]
  );

  return (
    <div className={styles.filterTags} ref={containerRef}>
      <HorizontalScrollLayout
        className={styles.horizontalScrollLayout}
        contentClassName={styles.horizontalScrollLayout__content}
        scrollClassName={styles.horizontalScrollLayout__scroll}
        onScroll={() => {
          if (!shownTooltip) {
            return;
          }
          toggleShownTooltip(false);
        }}
        beforeScrollContent={beforeScrollContent}
      >
        {filterItems.map(({ id, queryParam, disabled: disabledOption }) => {
          const active = !!selectedFilterCategory[id];
          return (
            <ProjectStatus
              key={`filter-type-tags-${id}-${queryParam}`}
              className={classNames(!active && 'not-active', hoveredStatus === queryParam && 'hovered')}
              changeFilterCallBack={(params) =>
                changeFilter({
                  ...params,
                  multi,
                })
              }
              filters={filterItems}
              projectInfo={{
                status: {
                  id,
                  name: queryParam,
                },
              }}
              isFilter
              withFilter
              active={active}
              disabled={disabledOption}
              onMouseEnter={(e) => {
                onMouseEnter(e, { queryParam });
              }}
              onMouseLeave={onMouseLeave}
            />
          );
        })}
      </HorizontalScrollLayout>
    </div>
  );
};

export default TagsFilter;
