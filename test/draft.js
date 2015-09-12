import ecstasy from '../src/index.js';

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
    if (action.vel == null) return state;
    return Object.assign({}, state, {
      [action.id]: action.vel
    });
  }
  return state;
}

function positionSystem(state, action) {
  switch (action.type) {
  case 'add':
    if (action.pos == null) return state;
    return Object.assign({}, state, {
      [action.id]: action.pos
    });
  case 'pos_add':
    const entity = state[action.entity];
    return Object.assign({}, state, {
      [action.entity]: {
        x: action.x + entity.x,
        y: action.y + entity.y
      }
    });
  }
  return state;
}

let engine = ecstasy([
  velocityMiddleware
], {
  vel: velocitySystem,
  pos: positionSystem
});

engine.dispatch({
  type: 'add',
  pos: {
    x: 0,
    y: 0
  },
  vel: {
    x: 3,
    y: 3
  }
});

engine.dispatch({
  type: 'update'
});
