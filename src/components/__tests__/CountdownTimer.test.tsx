import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import CountdownTimer from "@/components/CountdownTimer";

jest.mock("@/hooks/useCountdown", () => ({
  useCountdown: jest.fn(),
}));

const { useCountdown } = jest.requireMock("@/hooks/useCountdown");

describe("CountdownTimer", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("renders future time text and applies the 'future' class", () => {
    (useCountdown as jest.Mock).mockReturnValue({ text: "07s", isPast: false });

    const props = { startTime: 1, now: 1 };
    render(<CountdownTimer {...props} />);

    expect(useCountdown).toHaveBeenCalledWith(props.startTime, props.now);

    const el = screen.getByText("07s");
    expect(el).toBeInTheDocument();

    expect(el.className).toContain("text-accent-foreground");
    expect(el.className).not.toContain("text-destructive/80");
  });

  it("renders past time text and applies the 'past' class", () => {
    (useCountdown as jest.Mock).mockReturnValue({ text: "-12s", isPast: true });

    render(<CountdownTimer startTime={1} now={1} />);

    const el = screen.getByText("-12s");
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("text-destructive/80");
    expect(el.className).not.toContain("text-accent-foreground");
  });

  it("updates when the hook result changes on rerender", () => {
    (useCountdown as jest.Mock)
      .mockReturnValueOnce({ text: "10s", isPast: false })
      .mockReturnValueOnce({ text: "-01s", isPast: true });

    const { rerender } = render(<CountdownTimer startTime={1} now={1} />);
    expect(screen.getByText("10s")).toBeInTheDocument();

    rerender(<CountdownTimer startTime={1} now={1} />);

    const el = screen.getByText("-01s");
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("text-destructive/80");
  });
});
