import {useQuery} from "react-query";
import {getMovies, IGetMoviesResult} from "../api";
import styled from "styled-components";
import {makeImagePath} from "../utils";

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{bgPhoto: string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${props => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 70px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 35px;
  width: 50%;
`;

function Home() {
  const {data, isLoading} = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  return (
    <Wrapper>{isLoading ? (
      <Loader>Loading...</Loader>
    ) : (
      <>
        <Banner bgPhoto = {makeImagePath(data?.results[1].backdrop_path || "")}>
          <Title>{data?.results[1].title}</Title>
          <Overview>{data?.results[1].overview}</Overview>
        </Banner>
      </>
    )}
    </Wrapper>  
  );
}

export default Home;