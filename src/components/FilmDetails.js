import './FilmDetails.css'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import Cast from "./Cast";
import Crew from "./Crew";
import ProductionDetails from "./ProductionDetails";
import TrailerButton from "./TrailerButton";

export default function FilmDetails() {
    const [film, setFilm] = useState();
    const [activeTab, setActiveTab] = useState('cast');

    const {filmId} = useParams();

    useEffect(() => {
        axios.get(process.env.REACT_APP_URL_BASE + `movie/${filmId}` + process.env.REACT_APP_API_KEY + '&append_to_response=credits,videos')
            .then(({ data }) => setFilm(data));
    }, [filmId]);

    function activateTab(e) {
        setActiveTab(e.target.id);
    }

    return (
        <>
            {film &&
                <div className="film">
                    {film.backdrop_path &&
                        <div className="film__img--wrapper">
                            <div className="film__img">
                                <img src={`https://image.tmdb.org/t/p/original${film.backdrop_path}`} alt=""/>
                                <div className="film__img-overlay"/>
                            </div>
                        </div>
                    }
                    <div className="film__details--wrapper">
                        <div className="film__details">
                            <div className="film__top--wrapper">
                                <div className="film__top container" style={film.backdrop_path ? null : {paddingTop: 'var(--page-padding)'}}>
                                    <div className="film__info">
                                        <h1 className="film__title hide-for-desktop">{film.title}</h1>
                                        <div className="film__year hide-for-desktop">{film.release_date.split('-')[0]} · Directed by </div>
                                        <div className="film__director hide-for-desktop">{film.credits.crew.find(c => c.job === 'Director')?.name}</div>
                                        <div className="film__rating">
                                            <span>{film.vote_average}</span>
                                            <div className="film__stars" style={{'--rating': film.vote_average}}/>
                                        </div>
                                        <div className="film__trailer-and-duration">
                                            <TrailerButton videos={film.videos.results}/>
                                            <span>{film.runtime} mins</span>
                                        </div>
                                    </div>
                                    <div className="film__poster">
                                        <img src={`https://image.tmdb.org/t/p/original${film.poster_path}`} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="film__bottom container">
                                <h1 className="film__title show-for-desktop">{film.title}</h1>
                                <div className="film__below-title show-for-desktop">
                                    <div className="film__year">{film.release_date.split('-')[0]} · Directed by </div>
                                    <div className="film__director">{film.credits.crew.find(c => c.job === 'Director')?.name}</div>
                                </div>
                                {film.tagline && <h2 className="film__tagline">{film.tagline}</h2>}
                                <p className="film__overview">
                                    {film.overview}
                                </p>
                                <div className="film__tabs">
                                    <button className="button button-secondary" id='cast' onClick={activateTab}>Cast</button>
                                    <button className="button button-secondary" id='crew' onClick={activateTab}>Crew</button>
                                    <button className="button button-secondary" id='details' onClick={activateTab}>Details</button>
                                    <button className="button button-secondary" id='genres' onClick={activateTab}>Genres</button>
                                </div>
                                <div className="film__tab-content">
                                    {activeTab === 'cast' && <Cast cast={film.credits.cast} />}
                                    {activeTab === 'crew' && <Crew crew={film.credits.crew} />}
                                    {activeTab === 'details' && <ProductionDetails film={film} />}
                                    {activeTab === 'genres' && film.genres.map(g => <span key={g.id}>{g.name}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}