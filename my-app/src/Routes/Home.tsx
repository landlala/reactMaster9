import {useQuery} from "react-query";
import {getMovies, IGetMoviesResult} from "../api";
import styled from "styled-components";
import {makeImagePath} from "../utils";
import {motion, AnimatePresence, useScroll} from "framer-motion";
import {useState} from "react";
import {useWindowDimensions} from "../useWindowDimensions";
import {useNavigate, useMatch, PathMatch} from "react-router-dom";

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

const Slider = styled(motion.div)`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{bgPhoto: string}>`
  background-color: white;
  background-image: url(${props => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &: first-child {
    transform-origin: center left;
  }
  &: last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${props => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute; 
  width: 40vw;
  height: 80vh;
  background-color: ${props => props.theme.black.lighter};
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${props => props.theme.white.lighter};
  padding: 10px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${props => props.theme.white.lighter};
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth 
  },
  visible: {
    x: 0
  },
  exit: {
    x: -window.outerWidth
  }
};

const BoxVariants = {
  normal: {
    scale: 1
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition : {
      delay: 0.5,
      duration: 0.3,
      type: "tween"
    }
  }
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition : {
      delay: 0.5,
      duration: 0.3,
      type: "tween"
    }
  }
}

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:movieId");
  const {scrollY} = useScroll();
  const {data, isLoading} = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex(prev => prev === maxIndex ? 0 : prev + 1);
    }
  };
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving(prev => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const width = useWindowDimensions();
  const onOverlayClick = () => {
    navigate("/")
  };
  const clickedMovie = 
    bigMovieMatch?.params.movieId && 
    data?.results.find(movie => movie.id + "" === bigMovieMatch.params.movieId);
  console.log(clickedMovie);
  return (
    <Wrapper>{isLoading ? (
      <Loader>Loading...</Loader>
    ) : (
      <>
        <Banner onClick = {increaseIndex} bgPhoto = {makeImagePath(data?.results[0].backdrop_path || "")}>
          <Title>{data?.results[0].title}</Title>
          <Overview>{data?.results[0].overview}</Overview>
        </Banner>
        <Slider>
          <AnimatePresence initial = {false} onExitComplete = {toggleLeaving}>
            <Row 
              initial = {{x: width + 5}}
              animate = {{x: 0}}
              exit = {{x: -width - 5}}
              transition = {{type: "tween", duration: 1}}
              key = {index}
            >
              {data?.results.slice(1)
                .slice(offset*index, offset*index+offset)
                .map(movie => 
                <Box
                  layoutId = {movie.id + ""}
                  key = {movie.id} 
                  variants = {BoxVariants}
                  onClick = {() => onBoxClicked(movie.id)}
                  initial = "normal"
                  whileHover = "hover"
                  transition = {{type: "tween"}}
                  bgPhoto = {makeImagePath(movie.backdrop_path, "w500")} 
                >
                  <Info variants = {infoVariants}><h4>{movie.title}</h4></Info>
                </Box>
              )}
            </Row>
          </AnimatePresence>
        </Slider>
        <AnimatePresence>
          {bigMovieMatch ? 
            <>
              <Overlay
                onClick = {onOverlayClick}  
                animate = {{opacity: 1}}
                exit = {{opacity: 0}}
              />
              <BigMovie 
                style = {{top: scrollY.get() + 100}} 
                layoutId = {bigMovieMatch.params.movieId} 
              >
                {clickedMovie && 
                  <>
                    <BigCover 
                      style = {{
                        backgroundImage: 
                          `linear-gradient(to top, black, transparent), url(${makeImagePath(
                          clickedMovie.backdrop_path, 
                          "w500")})`
                      }}
                    />
                    <BigTitle>{clickedMovie.title}</BigTitle>
                    <BigOverview>{clickedMovie.overview}</BigOverview>
                  </>
                }
              </BigMovie>
          </>
          : null}
        </AnimatePresence>
      </>
    )}
    </Wrapper>  
  );
}

export default Home;