import assert from "node:assert";
import test, { describe } from "node:test";
import { injectIn, useInjectedContext } from "./main";

type Context = Record<string, any>;

describe("Context dependency injector", () => {
  test("Can use context inside call stack", async () => {
    const createTruc = () => {
      const context = useInjectedContext<Context>("id");
      return context.foo;
    };

    const main = () => {
      return createTruc();
    };

    const CONTEXT = {
      foo: "bar",
    };

    const method = injectIn("id", main, CONTEXT);
    assert.strictEqual(method(), "bar");
  });

  test("Contexts are segregated based on async flow", () => {
    const createTruc = () => {
      const context = useInjectedContext<Context>("context");
      return context.foo;
    };

    const main = () => {
      return createTruc();
    };

    const CONTEXT1 = {
      foo: "bar",
    };
    const CONTEXT2 = {
      foo: "babar",
    };

    const method1 = injectIn("context", main, CONTEXT1);
    const method2 = injectIn("context", main, CONTEXT2);

    assert.strictEqual(method2(), "babar");
    assert.strictEqual(method1(), "bar");
  });

  test("Contexts can be nested", () => {
    const CHILD_CONTEXT = {
      child: "childFoo",
    };

    const CONTEXT = {
      foo: "bar",
    };

    const createTruc = () => {
      const parentContext = useInjectedContext<Context>("parent");
      const childContext = useInjectedContext<Context>("child");
      return {
        foo: parentContext.foo,
        child: childContext.child,
      };
    };

    const main = () => {
      const truc = injectIn("child", createTruc, CHILD_CONTEXT);
      return truc();
    };

    const method = injectIn("parent", main, CONTEXT);
    assert.deepEqual(method(), {
      foo: "bar",
      child: "childFoo",
    })
  });
});
