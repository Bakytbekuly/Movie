import {
    Grid,
    Pagination,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { MovieCard } from "./MovieCard";
import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "../hooks/useDebounce";

export function MovieGrid() {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("popularity.desc");
    const debouncedSearch = useDebounce(search, 300);

    const fetchMovies = useCallback((page = 1, query, sort) => {
        fetch(
            `https://api.themoviedb.org/3/${query ? "search" : "discover"
            }/movie?api_key=d65708ab6862fb68c7b1f70252b5d91c&language=ru-RU&sort_by=${sort}&include_adult=false&include_video=false&page=${page}&query=${query}`
        )
            .then((res) => res.json())
            .then((res) => {
                setPage(page);
                setTotalPages(Math.min(res.total_pages, 500));
                setMovies(res.results);
            });
    }, []);

    useEffect(() => {
        fetchMovies(1, debouncedSearch, sort);
    }, [debouncedSearch]);

    function handleSubmit(e) {
        e.preventDefault();
        fetchMovies(1, search, sort);
    }

    function handleSearch(e) {
        setSearch(e.target.value);
    }

    function handlePageChange(page) {
        window.scrollTo(0, 0);
        fetchMovies(page, search, sort);
    }

    function handleSort(sort) {
        fetchMovies(1, search, sort);
    }

    useEffect(() => {
        fetchMovies(1, "", sort);
    }, [fetchMovies]);

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                style={{ margin: "10px 0", display: "flex", justifyContent: "center" }}
            >
                <FormControl sx={{ width: "200px" }}>
                    <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                    <Select
                        value={sort}
                        size="small"
                        label="Sort by"
                        onChange={(e) => {
                            setSort(e.target.value);
                            handleSort(e.target.value);
                        }}
                    >
                        <MenuItem value="popularity.desc">Popularity</MenuItem>
                        <MenuItem value="release_date.desc">Release Date</MenuItem>
                        <MenuItem value="vote_average.desc">Rating</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    id="outlined-basic"
                    label="Поиск по названию"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={handleSearch}
                />
                <Button type="submit" variant="outlined">
                    Поиск
                </Button>
            </form>
            <Grid container spacing={2}>
                {movies.map((movie) => (
                    <Grid item lg={12 / 5} key={movie.id}>
                        <MovieCard movie={movie} />
                    </Grid>
                ))}
            </Grid>
            {totalPages > 1 && (
                <div style={{ display: "flex", margin: "20px auto" }}>
                    <Pagination
                        style={{ margin: "0 auto" }}
                        count={totalPages}
                        page={page}
                        onChange={(event, page) => {
                            setPage(page);
                            handlePageChange(page);
                        }}
                        variant="outlined"
                        shape="rounded"
                        color="secondary"
                    />
                </div>
            )}
        </div>
    );
}
