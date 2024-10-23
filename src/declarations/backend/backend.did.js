export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Event = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'date' : Time,
    'description' : IDL.Text,
    'eventType' : IDL.Text,
  });
  return IDL.Service({
    'addEvent' : IDL.Func([Time, IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    'getAllEvents' : IDL.Func([], [IDL.Vec(Event)], ['query']),
    'getEventsByType' : IDL.Func([IDL.Text], [IDL.Vec(Event)], ['query']),
    'removeEvent' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
