import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import { textForLotsOfUtil } from '@/utils/textUtils';

function TabsRightBlock({ totalElements = 0 }) {
  if (totalElements === 0) {
    return null;
  }

  return (
    <DesktopLayout>
      <span>
        <b>{totalElements}</b> {textForLotsOfUtil(totalElements, ['item', 'items'])}
      </span>
    </DesktopLayout>
  );
}

export default TabsRightBlock;
