import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLoaderData, ShouldRevalidateFunction, useLocation } from '@remix-run/react';
import { LoaderFunction, json } from '@remix-run/node';
import EventModal from '~/components/common/eventModal';
import { useStore } from '~/store/useStore';
import { CalEvent, CalendarEventProps } from '~/utils/interfaces';
import { dummyEvent } from '~/constants/events.constants';
import { getEventById } from '~/constants/urls.constants';
import { parseEvent } from '~/utils/event.utils';

type LoaderData = {
  event: any;
  error: string | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const cookie = request.headers.get('cookie');

  const eventId = url.pathname.split('/')[2];

  if (eventId === 'new') return { event: dummyEvent };

  try {
    const response = await axios.get(
      getEventById(process.env.API_HOST as string, parseInt(eventId, 10)),
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
      },
    );
    return json<LoaderData>({ event: response.data.data, error: null });
  } catch (error) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }
};

const shouldRevalidate: ShouldRevalidateFunction = ({}) => false;

const EventDetails = () => {
  const { event } = useLoaderData();
  const { state: navState } = useLocation();
  const { events: eventsList } = useStore((state) => state);
  const [calendarEvent, setCalendarEvent] = useState<CalendarEventProps>({
    event: parseEvent(event) ?? dummyEvent,
  });

  const params = useParams();

  useEffect(() => {
    if (params.eventId !== 'new') {
      const calEvent = eventsList.find(
        (event: CalEvent) => event.id === parseInt(params.eventId as string, 10),
      );

      if (calEvent) {
        setCalendarEvent({
          event: { ...calEvent },
        });
      }
    } else {
      const start = navState && navState.start ? navState.start : dummyEvent.start;
      const end = navState && navState.end ? navState.end : dummyEvent.end;

      setCalendarEvent({
        event: { ...event, start, end },
      });
    }
  }, [event.id]);

  return (
    <div>
      <EventModal
        currentEvent={calendarEvent.event!}
        events={eventsList}
        setCalendarEvent={setCalendarEvent}
      />
    </div>
  );
};

export default EventDetails;
