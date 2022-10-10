import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSpring, to, animated } from "react-spring";
import styled from "styled-components";
import {
  ButtonInput,
  useInputEvents,
  useMountAnimation,
  useSignals,
} from "../common";

const NavigationHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const ButtonPair = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 5vh;
  width: 300px;
`;

const InputLabel = styled.div`
  color: white;
  padding-bottom: 10px;
`;

const FeedScreenContainer = styled(animated.div)`
  padding-top: 10vmin;
  padding-left: 10vmin;
`;

const FeedField = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  width: 170px;
`;

function FeedRowInput({
  headers,
  signal,
  page,
  filter,
}: {
  headers: string[];
  signal: Signal;
  page: number;
  filter: string;
}) {
  const { pointerDown, hover, events } = useInputEvents();
  const { pointerScale } = useSpring({ pointerScale: pointerDown ? 0.1 : 0 });
  const { hoverScale } = useSpring({ hoverScale: hover ? 1.1 : 1 });
  const transform = to([hoverScale, pointerScale], (s, f) => `scale(${s + f})`);
  const navigate = useNavigate();
  return (
    <animated.div style={{ transform }}>
      <FeedRow
        {...events}
        onClick={() => {
          navigate("details", {
            state: { signal: signal, page: page, filter: filter },
          });
        }}
      >
        {headers.map((h, i) => (
          <FeedField key={i}>{signal[h]}</FeedField>
        ))}
      </FeedRow>
    </animated.div>
  );
}

type Signal = { [name: string]: string };
const FeedRow = styled.div`
  padding-bottom: 15px;
  display: flex;
  flex-direction: row;
  color: white;
  padding-top: 10px;
`;

const FeedHeader = styled.div`
  display: flex;
  flex-direction: row;
  color: white;
  borderbottom: 1px solid white;
`;

const FeedHeaderField = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  flex-grow: 1px;
  min-width: 170px;
`;

export function Feed({
  isLoading,
  headers,
  data,
  page,
  filter,
}: {
  isLoading: boolean;
  headers: string[];
  data: Signal[];
  page: number;
  filter: string;
}) {
  const { opacity } = useSpring({
    to: { opacity: isLoading ? 0 : 1 },
  });

  const [Rank, Domain, Month, CompanyName, FoundedDate] = headers;

  return (
    <div
      style={{
        color: "white",
        height: "70vh",
      }}
    >
      {isLoading && <p>loading</p>}
      <animated.div style={{ opacity }}>
        {!isLoading && (
          <FeedHeader>
            {[Rank, Domain, Month, CompanyName, FoundedDate].map((field, i) => {
              return <FeedHeaderField key={i}>{field}</FeedHeaderField>;
            })}
          </FeedHeader>
        )}
        {!isLoading &&
          data.map((s, i) => {
            return (
              <FeedRowInput
                page={page}
                filter={filter}
                key={i}
                headers={[Rank, Domain, Month, CompanyName, FoundedDate]}
                signal={s}
              />
            );
          })}
      </animated.div>
    </div>
  );
}

const AnimatedInput = styled(animated.input)`
  width: 200;
  margin-bottom: 5vh;
`;
function SearchInput({
  onChange,
}: {
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { pointerDown, hover, focus, events } = useInputEvents();
  const { pointerScale } = useSpring({ pointerScale: pointerDown ? 0.2 : 0 });
  const { hoverScale } = useSpring({ hoverScale: hover ? 1.1 : 1 });
  const { focusScale } = useSpring({ focusScale: focus ? 0.2 : 0 });
  const transform = to(
    [hoverScale, pointerScale, focusScale],
    (h, p, f) => `scale( ${h + p + f})`
  );
  return (
    <AnimatedInput
      {...events}
      style={{ transform }}
      onChange={(val) => onChange(val)}
    />
  );
}

export default function FeedScreen() {
  const { state }: { state?: { page: number; filter: string } } = useLocation();
  const [page, setPage] = useState(state ? state.page : 0);
  const [filter, setFilter] = useState(state ? state.filter : "");
  const { data, isLoading, isFetching } = useSignals(page, filter);
  const { opacity, transform } = useMountAnimation();
  return (
    <FeedScreenContainer
      style={{
        opacity,
        transform,
      }}
    >
      {!isLoading && (
        <NavigationHeader>
          <div>
            <InputLabel>Search by company name</InputLabel>
            <SearchInput
              onChange={(value) => {
                setPage(0);
                setFilter(value.target.value);
              }}
            />
          </div>
          <div>
            <ButtonPair>
              <ButtonInput
                disabled={page === 0}
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                Previous
              </ButtonInput>
              <ButtonInput
                disabled={data!.hasNextPage || isFetching}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </ButtonInput>
            </ButtonPair>
          </div>
        </NavigationHeader>
      )}

      <Feed
        page={page}
        filter={filter}
        isLoading={isLoading}
        headers={data ? data.fields : []}
        data={data ? data.signals : []}
      />
    </FeedScreenContainer>
  );
}
