import expect from 'expect';
import createStore, { createAction } from '../src/index.js';

const SPAWN = 'spawn';
const UPDATE = 'update';
const INIT = 'init';

const POS_ADD = 'pos_add';

const init = createAction(INIT);
const spawn = createAction(SPAWN);
const update = createAction(UPDATE);

const posAdd = createAction(POS_ADD, (id, x, y) => ({
  id, x, y
}));

// This would be a builtin object
function spawnMiddleware(engine, action, next) {
  if (action.type !== SPAWN) return next(action);
  let { id } = engine.getState();
  return next(Object.assign({}, action, {
    payload: Object.assign({}, action.payload, {
      id: id.last
    })
  }));
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

// This would be a builtin object, too.
function idSystem(state = { last: 0 }, action, root) {
  const { payload, type } = action;
  switch (type) {
  case SPAWN:
    if (payload && payload.id) {
      state.last = payload.id + 1;
    }
    return state;
  }
  return state;
}

// same for this
function spawnSystem(name, state = {}, action, root) {
  const { payload, type } = action;
  switch (type) {
  case SPAWN:
    if (payload && payload[name]) {
      state[payload.id] = payload[name];
    }
    return state;
  }
  return state;
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
  spawnMiddleware, velMiddleware
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
