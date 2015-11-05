Attacking an entity
===================

How should an entity attack one other entity in a tile-based game engine?

1. View should dispatch an ATTACK action containing origin entity ID, and the
   target entity ID. This can be represented as a JSON object:
   ```js
     {
       type: 'ATTACK',
       payload: {
         origin: 1,
         target: 1
       }
     }
   ```
2. attackMiddleware validates and calculates the damage. Since damage can be
   randomized, this 'updates' the attack damage and puts it to the action.
   After updating the attack damage, this dispatches additional DAMAGE action.
3. damageMiddleware calculates the resulting damage and dispatches KILL action
   appropriately. KILL action should despawn the entity.
4. healthSystem updates the health from the state.
5. View renders the updated game state.
