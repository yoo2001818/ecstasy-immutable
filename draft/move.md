Moving an entity
================

How should an entity move in a tile-based game engine?

1. View should dispatch a MOVE action containing target entity ID, target X and
   target Y. This can be represented as a JSON object:
   ```js
     {
       type: 'MOVE',
       payload: {
         id: 1,
         x: 0,
         y: 1
       }
     }
   ```
2. moveMiddleware calculates and validates the action. If specified action can't
   be executed, it'll throw an error.
3. posSystem sets the position of the entity to the target position.
4. tileSystem repositions the entity to the target position.
5. Finally, View renders updated game state.

Server validation
-----------------

What if there is a server validation middleware?

1. View dispatches a MOVE action like non-multiplayer one, but there should be
   a flag specifying server validation is required.
   ```js
     {
       type: 'MOVE',
       payload: {
         id: 1,
         x: 0,
         y: 1
       },
       meta: {
         server: true
       }
     }
   ```
2. serverMiddleware sends the action to the server and wait for the response.
   Since the action is fully executed from the server before sending the
   response, there is more information on the returned action, such as
   `distance` and more. After the action is returned, the middleware continues
   the action execution (aka middleware pipeline).
3. moveMiddleware simply passes the action to next middleware, since it's
   already validated - no need to validate it again.
4. posSystem and tileSystem updates the state like single player one.
5. View renders updated game state.
