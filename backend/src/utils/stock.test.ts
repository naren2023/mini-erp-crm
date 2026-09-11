import assert from "node:assert/strict";
import { describe, it } from "node:test";

function nextStock(current: number, quantity: number, type: "IN" | "OUT") {
  const result = type === "IN" ? current + quantity : current - quantity;
  if (result < 0) {
    throw new Error(`Insufficient stock. Available: ${current}, Requested: ${quantity}.`);
  }
  return result;
}

describe("stock rules", () => {
  it("increases stock for IN movements", () => {
    assert.equal(nextStock(5, 3, "IN"), 8);
  });

  it("decreases stock for OUT movements", () => {
    assert.equal(nextStock(5, 3, "OUT"), 2);
  });

  it("never allows negative stock", () => {
    assert.throws(() => nextStock(5, 8, "OUT"), /Insufficient stock/);
  });
});
