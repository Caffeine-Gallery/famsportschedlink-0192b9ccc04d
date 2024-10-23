import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Event {
  'id' : bigint,
  'title' : string,
  'date' : Time,
  'description' : string,
  'eventType' : string,
}
export type Time = bigint;
export interface _SERVICE {
  'addEvent' : ActorMethod<[Time, string, string, string], bigint>,
  'getAllEvents' : ActorMethod<[], Array<Event>>,
  'getEventsByType' : ActorMethod<[string], Array<Event>>,
  'removeEvent' : ActorMethod<[bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
