import SystemMessage from '@/components/primary/SystemMessage';

function SuccessMessage({ messageId = 'SuccessMessage', messageData }) {
  return <SystemMessage messageId={messageId} messageData={messageData} messageStatus="success" />;
}

export default SuccessMessage;
