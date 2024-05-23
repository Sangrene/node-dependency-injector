import { AsyncLocalStorage } from "node:async_hooks";

const asyncLocalStorage = new AsyncLocalStorage<Record<string, any>>();

export function useInjectedContext<C>(id: string): C {
  const store = asyncLocalStorage.getStore();
  if (!store) throw new Error(`No store available in the async flow. injectIn need to be used upward in the call stack.`);
  if(!store[id]) throw new Error(`No context associated with id ${id}`);
  return store[id] as C;
}

export function injectIn<T extends (...args: any[]) => any>(
  id: string,
  func: T,
  context: Record<string, any>
) {
  const store = asyncLocalStorage.getStore();

  if (store && store[id]) {
    throw new Error("A context with this id has already been injected");
  }
  
  const computedContext = { ...store, [id]: context };

  return asyncLocalStorage.run(computedContext, () =>
    AsyncLocalStorage.bind(func)
  );
}
