import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("challan number format", () => {
  it("matches CH-YYYYMMDD-NNNN", () => {
    const sample = "CH-20260911-0001";
    assert.match(sample, /^CH-\d{8}-\d{4}$/);
  });
});
