import { useNavigate } from "react-router-dom";
import { animated } from "react-spring";
import styled from "styled-components";
import { Signal, useMountAnimation, ButtonInput } from "../common";

const DetailScreenContainer = styled(animated.div)`
  padding-left: 10vw;
  padding-right: 10vw;
  padding-top: 5vh;
`;

const DetailPair = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  padding-bottom: 5vh;
`;

export function DetailScreen() {
  const {
    state: { signal, page, filter },
  }: { state: { signal: Signal; page: number; filter: string } } =
    useLocation();
  const { opacity, transform } = useMountAnimation();
  const entries = Object.entries(signal);
  const navigate = useNavigate();

  return (
    <DetailScreenContainer
      style={{
        opacity,
        transform,
      }}
    >
      <ButtonInput
        onClick={() => navigate("/", { state: { page: page, filter: filter } })}
      >
        Back
      </ButtonInput>
      <div style={{ paddingTop: "5vh" }}>
        {entries.map(([key, value], i) => {
          return value ? (
            <DetailPair key={i}>
              <div style={{ fontSize: 25 }}>{key}</div>
              <div>{value}</div>
            </DetailPair>
          ) : null;
        })}
      </div>
    </DetailScreenContainer>
  );
}

function useLocation(): {
  state: { signal: Signal; page: number; filter: string };
} {
  throw new Error("Function not implemented.");
}
