// Since a game requires a lot of memory, copying data on every frame
// doesn't seem to be a great idea.

import Engine, { spawn, update, spawnSystem } from '../src/index.js';

function velocityMiddleware(engine, action, next) {
  if (action.type !== 'update') return next(action);
  let { vel } = engine.getState();
  vel.forEach(entity => engine.dispatch({
    type: 'pos_add',
    x: entity.x,
    y: entity.y
  }));
  return next(action);
}

function velocitySystem(state, action) {
  switch (action.type) {
  case 'add':
    if (action.vel == null) return;
    state[action.id] = action.vel;
    return;
  }
  return;
}

function positionSystem(state, action) {
  switch (action.type) {
  case 'add':
    if (action.pos == null) return;
    state[action.id] = action.pos;
    return;
  case 'pos_add':
    const entity = state[action.entity];
    entity.x += action.x;
    entity.y += action.y;
    return;
  }
  return;
}

let engine = new Engine([
  velocityMiddleware
], {
  vel: velocitySystem,
  pos: positionSystem
});

engine.dispatch(spawn({
  pos: {
    x: 0,
    y: 0
  },
  vel: {
    x: 3,
    y: 3
  }
}));

engine.dispatch(update());
