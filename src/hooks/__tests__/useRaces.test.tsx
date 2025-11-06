import { renderHook, act } from "@testing-library/react";
import { useRaces } from "@/hooks/useRaces";

type RaceSummary = {
  race_id: string;
  category_id: string;
  advertised_start: { seconds: number };
};

type ApiShape = {
  status: number;
  data?: {
    next_to_go_ids: string[];
    race_summaries: Record<string, RaceSummary>;
  };
};

const SECS = (n: number) => n * 1000;
const BASE_NOW_SEC = 1_700_000_000;

const buildApiResponse = (races: RaceSummary[]): ApiShape => ({
  status: 200,
  data: {
    next_to_go_ids: races.map((r) => r.race_id),
    race_summaries: Object.fromEntries(races.map((r) => [r.race_id, r])),
  },
});

const mockFetchOk = (payload: ApiShape) => {
  (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
    ok: true,
    status: payload.status ?? 200,
    json: async () => payload,
  });
};

const mockFetchNotOk = (status = 500) => {
  (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({}),
  });
};

const flush = async () => {
  await act(async () => {}); // let pending microtasks resolve
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(SECS(BASE_NOW_SEC)));
  (global.fetch as any) = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

describe("useRaces", () => {
  test("loads on mount, excludes expired, sorts ascending, caps to 5", async () => {
    const now = BASE_NOW_SEC;
    const races: RaceSummary[] = [
      { race_id: "x-expired", category_id: "dogs", advertised_start: { seconds: now - 60 } }, // excluded (>= 60s old)
      { race_id: "a", category_id: "dogs", advertised_start: { seconds: now + 30 } },
      { race_id: "b", category_id: "horses", advertised_start: { seconds: now + 10 } },
      { race_id: "c", category_id: "trots", advertised_start: { seconds: now + 50 } },
      { race_id: "d", category_id: "dogs", advertised_start: { seconds: now + 20 } },
      { race_id: "e", category_id: "dogs", advertised_start: { seconds: now + 40 } },
      { race_id: "f", category_id: "dogs", advertised_start: { seconds: now + 60 } },
    ];
    mockFetchOk(buildApiResponse(races));

    const { result } = renderHook(() => useRaces([]));

    await flush();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    expect(result.current.races.map((r) => r.race_id)).toEqual(["b", "d", "a", "e", "c"]);
  });

  test("re-fetches when a race expires (expiryTick increases)", async () => {
    const now = BASE_NOW_SEC;

    // 'soon' is still upcoming at t=0 (now-59 > now-60), will expire after 2s
    const initial: RaceSummary[] = [
      { race_id: "soon", category_id: "dogs", advertised_start: { seconds: now - 59 } },
      { race_id: "later", category_id: "dogs", advertised_start: { seconds: now + 120 } },
    ];
    mockFetchOk(buildApiResponse(initial));

    renderHook(() => useRaces([]));
    await flush();
    const callsAfterInitial = (global.fetch as jest.Mock).mock.calls.length;

    // advance 2s: clock ticks; 'soon' becomes expired; hook bumps expiryTick -> refetch
    act(() => {
      jest.advanceTimersByTime(SECS(2));
    });
    await flush();

    expect((global.fetch as jest.Mock).mock.calls.length).toBeGreaterThan(callsAfterInitial);
  });

  test("refetches when becoming short for selected categories", async () => {
    const now = BASE_NOW_SEC;

    // Provide enough overall races (so shortage=false with empty categories),
    // but few in A so that when selecting ["A"] we become short (MIN=5).
    const pool: RaceSummary[] = [
      { race_id: "a1", category_id: "A", advertised_start: { seconds: now + 20 } },
      { race_id: "a2", category_id: "A", advertised_start: { seconds: now + 40 } },
      { race_id: "b1", category_id: "B", advertised_start: { seconds: now + 60 } },
      { race_id: "b2", category_id: "B", advertised_start: { seconds: now + 80 } },
      { race_id: "b3", category_id: "B", advertised_start: { seconds: now + 100 } },
      { race_id: "b4", category_id: "B", advertised_start: { seconds: now + 120 } },
    ];
    mockFetchOk(buildApiResponse(pool));

    const { rerender } = renderHook(({ cats }) => useRaces(cats), {
      initialProps: { cats: [] as string[] }, // no shortage initially (>= RACES_TO_SHOW (5))
    });
    await flush();
    const callsAfterInitial = (global.fetch as jest.Mock).mock.calls.length;

    // Now require category A → counts in A = 2 < MIN(5) → becameShort=true → refetch
    await act(async () => {
      rerender({ cats: ["A"] });
    });
    await flush();

    expect((global.fetch as jest.Mock).mock.calls.length).toBeGreaterThan(callsAfterInitial);
  });

  test("sets error when fetch returns non-OK", async () => {
    mockFetchNotOk(502);

    const { result } = renderHook(() => useRaces([]));
    await flush();

    expect(result.current.error).toMatch(/502/);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.races).toEqual([]);
  });

  test("sets error when API payload is invalid (missing data/race_summaries)", async () => {
    mockFetchOk({ status: 200, data: undefined }); // invalid per hook
    const { result } = renderHook(() => useRaces([]));

    await flush();
    expect(result.current.error).toMatch(/Invalid API response structure/i);
  });
});
