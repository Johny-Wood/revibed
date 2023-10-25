import SystemMessage from '@/components/primary/SystemMessage';

function ErrorMessage({ messageId = 'ErrorMessage', messageData }) {
  return <SystemMessage messageId={messageId} messageData={messageData} messageStatus="error" />;
}

export default ErrorMessage;
