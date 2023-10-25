import PaginationFullWrapper from '@/components/pagination/PaginationFullWrapper';

function ProjectPagination({
  location,
  currentNumber,
  size,
  totalPages,
  totalElements,
  itemsPerPage,
  onLoadRequest,
  withPageSize,
}) {
  return (
    <PaginationFullWrapper
      currentPage={currentNumber}
      currentNumber={currentNumber}
      pageSize={size}
      totalPages={totalPages}
      totalElements={totalElements}
      itemsOption={itemsPerPage}
      location={location}
      changePage={(page) => {
        onLoadRequest({
          page,
          size,
        });
      }}
      changeItemsPerPage={({ value: pageSize }) => {
        onLoadRequest({
          size: pageSize,
          page: 0,
        });
      }}
      withPageSize={withPageSize && totalElements > 0}
    />
  );
}

export default ProjectPagination;
