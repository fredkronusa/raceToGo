import { renderHook } from "@testing-library/react";
import { useCountdown } from "@/hooks/useCountdown";

describe("useCountdown", () => {
  it("formats a future time with minutes and padded seconds", () => {
    // 100s in the future => 1m 40s
    const nowMs = 10000;
    const startTimeSec = Math.floor((nowMs + 100000) / 1000);

    const { result } = renderHook(() => useCountdown(startTimeSec, nowMs));

    expect(result.current).toEqual({ text: "1m 40s", isPast: false });
  });

  it("formats a future time under a minute without minutes", () => {
    // 7s in the future => 07s
    const nowMs = 10000;
    const startTimeSec = Math.floor((nowMs + 7000) / 1000);

    const { result } = renderHook(() => useCountdown(startTimeSec, nowMs));

    expect(result.current).toEqual({ text: "07s", isPast: false });
  });

  it("formats a past time under a minute with a leading minus and padded seconds", () => {
    // 9s in the past => -09s
    const nowMs = 10000;
    const startTimeSec = Math.floor((nowMs - 9000) / 1000);

    const { result } = renderHook(() => useCountdown(startTimeSec, nowMs));

    expect(result.current).toEqual({ text: "-09s", isPast: true });
  });

  it("formats a past time over a minute with minutes and padded seconds", () => {
    // 65s in the past => -1m 05s
    const nowMs = 10000;
    const startTimeSec = Math.floor((nowMs - 65000) / 1000);

    const { result } = renderHook(() => useCountdown(startTimeSec, nowMs));

    expect(result.current).toEqual({ text: "-1m 05s", isPast: true });
  });
});
