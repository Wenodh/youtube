import { formatDate, formatViewCount } from "./helperFunctions";

describe("formatViewCount", () => {
  test("formats thousands, millions and billions", () => {
    expect(formatViewCount(1200)).toBe("1.2K");
    expect(formatViewCount(1500000)).toBe("1.5M");
    expect(formatViewCount(2000000000)).toBe("2.0B");
  });

  test("handles missing and invalid values", () => {
    expect(formatViewCount(undefined)).toBe("0");
    expect(formatViewCount("not-a-number")).toBe("0");
  });
});

describe("formatDate", () => {
  test("handles missing and invalid dates", () => {
    expect(formatDate()).toBe("");
    expect(formatDate("not-a-date")).toBe("");
  });

  test("formats valid timestamps", () => {
    expect(formatDate(new Date(Date.now() - 60000).toISOString())).toBe("1 minute ago");
  });
});
