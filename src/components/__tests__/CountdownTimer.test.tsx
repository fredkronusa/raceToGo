import React from "react";
import { render, screen, act } from "@testing-library/react";
import CountdownTimer from "../CountdownTimer";

jest.mock("@/hooks/useCountdown", () => ({
  useCountdown: jest.fn(),
}));

const { useCountdown } = jest.requireMock("@/hooks/useCountdown");

describe("<CountdownTimer>", () => {
  it("renders correct text", () => {
    (useCountdown as jest.Mock).mockReturnValue({ text: "1m 05s", isPast: false });

    render(<CountdownTimer startTime={1} />);

    expect(screen.getByText("1m 05s")).toBeInTheDocument();
  });

  it("ensure correct class when isPast = false", () => {
    (useCountdown as jest.Mock).mockReturnValue({ text: "05s", isPast: false });

    render(<CountdownTimer startTime={1} />);

    const el = screen.getByText("05s");
    expect(el.className).toContain("text-accent-foreground");
    expect(el.className).not.toContain("text-destructive/80");
  });

  it("applies past class when isPast = true", () => {
    (useCountdown as jest.Mock).mockReturnValue({ text: "-05s", isPast: true });

    render(<CountdownTimer startTime={1_700_000_000} />);

    const el = screen.getByText("-05s");
    expect(el.className).toContain("text-destructive/80");
    expect(el.className).not.toContain("text-accent-foreground");
  });
});
