import PaginationFullWrapper from '@/components/pagination/PaginationFullWrapper';

function ReleaseItemsPagination({
  withPageSize = true,

  itemsPerPage,

  pageSettings: { page: { totalElements = 0, totalPages = 0, currentNumber = 0, size = 15 } = {} } = {},

  onLoadRequest,
  type,
}) {
  return (
    <PaginationFullWrapper
      currentPage={currentNumber}
      currentNumber={currentNumber}
      pageSize={size}
      totalPages={totalPages}
      totalElements={totalElements}
      itemsOption={itemsPerPage}
      location="WANT_LIST_RELEASES_ITEMS"
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
      type={type}
    />
  );
}
export default ReleaseItemsPagination;
