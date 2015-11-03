# ecstasy-next
A reducer based Entity-Component-System library for Javascript

# Concepts

Basic pipeline:

- View / Server etc
- Action
- Middleware (Middleware can fire another actions too)
- System
- Component
- View

## View

View displays game state / interacts with the user. If the user interacts with
the interface, the interface would create an action and pass it into the action.

Views should send 'update' action every frame so the game state can change.

## Action

Action represents a single action (or intent). Action can be dispatched by
the user via the view, or external interrupts (such as remote server), etc.

Action should be plain JSON object, which means it should be serializable.

Action can have any props, but having `type` prop is greatly recommended.

## Middleware

Middleware can 'drop' incoming action or dispatch another action after receiving
the action, or it can edit the action appropriately.

Middlewares are chained - they'll be executed in an order.

## System

Systems are reducers - They alter the current state according to the action.
However, Unlike other Flux-style libraries, Systems alter the state directly
without creating a copy. Thus, the state is **mutable**.

A system only manages single component. They can 'read' the whole state, but
systems are not allowed to 'write' to any other component except single one.

Immutable state is much better to manage, but creating another copy every time
an action is dispatched is too expensive in games, since there are more than
1000 entities on the game usually. To avoid this performance problem, the state
is mutable. However, this doesn't mean that actions are mutable too, they're
immutable.

## Component

In Entity-Component-System, Component is a core element building up the Entity.
This is same in this library too. Except, Entity doesn't exist as a 'Object'.
Entity simply became a number - an unique ID representing the entity.

Only systems can alter the component. Mutating component outside system is not
allowed. But this doesn't mean that reading is not allowed, only writing is not
allowed, programs should dispatch an action to mutate the component.

Components should be plain JSON object - it should be serializable.
