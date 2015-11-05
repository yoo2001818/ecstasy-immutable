import { createAction } from 'redux-actions';

export const SPAWN = 'spawn';
export const UPDATE = 'update';
export const INIT = 'init';

export const init = createAction(INIT);
export const spawn = createAction(SPAWN);
export const update = createAction(UPDATE);

export function idSystem(state = { last: 0 }, action, root) {
  const { payload, type } = action;
  switch (type) {
  case SPAWN:
    if (payload && payload.id != null) {
      state.last = payload.id + 1;
    }
    return state;
  }
  return state;
}

export function spawnSystem(name, state = {}, action, root) {
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

export function spawnMiddleware(engine, action, next) {
  if (action.type !== SPAWN) return next(action);
  let { id } = engine.getState();
  return next(Object.assign({}, action, {
    payload: Object.assign({}, action.payload, {
      id: id.last
    })
  }));
}
