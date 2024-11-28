interface ITicket {
  id: string;
  address: string;
  name: string;
  slug: string;
  developerId: string;
  metadataUrl: string;
  metadataPayload: {
    name: string;
    symbol: string;
    description: string;
    metadataImageUrl: string;
  };
  appId: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
}

interface IEvent {
  id: string;
  name: string;
  description: string;
  contractAddress: string;
  logoUrl: string;
  slug: string;
  timezoneIdentifier: string;
  startsAt: string;
  endsAt: string;
  appId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  EventLocation?: {
    city: string;
    country: string;
  };
}

interface IOwnedTicketOfEvent {
  ticket: ITicket;
  usedTokenIds: number[];
  ownedTokenIds: number[];
  qrCodesPerToken: { code: string, tokenId: number, eventId: string, ticketId: string }[];
}

interface IEventWithTickets {
  event: IEvent;
  ownedTicketsOfEvent: IOwnedTicketOfEvent[];
  hasEventEntry: boolean;
}