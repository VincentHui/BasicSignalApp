import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Papa from "papaparse";
import React, { useState, useEffect, ReactNode } from "react";
import { animated, to, useSpring } from "react-spring";

export function useMountAnimation() {
  const [mountState, setMountState] = useState<"mount" | "unmount">("unmount");
  useEffect(() => {
    setMountState("mount");
    return () => setMountState("unmount");
  }, [mountState]);
  return useSpring({
    opacity: mountState === "mount" ? 1 : 0,
    transform:
      mountState === "mount" ? "translate3d(0,0,0)" : "translate3d(100%,0,0)",
  });
}

export function useSignals(page: number, filter: string) {
  return useQuery(
    ["signals", page, filter],
    async () => {
      try {
        const signals = await getSignals(page, filter || "");
        return signals;
      } catch (e) {}
    },
    { keepPreviousData: true }
  );
}

export type Signal = { [name: string]: string };

async function getSignals(
  page = 0,
  searchName = "ca"
): Promise<{
  signals: Signal[];
  fields: string[];
  hasNextPage: boolean;
}> {
  const { data } = await axios.get<string>(
    `${process.env.PUBLIC_URL}/SpecterDataChallenge.csv`
  );
  const {
    meta: { fields },
    data: parsedData,
  } = Papa.parse<Signal>(data, { header: true });
  const filtered = parsedData.filter(
    (row) =>
      row["Company Name"].toUpperCase().indexOf(searchName.toUpperCase()) > -1
  );
  const start = page * 10;
  const startNextPage = (page + 1) * 10;
  return {
    signals: filtered.slice(start, start + 10),
    fields: fields ? fields : [],
    hasNextPage: filtered.slice(startNextPage, startNextPage + 10).length === 0,
  };
}
export function useInputEvents() {
  const [hover, setHover] = useState(false);
  const [pointerDown, setPointerDown] = useState(false);
  const [focus, setFocus] = useState(false);
  const reset = () => {
    setHover(false);
    setPointerDown(false);
    setFocus(false);
  };
  const events = {
    onPointerEnter: () => setHover(true),
    onPointerLeave: () => {
      setHover(false);
      setPointerDown(false);
    },
    onPointerDown: () => setPointerDown(true),
    onPointerUp: () => setPointerDown(false),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
  };

  return { hover, pointerDown, focus, events, reset };
}

export function ButtonInput({
  onClick,
  disabled = false,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  const { pointerDown, hover, events } = useInputEvents();
  const { pointerScale } = useSpring({ pointerScale: pointerDown ? 0.4 : 0 });
  const { hoverScale } = useSpring({ hoverScale: hover ? 1.4 : 1 });
  const transform = to(
    [hoverScale, pointerScale],
    (s, f) => `scale( ${disabled ? 1 : s + f})`
  );
  return (
    <animated.button
      style={{ transform }}
      {...events}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </animated.button>
  );
}
