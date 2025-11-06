import { renderHook, act } from "@testing-library/react";
import { useCountdown } from "@/hooks/useCountdown";

describe("useCountdown (hook)", () => {
  const FIXED_NOW_MS = 1000;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(FIXED_NOW_MS));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows correct time", () => {
    // start in 90s
    const startTime = Math.floor(FIXED_NOW_MS / 1000) + 90;

    const { result } = renderHook(() => useCountdown(startTime));

    expect(result.current.text).toBe("1m 30s");
    expect(result.current.isPast).toBe(false);

    // Advance 40s
    act(() => {
      jest.advanceTimersByTime(40_000);
      jest.setSystemTime(new Date(FIXED_NOW_MS + 40_000));
    });

    // Now 90s - 40s remaining
    expect(result.current.text).toBe("50s");
    expect(result.current.isPast).toBe(false);
  });

  it("shows negative time after passing startTime", () => {
    // started 10s ago
    const startTime = Math.floor(FIXED_NOW_MS / 1000) - 10;

    const { result } = renderHook(() => useCountdown(startTime));

    expect(result.current.text).toBe("-10s");
    expect(result.current.isPast).toBe(true);

    // Advance 70s -> -90s
    act(() => {
      jest.advanceTimersByTime(70_000);
      jest.setSystemTime(new Date(FIXED_NOW_MS + 70_000));
    });

    expect(result.current.text).toBe("-20s");
    expect(result.current.isPast).toBe(true);
  });
});
