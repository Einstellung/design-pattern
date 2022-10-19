import { Action, Dispatch, Reducer } from "./types";

export default function createStore<S, A extends Action>(
  reducer: Reducer<S, A>
) {
  let currentState: S;
  let currentReducer = reducer;
  let isDispatching = false;
  let currentListeners: (() => void)[] | null = [];
  let nextListeners = currentListeners;

  function getState(): S {
    if (isDispatching) {
      throw new Error(
        "You may not call store.getState() while the reducer is executing."
      );
    }
    return currentState as S;
  }

  function subscribe(listener: () => void) {
    if (typeof listener !== "function") {
      throw new Error("Expected the listener to be a funciton.");
    }
    if (isDispatching) {
      throw new Error(
        "You may not call store.getState() while the reducer is executing."
      );
    }

    let isSubscribed = true
    nextListeners.push(listener)

    return function unsubscribe() {
      if(!isSubscribed) {
        return
      }
      if (isDispatching) {
        throw new Error(
          "You may not call store.getState() while the reducer is executing."
        );
      }

      isSubscribed = false

      // todo!!
      nextListeners = nextListeners.filter(x => x !== listener)
      currentListeners = null
    }
  }

  function dispatch(action: A) {
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    const listeners = (currentListeners = nextListeners)
    // todo!!

    listeners.forEach(listener => {
      listener()
    })
    
    return action
  }

  const store = {
    dispatch: dispatch as Dispatch<A>,
    subscribe,
    getState
  }

  return store
}
