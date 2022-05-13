import { Container, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Rating from '@mui/material/Rating';
import { MovieCard } from "../components/MovieCard";
import star from "../icons/star.svg";


export function MoviePage() {
    const [movie, setMovie] = useState();
    const { movieId } = useParams();
    const [similar, setSimilar] = useState([]);


    useEffect(() => {
        fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=d65708ab6862fb68c7b1f70252b5d91c&language=ru-RU`
        )
            .then((res) => res.json())
            .then(setMovie);
    }, [movieId]);
    useEffect(() => {
        fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=d65708ab6862fb68c7b1f70252b5d91c&language=ru-RU`
        )
            .then((res) => res.json())
            .then((res) => setSimilar(res.results));
    }, [movieId]);


    if (!movie) {
        return "Loading...";
    }

    return (
        <div className='wrapper' style={{ backgroundColor: "#1d1d1d" }}>
            <div className="movie_wrapper" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})` }}
            >

                <Container>
                    <div className="category_wrapper">{movie.genres.map((item) => (<span className="category">{item.name}</span>))}</div>
                    <div className="movie_card__stars">
                        {movie.vote_average >= 0 && <img src={star} alt="" />}
                        {movie.vote_average >= 2 && <img src={star} alt="" />}
                        {movie.vote_average >= 4 && <img src={star} alt="" />}
                        {movie.vote_average >= 6 && <img src={star} alt="" />}
                        {movie.vote_average >= 8 && <img src={star} alt="" />}
                    </div>
                    <h1 className="movie_wrapper__title">{movie.title}</h1>
                    <p className="movie_wrapper__title">{movie.overview}</p>

                </Container>
            </div>
            <div className="wrapper_f">
                <Container>
                    <h1 className="title">Similar Movies</h1>
                    <Grid container spacing={5}>
                        {similar.slice(0, 5).map((movie) => (
                            <Grid item xs={12 / 5}>
                                <MovieCard key={movie.id} movie={movie} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </div>
            <div className="footer"></div>
        </div>
    );
}
