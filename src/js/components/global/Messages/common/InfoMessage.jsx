import SystemMessage from '@/components/primary/SystemMessage';

function InfoMessage({ messageId = 'InfoMessage', messageData }) {
  return <SystemMessage messageId={messageId} messageData={messageData} messageStatus="information" />;
}

export default InfoMessage;
