/* eslint-env node, mocha */

const assert = require("assert");
const groupByType = require("../src/groupByType");
const DEFAULT_CONFIG = require("../src/defaultConfig");

describe("groupByType", () => {
  it("should group and sort commits by type", () => {
    const commits = [
      { subject: "Subject 0", type: "other", notes: [] },
      { subject: "Subject 1", type: "feat", notes: [] },
      { subject: "Subject 2", type: "nonexisting", notes: [] },
      { subject: "Subject 3", type: "feat", notes: [] },
      { subject: "Subject 4", type: "fix", notes: [] },
      { subject: "Subject 5", type: "fix", notes: [] },
    ];

    const expected = [
      {
        type: "feat",
        commits: [
          { subject: "Subject 1", type: "feat", notes: [] },
          { subject: "Subject 3", type: "feat", notes: [] },
        ],
      },
      {
        type: "fix",
        commits: [
          { subject: "Subject 4", type: "fix", notes: [] },
          { subject: "Subject 5", type: "fix", notes: [] },
        ],
      },
      {
        type: "other",
        commits: [{ subject: "Subject 0", type: "other", notes: [] }],
      },
      {
        type: "nonexisting",
        commits: [{ subject: "Subject 2", type: "nonexisting", notes: [] }],
      },
    ];

    const result = groupByType(commits, DEFAULT_CONFIG.types);
    assert.deepStrictEqual(result, expected);
  });

  it("should test failure too", () => {
    const commits = [
      { subject: "Subject 0", type: "other", notes: [] },
      { subject: "Subject 1", type: "feat", notes: [] },
    ];

    const notExpected = [
      {
        type: "other",
        commits: [{ subject: "Subject 0", type: "other", notes: [] }],
      },
      {
        type: "feat",
        commits: [{ subject: "Subject 1", type: "feat", notes: [] }],
      },
    ];

    const expected = [
      {
        type: "feat",
        commits: [{ subject: "Subject 1", type: "feat", notes: [] }],
      },
      {
        type: "other",
        commits: [{ subject: "Subject 0", type: "other", notes: [] }],
      },
    ];

    const result = groupByType(commits, DEFAULT_CONFIG.types);
    assert.notDeepStrictEqual(result, notExpected);
    assert.deepStrictEqual(result, expected);
  });

  it("should test with reverts", () => {
    const commits = [
      {
        subject: "Fix",
        type: "fix",
        sha: "7ec9e81e765a457f012bf0747f7a5a60831899e2",
      },
      {
        subject: "Feature",
        type: "feat",
        sha: "bcb8767bc22bc7d4ab47a4fffd4ef435de581054",
      },
      {
        subject: 'revert: "fix: Fix"',
        type: "revert",
        body: "This reverts commit 7ec9e81e765a457f012bf0747f7a5a60831899e2.",
        sha: "f5ee7f1bc36e2b0688c83918e9821de10a97aa04",
      },
    ];

    const expected = [
      {
        type: "feat",
        commits: [{ subject: "Feature", type: "feat", sha: "bcb8767bc22bc7d4ab47a4fffd4ef435de581054" }],
      },
    ];

    const result = groupByType(commits, DEFAULT_CONFIG.types);
    assert.deepStrictEqual(result, expected);
  });
});
