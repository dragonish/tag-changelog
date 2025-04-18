/* eslint-env node, mocha */

const assert = require("assert");
const parseRevertBody = require("../src/parseRevertBody");

describe("parseRevertBody", () => {
  it("should parse a revert body with a commit hash", async () => {
    const result = await parseRevertBody("This reverts commit 7ec9e81e765a457f012bf0747f7a5a60831899e2.");
    assert.strictEqual(result, "7ec9e81e765a457f012bf0747f7a5a60831899e2");
  });
});
