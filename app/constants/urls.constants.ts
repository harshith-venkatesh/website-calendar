export const checkUsername = (HOST: string, username: string) =>
  `${HOST}/users/usernameCheck/${username}`;

export const defaultCalendarId = 1;
export const getEvents = (HOST: string, startTime: number, endTime: number) =>
  `${HOST}/events/calendar/${defaultCalendarId}?startTime=${startTime}&endTime=${endTime}`;

export const getEventById = (HOST: string, id: number) => `${HOST}/events/${id}`;

export const patchEvent = (HOST: string, id: number) => `${HOST}/events/${id}`;

export const postEvent = (HOST: string) => `${HOST}/events/`;