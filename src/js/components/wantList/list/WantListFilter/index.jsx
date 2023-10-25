import RetractableMenu from '@/components/common/RetractableMenu';
import SideBarLayout from '@/components/layouts/SideBarLayout';
import DiscogsTypeFilters from '@/components/projects/ProjectsFilters/DiscogsTypeFilters';
import FilterIcon from '@/icons/FilterIcon';

function WantListFilter({
  location,
  disabled,

  onLoadRequest = () => {},
  changeFilter = () => {},

  filtersSelected = {},
  filtersApplied = {},
  filterApplied,

  sortAndFilters = {},
}) {
  return (
    <SideBarLayout withMarginBottomMinus>
      <RetractableMenu buttonIcon={<FilterIcon />}>
        <DiscogsTypeFilters
          location={location}
          filtersSelected={filtersSelected}
          filtersApplied={filtersApplied}
          filterApplied={filterApplied}
          sortAndFilters={sortAndFilters}
          changeFilterCallBack={changeFilter}
          onGetProjects={onLoadRequest}
          disabled={disabled}
        />
      </RetractableMenu>
    </SideBarLayout>
  );
}

export default WantListFilter;
