import expect from 'expect';
import createStore, { createAction, builtIn } from '../src/index.js';

const {
  SPAWN, INIT, UPDATE, init, spawn, update, idSystem, spawnSystem,
  spawnMiddleware
} = builtIn;

const POS_ADD = 'pos_add';

const posAdd = createAction(POS_ADD, (id, x, y) => ({
  id, x, y
}));

function logMiddleware(engine, action, next) {
  console.log(action);
  return next(action);
}

function velMiddleware(engine, action, next) {
  if (action.type !== UPDATE) return next(action);
  let { vel } = engine.getState();
  for (let id in vel) {
    let value = vel[id];
    engine.dispatch(posAdd(id, value.x, value.y));
  }
  return next(action);
}

function posSystem(state = {}, action, root) {
  spawnSystem('pos', state, action, root);
  const { payload, type } = action;
  switch (type) {
  case POS_ADD:
    let pos = state[payload.id];
    pos.x += payload.x;
    pos.y += payload.y;
    return state;
  }
  return state;
}

const store = createStore([
  logMiddleware, spawnMiddleware, velMiddleware
], {
  id: idSystem,
  pos: posSystem,
  vel: spawnSystem.bind(null, 'vel')
});

store.dispatch(init());

expect(store.getState()).toEqual({
  id: { last: 0 },
  pos: {},
  vel: {}
});

store.dispatch(spawn({
  pos: { x: 0, y: 0 },
  vel: { x: 2, y: 2 }
}));

expect(store.getState()).toEqual({
  id: { last: 1 },
  pos: {
    0: { x: 0, y: 0 }
  },
  vel: {
    0: { x: 2, y: 2 }
  }
});

store.dispatch(update());

expect(store.getState()).toEqual({
  id: { last: 1 },
  pos: {
    0: { x: 2, y: 2 }
  },
  vel: {
    0: { x: 2, y: 2 }
  }
});
