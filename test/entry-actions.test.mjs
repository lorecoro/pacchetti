import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { beforeEach, mock, test } from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const path = specifier === "@/db"
        ? "db/index.ts"
        : `${specifier.slice(2)}.ts`;
      return nextResolve(new URL(`../${path}`, import.meta.url).href, context);
    }

    if (specifier === "next/navigation" || specifier === "next/cache") {
      return {
        url: new URL(`../node_modules/${specifier}.js`, import.meta.url).href,
        shortCircuit: true,
      };
    }

    return nextResolve(specifier, context);
  },
});

const state = {};
const resetState = () => {
  state.session = null;
  state.calls = { create: [], update: [], delete: [] };
  state.errors = {};
  state.revalidated = [];
  state.redirected = [];
};

const runDatabaseCall = async (operation, args) => {
  state.calls[operation].push(args);
  if (state.errors[operation]) throw state.errors[operation];
  return { id: "entry-id" };
};

mock.module(new URL("../auth.ts", import.meta.url).href, {
  exports: { auth: async () => state.session },
});
mock.module(new URL("../db/index.ts", import.meta.url).href, {
  exports: {
    db: {
      entry: {
        create: (args) => runDatabaseCall("create", args),
        update: (args) => runDatabaseCall("update", args),
        delete: (args) => runDatabaseCall("delete", args),
      },
    },
  },
});
mock.module(import.meta.resolve("next-intl/server"), {
  exports: { getTranslations: async () => (key) => key },
});
mock.module(new URL("../node_modules/next/navigation.js", import.meta.url).href, {
  exports: {
    redirect: (path) => {
      state.redirected.push(path);
      throw new Error("redirected");
    },
  },
});
mock.module(new URL("../node_modules/next/cache.js", import.meta.url).href, {
  exports: { revalidatePath: (path) => state.revalidated.push(path) },
});
mock.module(new URL("../paths.ts", import.meta.url).href, {
  exports: { default: async () => ({ entries: () => "/entry/list" }) },
});

const { CreateEntry } = await import("../actions/entry-create.ts");
const { UpdateEntry } = await import("../actions/entry-update.ts");
const { default: DeleteEntry } = await import("../actions/entry-delete.ts");

beforeEach(resetState);

function entryForm(values = {}) {
  const formData = new FormData();
  for (const [key, value] of Object.entries({
    start: "2025-02-03T04:05:56.789Z",
    end: "2025-02-03T05:05:56.789Z",
    name: "Work",
    packageId: "package-id",
    ...values,
  })) {
    formData.set(key, value);
  }
  return formData;
}

test("CreateEntry rejects unauthenticated users", async () => {
  assert.deepEqual(await CreateEntry({}, entryForm()), {
    errors: { _form: ["not_logged_in"] },
  });
  assert.equal(state.calls.create.length, 0);
});

test("CreateEntry validates dates without writing", async () => {
  state.session = { user: { id: "user-id" } };

  const result = await CreateEntry({}, entryForm({ start: "not-a-date" }));

  assert.ok(result.errors?.start);
  assert.equal(state.calls.create.length, 0);
});

test("CreateEntry saves normalized dates and redirects", async () => {
  state.session = { user: { id: "user-id" } };

  await assert.rejects(CreateEntry({}, entryForm()), /redirected/);

  const [createCall] = state.calls.create;
  assert.equal(Date.parse(createCall.data.start), Date.parse("2025-02-03T04:05:00Z"));
  assert.equal(Date.parse(createCall.data.end), Date.parse("2025-02-03T05:05:00Z"));
  assert.equal(createCall.data.name, "Work");
  assert.equal(createCall.data.packageId, "package-id");
  assert.deepEqual(state.revalidated, ["/entry/list"]);
  assert.deepEqual(state.redirected, ["/entry/list"]);
});

test("UpdateEntry returns database errors", async () => {
  state.session = { user: { id: "user-id" } };
  state.errors.update = new Error("update failed");

  const result = await UpdateEntry({}, entryForm({ id: "entry-id" }));

  assert.deepEqual(result, { errors: { _form: ["update failed"] } });
  assert.deepEqual(state.revalidated, []);
});

test("UpdateEntry updates the selected entry and redirects", async () => {
  state.session = { user: { id: "user-id" } };

  await assert.rejects(
    UpdateEntry({}, entryForm({ id: "entry-id" })),
    /redirected/,
  );

  const [updateCall] = state.calls.update;
  assert.deepEqual(updateCall.where, { id: "entry-id" });
  assert.equal(Date.parse(updateCall.data.start), Date.parse("2025-02-03T04:05:00Z"));
  assert.equal(Date.parse(updateCall.data.end), Date.parse("2025-02-03T05:05:00Z"));
  assert.equal(updateCall.data.name, "Work");
  assert.equal(updateCall.data.packageId, "package-id");
  assert.deepEqual(state.revalidated, ["/entry/list"]);
  assert.deepEqual(state.redirected, ["/entry/list"]);
});

test("DeleteEntry rejects unauthenticated users", async () => {
  assert.deepEqual(await DeleteEntry("entry-id"), {
    errors: { _form: ["not_logged_in"] },
  });
  assert.equal(state.calls.delete.length, 0);
});

test("DeleteEntry returns database errors", async () => {
  state.session = { user: { id: "user-id" } };
  state.errors.delete = new Error("delete failed");

  const result = await DeleteEntry("entry-id");

  assert.deepEqual(result, { errors: { _form: ["delete failed"] } });
  assert.deepEqual(state.calls.delete, [{ where: { id: "entry-id" } }]);
  assert.deepEqual(state.revalidated, []);
});

test("DeleteEntry deletes the selected entry and redirects", async () => {
  state.session = { user: { id: "user-id" } };

  await assert.rejects(DeleteEntry("entry-id"), /redirected/);

  assert.deepEqual(state.calls.delete, [{ where: { id: "entry-id" } }]);
  assert.deepEqual(state.revalidated, ["/entry/list"]);
  assert.deepEqual(state.redirected, ["/entry/list"]);
});
