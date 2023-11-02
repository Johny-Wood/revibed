import EventMarkerEvent from '@/components/events/EventMarker/_components/EventMarkerEvent';

type EventMarkerProps = {
  shown?: boolean;
  withRead?: boolean;
  className?: string;
};

function EventMarker({ shown, withRead, className }: EventMarkerProps) {
  if (!shown && !withRead) {
    return null;
  }

  return <EventMarkerEvent className={className} withRead={withRead} />;
}

export default EventMarker;
