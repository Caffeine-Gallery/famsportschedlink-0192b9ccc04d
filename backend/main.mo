import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  // Event type definition
  type Event = {
    id: Nat;
    date: Time.Time;
    title: Text;
    eventType: Text;
    description: Text;
  };

  // Stable variable to store events
  stable var eventEntries : [(Nat, Event)] = [];
  var events = HashMap.HashMap<Nat, Event>(0, Nat.equal, Nat.hash);
  var nextId : Nat = 0;

  // Initialize events from stable storage
  system func preupgrade() {
    eventEntries := Iter.toArray(events.entries());
  };

  system func postupgrade() {
    events := HashMap.fromIter<Nat, Event>(eventEntries.vals(), 0, Nat.equal, Nat.hash);
    nextId := eventEntries.size();
  };

  // Add a new event
  public func addEvent(date: Time.Time, title: Text, eventType: Text, description: Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let event : Event = {
      id;
      date;
      title;
      eventType;
      description;
    };
    events.put(id, event);
    id
  };

  // Remove an event
  public func removeEvent(id: Nat) : async Bool {
    switch (events.remove(id)) {
      case (null) { false };
      case (?_) { true };
    };
  };

  // Get all events
  public query func getAllEvents() : async [Event] {
    Iter.toArray(events.vals())
  };

  // Get events by type
  public query func getEventsByType(eventType: Text) : async [Event] {
    let filteredEvents = Array.filter<Event>(Iter.toArray(events.vals()), func (event) {
      event.eventType == eventType
    });
    filteredEvents
  };
}
