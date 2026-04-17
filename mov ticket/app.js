// ========================================
// CineVerse — Movie Booking Application
// ========================================

const TMDB_IMG = 'https://image.tmdb.org/t/p';

// ===== STATE =====
let currentUser = null;
let allMovies = [];
let selectedMovie = null;
let selectedDate = null;
let selectedTheatre = null;
let selectedTime = null;
let selectedSeats = [];
let currentPaymentMethod = 'upi';
let seatLayout = [];
let paymentTimer = null; // Auto-payment simulation timer
let genreMap = { 28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 18: 'Drama', 14: 'Fantasy', 27: 'Horror', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller', 10752: 'War' };
let activeGenre = 'all';
let activeLang = 'all';
let selectedCity = 'Chennai';

// ===== EMBEDDED MOVIE DATA =====
const MOVIES_DB = [
    // SAMPLE MOVIE
    { id: 999, title: "CineVerse Experience (Sample)", poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg", vote_average: 10.0, release_date: "2024-01-01", genre_ids: [28, 12], overview: "A sample movie experience to test the booking flow and ticket generation. Price: ₹1.", runtime: 120, original_language: "en", genres: [{ id: 28, name: "TEST" }] },
    // ENGLISH
    { id: 1, title: "Inception", poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg", vote_average: 8.4, release_date: "2010-07-16", genre_ids: [28, 878, 53], overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", runtime: 148, original_language: "en", genres: [{ id: 28, name: "Action" }, { id: 878, name: "Sci-Fi" }, { id: 53, name: "Thriller" }] },
    { id: 2, title: "The Dark Knight", poster_path: "https://m.media-amazon.com/images/I/81IfoBox2TL.jpg", backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5ez.jpg", vote_average: 9.0, release_date: "2008-07-18", genre_ids: [28, 80, 18], overview: "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests.", runtime: 152, original_language: "en", genres: [{ id: 28, name: "Action" }, { id: 80, name: "Crime" }, { id: 18, name: "Drama" }] },
    { id: 3, title: "Interstellar", poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", backdrop_path: "/xJHokMbljvjADYdit5fK1DVfjko.jpg", vote_average: 8.7, release_date: "2014-11-07", genre_ids: [12, 18, 878], overview: "A team of explorers travel through a wormhole in space to ensure humanity's survival.", runtime: 169, original_language: "en", genres: [{ id: 12, name: "Adventure" }, { id: 18, name: "Drama" }, { id: 878, name: "Sci-Fi" }] },
    { id: 4, title: "Avengers: Endgame", poster_path: "https://m.media-amazon.com/images/I/81nig-I3TDL._AC_UF894,1000_QL80_.jpg", backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", vote_average: 8.3, release_date: "2019-04-26", genre_ids: [28, 12, 878], overview: "The Avengers assemble once more to reverse Thanos' actions and restore balance.", runtime: 181, original_language: "en", genres: [{ id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 878, name: "Sci-Fi" }] },
    { id: 5, title: "Spider-Man: No Way Home", poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", backdrop_path: "/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg", vote_average: 8.0, release_date: "2021-12-15", genre_ids: [28, 12, 878], overview: "Peter Parker is unmasked and can no longer separate his normal life from being a super-hero.", runtime: 148, original_language: "en", genres: [{ id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 878, name: "Sci-Fi" }] },
    { id: 6, title: "Oppenheimer", poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", backdrop_path: "/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg", vote_average: 8.1, release_date: "2023-07-21", genre_ids: [18, 53], overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during WWII.", runtime: 180, original_language: "en", genres: [{ id: 18, name: "Drama" }, { id: 53, name: "Thriller" }] },
    { id: 7, title: "Dune: Part Two", poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", vote_average: 8.2, release_date: "2024-02-28", genre_ids: [878, 12, 28], overview: "Paul Atreides unites with the Fremen to seek revenge on the desert planet Arrakis.", runtime: 166, original_language: "en", genres: [{ id: 878, name: "Sci-Fi" }, { id: 12, name: "Adventure" }, { id: 28, name: "Action" }] },
    { id: 8, title: "Joker", poster_path: "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", backdrop_path: "/gZWl93sf8AxavYGVSOxIFaB18bY.jpg", vote_average: 8.2, release_date: "2019-10-02", genre_ids: [80, 18, 53], overview: "A mentally troubled stand-up comedian embarks on a downward spiral creating an iconic villain.", runtime: 122, original_language: "en", genres: [{ id: 80, name: "Crime" }, { id: 18, name: "Drama" }, { id: 53, name: "Thriller" }] },
    { id: 9, title: "The Batman", poster_path: "/74xTEgt7R36Fpooo50r9T25onhq.jpg", backdrop_path: "/b0PlSFdDwbyFAJlMZbJsY7oTqR0.jpg", vote_average: 7.7, release_date: "2022-03-01", genre_ids: [80, 9648, 53], overview: "Batman investigates Gotham's hidden corruption when a serial killer targets political figures.", runtime: 176, original_language: "en", genres: [{ id: 80, name: "Crime" }, { id: 9648, name: "Mystery" }, { id: 53, name: "Thriller" }] },
    { id: 10, title: "Top Gun: Maverick", poster_path: "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg", backdrop_path: "/4k2hz2Kf66XqnZz4eOml5vfBFnA.jpg", vote_average: 8.3, release_date: "2022-05-24", genre_ids: [28, 18], overview: "Pete 'Maverick' Mitchell trains a group of Top Gun graduates for a specialized mission.", runtime: 130, original_language: "en", genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }] },
    { id: 11, title: "John Wick: Chapter 4", poster_path: "/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg", backdrop_path: "/7I6VUdPj6tQECNHdviJkUHD2u89.jpg", vote_average: 7.7, release_date: "2023-03-22", genre_ids: [28, 53, 80], overview: "John Wick uncovers a path to defeating The High Table before earning his freedom.", runtime: 169, original_language: "en", genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }, { id: 80, name: "Crime" }] },
    { id: 12, title: "The Matrix", poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg", vote_average: 8.2, release_date: "1999-03-31", genre_ids: [28, 878], overview: "A hacker discovers reality is a simulation and joins a rebellion to break free.", runtime: 136, original_language: "en", genres: [{ id: 28, name: "Action" }, { id: 878, name: "Sci-Fi" }] },
    // TAMIL
    { id: 21, title: "Vikram", poster_path: "https://m.media-amazon.com/images/M/MV5BNDEyMWQ0ZDktNTY0MC00YWRkLWFlMjQtMDUxMjRlMDhmMmRlXkEyXkFqcGc@._V1_.jpg", backdrop_path: "/cvkmGq3bwwsGLE4VUfMzF6ySIxj.jpg", vote_average: 7.8, release_date: "2022-06-03", genre_ids: [28, 53, 80], overview: "A special investigator probes brutal killings and encounters a shadowy network of drugs and power.", runtime: 174, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }, { id: 80, name: "Crime" }] },
    { id: 22, title: "Ponniyin Selvan: I", poster_path: "https://upload.wikimedia.org/wikipedia/en/c/c3/Ponniyin_Selvan_I.jpg", backdrop_path: "/8sMmAmN2x0cTOHVj4RPhLFaIJOl.jpg", vote_average: 7.1, release_date: "2022-09-30", genre_ids: [28, 18, 12], overview: "An epic tale of the Chola dynasty with treachery and political intrigue in ancient Tamil Nadu.", runtime: 167, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }, { id: 12, name: "Adventure" }] },
    { id: 23, title: "Jailer", poster_path: "https://upload.wikimedia.org/wikipedia/en/c/cb/Jailer_2023_Tamil_film_poster.jpg", backdrop_path: "/2k9tBql5GYH328Krj0pMcf9sNMO.jpg", vote_average: 7.2, release_date: "2023-08-10", genre_ids: [28, 53], overview: "A retired jailer goes on a manhunt to find his son's killers using his dangerous past connections.", runtime: 168, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }] },
    { id: 24, title: "Leo", poster_path: "https://i.pinimg.com/736x/f9/99/82/f9998221ea08de95c962252700da2f5a.jpg", backdrop_path: "/6oaL4DP75yABjQXbRKpS3Pc06hD.jpg", vote_average: 6.5, release_date: "2023-10-19", genre_ids: [28, 53, 80], overview: "A cafe owner in Kashmir is pushed to reveal his dark violent past by ruthless drug lords.", runtime: 164, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }, { id: 80, name: "Crime" }] },
    { id: 25, title: "Master", poster_path: "https://i.pinimg.com/736x/64/04/14/640414e45f2bf2dc913f94ac50826241.jpg", backdrop_path: "/6sMnS7GBOA3pI3tAbsOFVmjLJJd.jpg", vote_average: 6.8, release_date: "2021-01-13", genre_ids: [28, 53, 18], overview: "An alcoholic professor clashes with a ruthless gangster at a juvenile facility.", runtime: 179, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }, { id: 18, name: "Drama" }] },
    { id: 26, title: "Beast", poster_path: "https://m.media-amazon.com/images/I/71sb0rlLMsS._AC_UF894,1000_QL80_.jpg", backdrop_path: "/zDB4TcdA3Yk9zVpSmXAFnws0Cvi.jpg", vote_average: 5.5, release_date: "2022-04-13", genre_ids: [28, 53], overview: "A spy on vacation fights terrorists who seize a mall and hold shoppers hostage.", runtime: 146, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }] },
    { id: 27, title: "Kaithi", poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt_zAyH0xRVUJx3WBYsdaGJGFIqrY2pwlT3Q&s", backdrop_path: "/b2s2PYZK9tXTUbGfi5bQFvWBU6P.jpg", vote_average: 7.8, release_date: "2019-10-25", genre_ids: [28, 53], overview: "An ex-convict tries to meet his daughter for the first time but gets caught in a drug bust.", runtime: 145, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }] },
    { id: 28, title: "Soorarai Pottru", poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHu3-0n4C8hBqi01WvzYJSFCNwc28hW2dg0NDxXTyueA&s", backdrop_path: "/4K8XfcRTdPUVrHOhfkdP1DZlrKr.jpg", vote_average: 8.2, release_date: "2020-11-12", genre_ids: [18, 28], overview: "The inspiring story of a man from a humble background who dreams of starting an affordable airline.", runtime: 153, original_language: "ta", genres: [{ id: 18, name: "Drama" }, { id: 28, name: "Action" }] },
    { id: 29, title: "Jai Bhim", poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1YhxBQTUby4e-i4JdMKgibhgYbUwUTi82ng&s", backdrop_path: "/yLzXpuFOLiuRDFkm5OVGU5HbRyd.jpg", vote_average: 8.7, release_date: "2021-11-02", genre_ids: [18, 80], overview: "A lawyer fights for justice when a tribal man is arrested and goes missing from police custody.", runtime: 164, original_language: "ta", genres: [{ id: 18, name: "Drama" }, { id: 80, name: "Crime" }] },
    { id: 30, title: "Asuran", poster_path: "https://m.media-amazon.com/images/M/MV5BYjgyMGFlNmMtYzkzNy00ZjgyLTljNTItMTg4MmNjYWE5NDM4XkEyXkFqcGc@._V1_.jpg", backdrop_path: "/vRiTPdwCUxO8uOaNzXqmOMuQzJL.jpg", vote_average: 7.9, release_date: "2019-10-04", genre_ids: [28, 18], overview: "A father on the run with his son after a deadly caste conflict erupts in their village.", runtime: 141, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }] },
    { id: 31, title: "Vettaiyan", poster_path: "https://m.media-amazon.com/images/M/MV5BMjExZDc1MzUtNDc3Mi00NDcxLWFmYTAtYzI2MzhlMmE3YzBiXkEyXkFqcGc@._V1_.jpg", backdrop_path: "/plKBW7YBfnGRjMaUiSCqcp3MxBd.jpg", vote_average: 5.8, release_date: "2024-10-10", genre_ids: [28, 18, 53], overview: "An honest police officer battles a corrupt system to bring justice to the people.", runtime: 150, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }, { id: 53, name: "Thriller" }] },
    { id: 32, title: "GOAT", poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9_0xJlroqrIUMyzh1B0Nnwi8OWFQbHlO_VA&s", backdrop_path: "/58LpA78R4VnWjbD1xaUXWNYh2mv.jpg", vote_average: 5.7, release_date: "2024-09-05", genre_ids: [28, 878, 53], overview: "A special anti-terrorism squad leader faces a global threat using every skill from his career.", runtime: 165, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 878, name: "Sci-Fi" }, { id: 53, name: "Thriller" }] },
    { id: 33, title: "Karnan", poster_path: "https://m.media-amazon.com/images/M/MV5BNmU4MGU5NzYtNTAyMi00ZDI1LThlNzAtMDM1N2YxN2U0MDI0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", backdrop_path: "/sOoJBR5LtPBnWxlajbEDT3UQMOB.jpg", vote_average: 7.6, release_date: "2021-04-09", genre_ids: [28, 18], overview: "A brave young man fights against oppression for water and basic rights for his village.", runtime: 163, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }] },
    { id: 34, title: "Theri", poster_path: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQGvWkK710qgAMFX2QMlcfm3buMaWgt-q4UCEyncRdRJ7nclt1B", backdrop_path: "/xkE3CNsxVMRZnQdj37TiGHbMSMW.jpg", vote_average: 6.9, release_date: "2016-04-14", genre_ids: [28, 18], overview: "A police officer living in hiding must protect his daughter while confronting his past.", runtime: 162, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }] },
    { id: 35, title: "Mankatha", poster_path: "https://m.media-amazon.com/images/M/MV5BMjA4NTAwMTY0Nl5BMl5BanBnXkFtZTcwMjU5NDE3Ng@@._V1_.jpg", backdrop_path: "/2U9z1PCRvCxGKL66sqU7VxW5wLj.jpg", vote_average: 7.1, release_date: "2011-08-31", genre_ids: [28, 53, 80], overview: "A suspended cop joins a gang of gamblers to steal crores from a cricket betting racket.", runtime: 158, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }, { id: 80, name: "Crime" }] },
    { id: 36, title: "Ponniyin Selvan: II", poster_path: "https://m.media-amazon.com/images/M/MV5BNmU1MTkxOTktYmM2MC00YTdjLTgzOWMtYTA1OWZlZDdmNjE0XkEyXkFqcGc@._V1_.jpg", backdrop_path: "/2MKpk9V0q4r5cLOcpAUvVHwcUvw.jpg", vote_average: 7.0, release_date: "2023-04-28", genre_ids: [28, 18, 12], overview: "The Chola dynasty saga continues as Arulmozhivarman faces betrayal on his path to the throne.", runtime: 163, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }, { id: 12, name: "Adventure" }] },
    { id: 37, title: "Enthiran", poster_path: "https://m.media-amazon.com/images/M/MV5BYmUyN2U3MDUtMDgzYy00MDkxLTlhOWMtMGY1M2E0YjgxMjNhXkEyXkFqcGceV1_FMjpg_UX1000_.jpg", backdrop_path: "/k4T8S4bI8a7i8SNaK8IK3lu91Cw.jpg", vote_average: 7.0, release_date: "2010-10-01", genre_ids: [878, 28], overview: "A scientist creates a humanoid robot that develops emotions and falls in love, leading to chaos.", runtime: 155, original_language: "ta", genres: [{ id: 878, name: "Sci-Fi" }, { id: 28, name: "Action" }] },
    { id: 38, title: "Captain Miller", poster_path: "https://m.media-amazon.com/images/M/MV5BZDU1NmE5N2QtYzI3OC00N2VlLWI4Y2UtZDY0ZDY3ZDU4ZWU5XkEyXkFqcGceV1_FMjpg_UX1000_.jpg", backdrop_path: "/11h3k1ZkXwUfC1yG6LwE0y7q3d.jpg", vote_average: 6.9, release_date: "2024-01-12", genre_ids: [28, 12, 18], overview: "A former British Army soldier tries to save his home village from destruction by the British Army.", runtime: 157, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 18, name: "Drama" }] },
    { id: 39, title: "Ayalaan", poster_path: "https://m.media-amazon.com/images/M/MV5BNjRmMzEyNGUtM2QxYS00YzA4LWExMzctMDRmNGE0NzhkYWNjXkEyXkFqcGceV1_FMjpg_UX1000_.jpg", backdrop_path: "/11h3k1ZkXwUfC1yG6LwE0y7q3d.jpg", vote_average: 6.4, release_date: "2024-01-12", genre_ids: [878, 28, 12], overview: "A lost alien seeks help to return to his home planet, but everything gets harder when the alien returns to the wrong home.", runtime: 155, original_language: "ta", genres: [{ id: 878, name: "Sci-Fi" }, { id: 28, name: "Action" }, { id: 12, name: "Adventure" }] },
    { id: 40, title: "Maanaadu", poster_path: "https://m.media-amazon.com/images/M/MV5BNGU5MDNhODItYTllMS00NGM2LWE5YWEtZmI0N2UzMDY2ZTE2XkEyXkFqcGceV1_FMjpg_UX1000_.jpg", backdrop_path: "/11h3k1ZkXwUfC1yG6LwE0y7q3d.jpg", vote_average: 8.2, release_date: "2021-11-25", genre_ids: [878, 28, 53], overview: "On the day of a public conference by the state's Chief Minister, his bodyguard and a police officer are stuck in a time loop.", runtime: 147, original_language: "ta", genres: [{ id: 878, name: "Sci-Fi" }, { id: 28, name: "Action" }, { id: 53, name: "Thriller" }] },
    { id: 49, title: "Thuppakki", poster_path: "https://m.media-amazon.com/images/M/MV5BNDNlNmRiZTMtOGZkMi00NTBjLWFlNzAtMDhiNmY3ZGFkNjcxXkEyXkFqcGceV1_FMjpg_UX1000_.jpg", backdrop_path: "/11h3k1ZkXwUfC1yG6LwE0y7q3d.jpg", vote_average: 7.8, release_date: "2012-11-13", genre_ids: [28, 53], overview: "An army captain visits Mumbai to be with his family and find a suitable bride. However, an explosion in the city sets him on a mission to find and disable a terrorist sleeper cell.", runtime: 165, original_language: "ta", genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }] },
    { id: 50, title: "96", poster_path: "https://m.media-amazon.com/images/M/MV5BZmEwMDY3ZjEtZTFmMS00N2EzLTg4YzAtZGY0YTUzN2Y0MGE2XkEyXkFqcGceV1_FMjpg_UX1000_.jpg", backdrop_path: "/11h3k1ZkXwUfC1yG6LwE0y7q3d.jpg", vote_average: 8.5, release_date: "2018-10-04", genre_ids: [10749, 18], overview: "Two high school sweethearts meet at a reunion after 22 years and reminisce about their past.", runtime: 158, original_language: "ta", genres: [{ id: 10749, name: "Romance" }, { id: 18, name: "Drama" }] },
    // HINDI
    { id: 41, title: "Dangal", poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-KwhyDK1T-7gRtKlztpSPZXiSeQH6H6uRtQ&s", backdrop_path: "/p4bUF2h6PifVfpmA8bU0PnEBVyK.jpg", vote_average: 8.3, release_date: "2016-12-23", genre_ids: [28, 18], overview: "A former wrestler trains his daughters to become world-class wrestlers against all odds.", runtime: 161, original_language: "hi", genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }] },
    { id: 42, title: "3 Idiots", poster_path: "/66A9MqXOyVFCssoloscw79z8Tew.jpg", backdrop_path: "/oFkV1GAoWOj24GEOdflrqrDDjNL.jpg", vote_average: 8.2, release_date: "2009-12-25", genre_ids: [35, 18], overview: "Two friends search for their long-lost buddy while reminiscing about their college days.", runtime: 170, original_language: "hi", genres: [{ id: 35, name: "Comedy" }, { id: 18, name: "Drama" }] },
    { id: 43, title: "Pathaan", poster_path: "https://w0.peakpx.com/wallpaper/407/193/HD-wallpaper-pathan-movie-angry-look-movie-poster-actor-shahrukh-khan.jpg", backdrop_path: "/nmSkFkH6mO6MUH3n3nDEYVqW3jk.jpg", vote_average: 6.6, release_date: "2023-01-25", genre_ids: [28, 53], overview: "An Indian spy takes on a deadly threat from a private terror group led by a ruthless mercenary.", runtime: 146, original_language: "hi", genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }] },
    { id: 44, title: "Jawan", poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTns-0tpag1wDjtDXdN9NJKXaj09u1wiMp83Q&s", backdrop_path: "/vlJTM3my3F2MU7AZzMcwvqXTqPj.jpg", vote_average: 6.8, release_date: "2023-09-07", genre_ids: [28, 53, 18], overview: "A vigilante takes matters into his own hands to fight corruption and injustice.", runtime: 169, original_language: "hi", genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }, { id: 18, name: "Drama" }] },
    { id: 45, title: "Animal", poster_path: "https://m.media-amazon.com/images/I/81l2CtJcBoL.jpg", backdrop_path: "/kwJhaMiUxASTjNjAjMv8uoRPWGA.jpg", vote_average: 6.5, release_date: "2023-12-01", genre_ids: [28, 80, 18], overview: "A son's love for his father becomes toxic as he goes to violent extremes to protect his family.", runtime: 201, original_language: "hi", genres: [{ id: 28, name: "Action" }, { id: 80, name: "Crime" }, { id: 18, name: "Drama" }] },
    { id: 46, title: "RRR", poster_path: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg", backdrop_path: "/5GhFMqVWMZiX0Qsp4AgMMprMfAZ.jpg", vote_average: 7.8, release_date: "2022-03-25", genre_ids: [28, 18, 12], overview: "A warrior and a freedom fighter join forces against British colonial rule in pre-independence India.", runtime: 187, original_language: "hi", genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }, { id: 12, name: "Adventure" }] },
    { id: 47, title: "KGF: Chapter 2", poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5rceC0nzQJe3cW4tCpLIcHTMhvQPtUZ0UBA&s", backdrop_path: "/x7r3Wy6gFjYs0VIBVLbEPFKnxFz.jpg", vote_average: 7.4, release_date: "2022-04-14", genre_ids: [28, 18, 53], overview: "Rocky must battle threats from all sides to maintain his dominion over Kolar Gold Fields.", runtime: 168, original_language: "hi", genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }, { id: 53, name: "Thriller" }] },
    { id: 48, title: "Stree 2", poster_path: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/Stree_2.jpg/250px-Stree_2.jpg", backdrop_path: "/6AwNEdVDH8LHGmGsP34VGYDm8FX.jpg", vote_average: 6.8, release_date: "2024-08-15", genre_ids: [35, 27], overview: "The town of Chanderi faces a new supernatural threat as the legend of Stree returns.", runtime: 150, original_language: "hi", genres: [{ id: 35, name: "Comedy" }, { id: 27, name: "Horror" }] }
];

// ===== THEATRES DATA (Real Indian Theatre Chains) =====
const CITIES = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Kolkata', 'Coimbatore', 'Madurai'];

const THEATRES_DB = [
    // Chennai
    { id: 1, name: 'SPI Sathyam Cinemas', address: 'Royapettah, Chennai', city: 'Chennai', screens: ['Screen 1 - Dolby Atmos', 'Screen 2 - IMAX', 'Screen 3', 'Screen 4', 'Screen 5'] },
    { id: 2, name: 'AGS Cinemas - T. Nagar', address: 'T. Nagar, Chennai', city: 'Chennai', screens: ['Gold Class', 'Screen 2', 'Screen 3', 'Screen 4'] },
    { id: 3, name: 'Rohini Silver Screens', address: 'Koyambedu, Chennai', city: 'Chennai', screens: ['Silver Screen', 'Screen 2', 'Screen 3'] },
    { id: 4, name: 'PVR - Grand Mall', address: 'Velachery, Chennai', city: 'Chennai', screens: ['Screen 1 - 4DX', 'Screen 2', 'Screen 3', 'Screen 4'] },
    { id: 5, name: 'INOX - Chennai Citi Centre', address: 'Mylapore, Chennai', city: 'Chennai', screens: ['Screen 1', 'Screen 2', 'Screen 3'] },
    { id: 6, name: 'Kamala Cinemas', address: 'Vadapalani, Chennai', city: 'Chennai', screens: ['Main Screen', 'Balcony'] },
    { id: 7, name: 'Palazzo by Luxe', address: 'Montieth Road, Chennai', city: 'Chennai', screens: ['Luxe Screen 1', 'Luxe Screen 2'] },
    // Mumbai
    { id: 8, name: 'PVR INOX - Phoenix Palladium', address: 'Lower Parel, Mumbai', city: 'Mumbai', screens: ['Screen 1 - IMAX', 'Screen 2 - Dolby', 'Screen 3', 'Screen 4'] },
    { id: 9, name: 'PVR INOX - Infinity Mall', address: 'Andheri West, Mumbai', city: 'Mumbai', screens: ['Screen 1', 'Screen 2', 'Screen 3'] },
    { id: 10, name: 'Cinépolis - Fun Republic', address: 'Andheri, Mumbai', city: 'Mumbai', screens: ['Screen 1 - Junior', 'Screen 2 - 4DX', 'Screen 3'] },
    { id: 11, name: 'Regal Cinema', address: 'Colaba, Mumbai', city: 'Mumbai', screens: ['Main Hall'] },
    // Delhi
    { id: 12, name: 'PVR Director\'s Cut', address: 'Ambience Mall, Vasant Kunj, Delhi', city: 'Delhi', screens: ['Screening Room 1', 'Screening Room 2'] },
    { id: 13, name: 'PVR INOX - Select CityWalk', address: 'Saket, Delhi', city: 'Delhi', screens: ['Screen 1 - IMAX', 'Screen 2', 'Screen 3', 'Screen 4'] },
    { id: 14, name: 'Cinépolis - DLF Place', address: 'Saket, Delhi', city: 'Delhi', screens: ['Screen 1', 'Screen 2', 'Screen 3'] },
    // Bangalore
    { id: 15, name: 'PVR INOX - Forum Mall', address: 'Koramangala, Bangalore', city: 'Bangalore', screens: ['Screen 1 - Dolby Atmos', 'Screen 2', 'Screen 3'] },
    { id: 16, name: 'Cinépolis - Royal Meenakshi', address: 'Bannerghatta Road, Bangalore', city: 'Bangalore', screens: ['Screen 1 - 4DX', 'Screen 2', 'Screen 3'] },
    // Hyderabad
    { id: 17, name: 'AMB Cinemas', address: 'Gachibowli, Hyderabad', city: 'Hyderabad', screens: ['Screen 1 - Dolby Atmos', 'Screen 2 - IMAX', 'Screen 3'] },
    { id: 18, name: 'PVR INOX - Nexus Mall', address: 'Kukatpally, Hyderabad', city: 'Hyderabad', screens: ['Screen 1', 'Screen 2', 'Screen 3', 'Screen 4'] },
    // Coimbatore
    { id: 19, name: 'KG Cinemas', address: 'Gandhipuram, Coimbatore', city: 'Coimbatore', screens: ['Screen 1 - 4K Dolby', 'Screen 2', 'Screen 3'] },
    { id: 20, name: 'Fun Republic - Brookefields', address: 'Brookefields Mall, Coimbatore', city: 'Coimbatore', screens: ['Screen 1', 'Screen 2'] },
    // Madurai
    { id: 21, name: 'Escape Cinemas', address: 'Fun Mall, Madurai', city: 'Madurai', screens: ['Screen 1', 'Screen 2'] },
    // Kolkata
    { id: 22, name: 'INOX - Quest Mall', address: 'Park Circus, Kolkata', city: 'Kolkata', screens: ['Screen 1 - IMAX', 'Screen 2', 'Screen 3'] }
];

const showTimes = ['10:00 AM', '12:30 PM', '03:15 PM', '06:00 PM', '09:00 PM', '11:30 PM'];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// ===== AUTHENTICATION =====
function checkAuth() {
    const user = localStorage.getItem('cineverse_user');
    if (user) {
        currentUser = JSON.parse(user);
        showApp();
    } else {
        showPage('auth');
        document.getElementById('navbar').style.display = 'none';
        document.getElementById('appFooter').style.display = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('cineverse_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('cineverse_user', JSON.stringify(user));
        showToast('Welcome back, ' + user.name + '!', 'success');
        showApp();
    } else {
        showToast('Invalid email or password', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;

    if (password !== confirm) {
        showToast('Passwords do not match', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('cineverse_users') || '[]');

    if (users.find(u => u.email === email)) {
        showToast('Email already registered', 'error');
        return;
    }

    const user = { id: Date.now(), name, email, phone, password };
    users.push(user);
    localStorage.setItem('cineverse_users', JSON.stringify(users));

    currentUser = user;
    localStorage.setItem('cineverse_user', JSON.stringify(user));
    showToast('Account created! Welcome, ' + name + '!', 'success');
    showApp();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('cineverse_user');
    // Clear admin status as well on general logout
    localStorage.removeItem('cineverse_admin');
    document.getElementById('navbar').style.display = 'none';
    document.getElementById('appFooter').style.display = 'none';
    showPage('auth');
    showToast('Logged out successfully', 'info');
    closeUserDropdown();
}

// ===== ADMIN AUTHENTICATION =====
function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('adminUsername').value;
    const pass = document.getElementById('adminPassword').value;

    if (user === 'admin' && pass === 'admin@123') {
        localStorage.setItem('cineverse_admin', 'true');
        showToast('Admin access granted', 'success');
        showPage('admin');
    } else {
        showToast('Invalid admin credentials', 'error');
    }
}

function adminLogout() {
    localStorage.removeItem('cineverse_admin');
    showToast('Admin logged out', 'info');
    navigate('home');
}

function switchAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    tabs[0].classList.toggle('active', tab === 'login');
    tabs[1].classList.toggle('active', tab === 'signup');
    document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('signupForm').style.display = tab === 'signup' ? 'block' : 'none';
}

function showApp() {
    document.getElementById('navbar').style.display = 'block';
    document.getElementById('appFooter').style.display = 'block';
    document.getElementById('userMenu').style.display = 'flex';
    document.getElementById('userDisplayName').textContent = currentUser.name.split(' ')[0];
    navigate('home');
}

// ===== NAVIGATION =====
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const page = document.getElementById('page-' + pageId);
    if (page) page.style.display = 'block';

    // Clear any payment timer when navigating
    if (paymentTimer) {
        clearTimeout(paymentTimer);
        paymentTimer = null;
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.dataset.page === pageId);
    });

    if (pageId === 'admin') {
        if (!localStorage.getItem('cineverse_admin')) {
            showPage('admin-login');
            return;
        }
        loadAdminPage();
    }

    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigate(page) {
    if (!currentUser && page !== 'auth') {
        showPage('auth');
        showToast('Please login first', 'info');
        return;
    }

    switch (page) {
        case 'home':
            showPage('home');
            loadHomePage();
            break;
        case 'movies':
            showPage('movies');
            loadMoviesPage();
            break;
        case 'my-bookings':
            showPage('my-bookings');
            loadBookings();
            break;
        case 'admin':
            if (localStorage.getItem('cineverse_admin')) {
                showPage('admin');
            } else {
                showPage('admin-login');
            }
            break;
        default:
            showPage(page);
    }
}

// ===== ADMIN & CRUD =====
let activeAdminTab = 'movies';

function switchAdminTab(tab) {
    activeAdminTab = tab;
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(tab));
    });
    document.querySelectorAll('.admin-content').forEach(c => c.style.display = 'none');
    document.getElementById(`admin-${tab}`).style.display = 'block';

    if (tab === 'movies') renderAdminMovies();
    else renderAdminBookings();
}

function loadAdminPage() {
    switchAdminTab('movies');
}

function getMovies() {
    const customMovies = JSON.parse(localStorage.getItem('cineverse_custom_movies') || '[]');
    return [...MOVIES_DB, ...customMovies];
}

function renderAdminMovies() {
    const movies = getMovies();
    const list = document.getElementById('adminMoviesList');

    list.innerHTML = movies.map(movie => `
        <tr>
            <td><img src="${imgUrl(movie.poster_path)}" class="admin-table-poster"></td>
            <td><strong>${movie.title}</strong></td>
            <td>${movie.original_language.toUpperCase()}</td>
            <td><i class="fas fa-star" style="color:var(--gold)"></i> ${movie.vote_average.toFixed(1)}</td>
            <td>
                <button class="admin-btn-icon admin-btn-edit" onclick="editMoviePrompt(${movie.id})"><i class="fas fa-edit"></i></button>
                <button class="admin-btn-icon admin-btn-delete" onclick="deleteMovie(${movie.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderAdminBookings() {
    const allBookings = JSON.parse(localStorage.getItem('cineverse_all_bookings') || '[]');
    const list = document.getElementById('adminBookingsList');

    if (allBookings.length === 0) {
        list.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--text-muted);">No bookings found in history.</td></tr>';
        return;
    }

    list.innerHTML = allBookings.reverse().map(b => `
        <tr>
            <td><small>${b.id}</small></td>
            <td>${b.userName || 'Guest'}<br><small>${b.userEmail || ''}</small></td>
            <td><strong>${b.movieTitle}</strong></td>
            <td>${formatDisplayDate(b.date)} • ${b.time}<br><small>${b.theatre} • ${b.seats.join(',')}</small></td>
            <td><span class="booking-badge">₹${b.totalAmount}</span></td>
        </tr>
    `).join('');
}

// CRUD Actions
function deleteMovie(id) {
    if (MOVIES_DB.find(m => m.id === id)) {
        showToast("Cannot delete base movie database items", "error");
        return;
    }

    if (confirm("Are you sure you want to delete this movie?")) {
        let customMovies = JSON.parse(localStorage.getItem('cineverse_custom_movies') || '[]');
        customMovies = customMovies.filter(m => m.id !== id);
        localStorage.setItem('cineverse_custom_movies', JSON.stringify(customMovies));
        showToast("Movie deleted", "success");
        renderAdminMovies();
    }
}

function openAddMovieForm() {
    document.getElementById('movieModalTitle').textContent = 'Add New Movie';
    document.getElementById('editMovieId').value = '';
    document.getElementById('movieForm').reset();
    document.getElementById('movieModal').style.display = 'flex';
}

function editMoviePrompt(id) {
    const customMovies = JSON.parse(localStorage.getItem('cineverse_custom_movies') || '[]');
    const movie = customMovies.find(m => m.id === id);

    if (!movie) {
        showToast("Base movies cannot be edited", "error");
        return;
    }

    document.getElementById('movieModalTitle').textContent = 'Edit Movie';
    document.getElementById('editMovieId').value = id;
    document.getElementById('movieFormTitle').value = movie.title;
    document.getElementById('movieFormLang').value = movie.original_language;
    document.getElementById('movieFormRating').value = movie.vote_average;
    document.getElementById('movieFormPoster').value = movie.poster_path;
    document.getElementById('movieFormBackdrop').value = movie.backdrop_path;
    document.getElementById('movieFormOverview').value = movie.overview;

    document.getElementById('movieModal').style.display = 'flex';
}

function closeMovieModal() {
    document.getElementById('movieModal').style.display = 'none';
}

function saveMovie() {
    const id = document.getElementById('editMovieId').value;
    const title = document.getElementById('movieFormTitle').value;
    const lang = document.getElementById('movieFormLang').value;
    const rating = parseFloat(document.getElementById('movieFormRating').value || '0');
    const poster = document.getElementById('movieFormPoster').value;
    const backdrop = document.getElementById('movieFormBackdrop').value;
    const overview = document.getElementById('movieFormOverview').value;

    if (!title) {
        showToast("Title is required", "error");
        return;
    }

    let customMovies = JSON.parse(localStorage.getItem('cineverse_custom_movies') || '[]');

    if (id) {
        // Edit
        const index = customMovies.findIndex(m => m.id == id);
        if (index !== -1) {
            customMovies[index] = {
                ...customMovies[index],
                title,
                original_language: lang,
                vote_average: rating,
                poster_path: poster,
                backdrop_path: backdrop,
                overview
            };
        }
    } else {
        // Add
        const newMovie = {
            id: Date.now(),
            title,
            original_language: lang,
            vote_average: rating,
            poster_path: poster,
            backdrop_path: backdrop,
            overview,
            release_date: new Date().toISOString().split('T')[0],
            genre_ids: [28]
        };
        customMovies.unshift(newMovie);
    }

    localStorage.setItem('cineverse_custom_movies', JSON.stringify(customMovies));
    showToast(id ? "Movie updated" : "Movie added", "success");
    closeMovieModal();
    renderAdminMovies();
}

// Helper to wrap allMovies update
function updateAllMovies() {
    allMovies = getMovies();
}

// Modifying existing home/movies logic to use getMovies()
const originalLoadHomePage = loadHomePage;
loadHomePage = function () {
    updateAllMovies();
    originalLoadHomePage();
};

const originalLoadMoviesPage = loadMoviesPage;
loadMoviesPage = function () {
    updateAllMovies();
    originalLoadMoviesPage();
};

// Global Booking Tracking
function saveToGlobalHistory(booking) {
    const allBookings = JSON.parse(localStorage.getItem('cineverse_all_bookings') || '[]');
    const bookingWithUser = {
        ...booking,
        userName: currentUser.name,
        userEmail: currentUser.email
    };
    allBookings.push(bookingWithUser);
    localStorage.setItem('cineverse_all_bookings', JSON.stringify(allBookings));
}

// Update booking confirmation logic
confirmBooking = function () {
    processPayment();
};

// Initialize allMovies with data from localStorage merge on start
allMovies = getMovies();


// ===== IMAGE URL HELPER =====
function imgUrl(path, size = 'w500') {
    if (!path) return 'https://placehold.co/500x750/1a1a3e/666?text=No+Image';
    // Allow absolute URLs
    if (path.startsWith('http') || path.startsWith('https')) return path;
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${TMDB_IMG}/${size}/${cleanPath}`;
}

// ===== GLOBAL STATE =====
let currentHeroIndex = 0;
let heroMovies = [];
let heroTimer = null;

// ===== HOME PAGE =====
function loadHomePage() {
    allMovies = [...MOVIES_DB];

    // Initialize Hero Carousel
    initHeroCarousel();

    // Tamil Movies Section
    const tamilMovies = allMovies.filter(m => m.original_language === 'ta');
    renderMovieGrid('nowShowingGrid', tamilMovies.slice(0, 12));

    // Hollywood Hits
    const englishMovies = allMovies.filter(m => m.original_language === 'en');
    const englishSection = document.querySelector('#upcomingScroll').previousElementSibling;
    if (englishSection) englishSection.querySelector('h2').innerHTML = '<i class="fas fa-globe"></i> Hollywood Hits';
    renderMovieScroll('upcomingScroll', englishMovies);

    // Bollywood Blockbusters
    const hindiMovies = allMovies.filter(m => m.original_language === 'hi');
    const hindiSection = document.querySelector('#topRatedScroll').previousElementSibling;
    if (hindiSection) hindiSection.querySelector('h2').innerHTML = '<i class="fas fa-film"></i> Bollywood Blockbusters';
    renderMovieScroll('topRatedScroll', hindiMovies);
}

function initHeroCarousel() {
    // Select 5 random movies for the carousel
    heroMovies = [...allMovies]
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);

    const slidesContainer = document.getElementById('heroSlides');
    const dotsContainer = document.getElementById('heroDots');

    if (!slidesContainer || !dotsContainer) return;

    // Clear existing
    slidesContainer.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Inject Slides and Dots
    heroMovies.forEach((movie, index) => {
        // Slide
        const slide = document.createElement('div');
        slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `url(${imgUrl(movie.backdrop_path, 'original')})`;
        slide.innerHTML = `
            <div class="hero-overlay"></div>
            <div class="hero-container">
                <div class="hero-poster-container">
                    <img src="${imgUrl(movie.poster_path)}" class="hero-poster" alt="${movie.title}">
                </div>
                <div class="hero-content">
                    <div class="hero-badge">🔥 Featured Movie</div>
                    <h1>${movie.title}</h1>
                    <p>${movie.overview}</p>
                    <div class="hero-meta">
                        <span><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)} Rating</span>
                        <span><i class="fas fa-calendar"></i> ${formatDisplayDate(movie.release_date)}</span>
                    </div>
                    <button class="btn btn-primary btn-glow" onclick="openMovieDetail(${movie.id})">
                        <i class="fas fa-ticket-alt"></i> Book Tickets
                    </button>
                </div>
            </div>
        `;
        slidesContainer.appendChild(slide);

        // Dot
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToHeroSlide(index);
        dotsContainer.appendChild(dot);
    });

    currentHeroIndex = 0;
    startHeroTimer();
}

function startHeroTimer() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(() => {
        moveHero(1);
    }, 5000);
}

function goToHeroSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');

    if (slides.length === 0) return;

    // Remove active
    slides[currentHeroIndex].classList.remove('active');
    dots[currentHeroIndex].classList.remove('active');

    // Wrap index
    currentHeroIndex = (index + heroMovies.length) % heroMovies.length;

    // Add active
    slides[currentHeroIndex].classList.add('active');
    dots[currentHeroIndex].classList.add('active');

    startHeroTimer(); // Reset timer on manual navigation
}

function moveHero(step) {
    goToHeroSlide(currentHeroIndex + step);
}

// ===== MOVIES PAGE =====
function loadMoviesPage() {
    if (allMovies.length === 0) allMovies = [...MOVIES_DB];
    renderFilters();
    renderMovieGrid('allMoviesGrid', allMovies);
}

function renderFilters() {
    const container = document.getElementById('genreFilters');

    // Language Filter
    let html = `<div class="filter-group" style="margin-bottom:15px; display:flex; gap:10px; overflow-x:auto; padding-bottom:5px;">
        <span class="genre-tag ${activeLang === 'all' ? 'active' : ''}" onclick="filterByLang('all')">All Languages</span>
        <span class="genre-tag ${activeLang === 'ta' ? 'active' : ''}" onclick="filterByLang('ta')">Tamil</span>
        <span class="genre-tag ${activeLang === 'en' ? 'active' : ''}" onclick="filterByLang('en')">English</span>
        <span class="genre-tag ${activeLang === 'hi' ? 'active' : ''}" onclick="filterByLang('hi')">Hindi</span>
    </div>`;

    // Genre Filter
    const genres = new Set();
    allMovies.forEach(m => m.genre_ids.forEach(id => genres.add(id)));

    html += '<div class="filter-group" style="display:flex; gap:10px; overflow-x:auto;">';
    html += `<span class="genre-tag ${activeGenre === 'all' ? 'active' : ''}" onclick="filterByGenre('all')">All Genres</span>`;
    genres.forEach(id => {
        if (genreMap[id]) {
            html += `<span class="genre-tag ${activeGenre === id ? 'active' : ''}" onclick="filterByGenre(${id})">${genreMap[id]}</span>`;
        }
    });
    html += '</div>';

    container.innerHTML = html;
}

function filterByLang(lang) {
    activeLang = lang;
    renderFilters();
    filterMovies();
}

function filterByGenre(genreId) {
    activeGenre = genreId;
    renderFilters();
    filterMovies();
}

function filterMovies() {
    const query = document.getElementById('movieSearch').value.toLowerCase();
    let filtered = allMovies;

    if (query) {
        filtered = filtered.filter(m => m.title.toLowerCase().includes(query));
    }

    if (activeLang !== 'all') {
        filtered = filtered.filter(m => m.original_language === activeLang);
    }

    if (activeGenre !== 'all') {
        filtered = filtered.filter(m => m.genre_ids.includes(activeGenre));
    }

    renderMovieGrid('allMoviesGrid', filtered);
}

// ===== RENDERING =====
function renderMovieGrid(containerId, movies) {
    const container = document.getElementById(containerId);
    if (!movies || movies.length === 0) {
        container.innerHTML = '<div class="loading-spinner"><p>No movies found</p></div>';
        return;
    }

    container.innerHTML = movies.map((movie, i) => `
        <div class="movie-card" onclick="openMovieDetail(${movie.id})" style="animation-delay: ${i * 0.05}s">
            ${movie.vote_average >= 7.5 ? '<div class="movie-card-badge">⭐ Popular</div>' : ''}
            <img class="movie-card-poster" src="${imgUrl(movie.poster_path)}" alt="${movie.title}" loading="lazy" onerror="this.src='https://placehold.co/500x750/1a1a3e/666?text=No+Image'">
            <div class="movie-card-overlay">
                <button class="btn btn-primary" style="font-size:0.8rem; padding:8px 16px;">
                    <i class="fas fa-ticket-alt"></i> ${movie.id === 999 ? 'Sample Booking' : 'Book Now'}
                </button>
            </div>
            <div class="movie-card-info">
                <div class="movie-card-title">${movie.title}</div>
                <div class="movie-card-meta">
                    <span class="movie-card-rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}</span>
                    <span>${movie.release_date ? movie.release_date.split('-')[0] : ''}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderMovieScroll(containerId, movies) {
    const container = document.getElementById(containerId);
    if (!movies || movies.length === 0) {
        container.innerHTML = '<div class="loading-spinner"><p>No movies found</p></div>';
        return;
    }

    container.innerHTML = movies.map((movie, i) => `
        <div class="movie-card" onclick="openMovieDetail(${movie.id})" style="animation-delay: ${i * 0.05}s">
            <img class="movie-card-poster" src="${imgUrl(movie.poster_path)}" alt="${movie.title}" loading="lazy" onerror="this.src='https://placehold.co/500x750/1a1a3e/666?text=No+Image'">
            <div class="movie-card-overlay">
                <button class="btn btn-primary" style="font-size:0.75rem; padding:6px 12px;">
                    <i class="fas fa-ticket-alt"></i> ${movie.id === 999 ? 'Sample Booking' : 'Book'}
                </button>
            </div>
            <div class="movie-card-info">
                <div class="movie-card-title">${movie.title}</div>
                <div class="movie-card-meta">
                    <span class="movie-card-rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== MOVIE DETAIL =====
function openMovieDetail(movieId) {
    showPage('movie-detail');

    const movie = MOVIES_DB.find(m => m.id === movieId);
    if (!movie) {
        showToast('Movie not found', 'error');
        return;
    }

    selectedMovie = movie;

    // Backdrop
    document.getElementById('detailBackdrop').style.backgroundImage = `url(${imgUrl(movie.backdrop_path, 'original')})`;

    // Poster
    document.getElementById('detailPoster').src = imgUrl(movie.poster_path, 'w500');
    document.getElementById('detailPoster').alt = movie.title;

    // Info
    document.getElementById('detailTitle').textContent = movie.title;
    document.getElementById('detailRating').innerHTML = `<i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}`;
    document.getElementById('detailYear').innerHTML = `<i class="fas fa-calendar"></i> ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}`;
    document.getElementById('detailLang').innerHTML = `<i class="fas fa-globe"></i> ${(movie.original_language || 'en').toUpperCase()}`;
    document.getElementById('detailRuntime').innerHTML = `<i class="fas fa-clock"></i> ${movie.runtime || 120} min`;

    // Genres
    const genresHtml = (movie.genres || []).map(g => `<span class="genre-tag">${g.name}</span>`).join('');
    document.getElementById('detailGenres').innerHTML = genresHtml;

    // Overview
    document.getElementById('detailOverview').textContent = movie.overview || 'No description available.';

    // Hide show timings section
    document.getElementById('showTimingsSection').style.display = 'none';

    // Update Book Button Text
    const bookBtn = document.getElementById('detailBookBtn');
    if (bookBtn) {
        bookBtn.innerHTML = movie.id === 999
            ? '<i class="fas fa-flask"></i> Sample Booking'
            : '<i class="fas fa-ticket-alt"></i> Book Tickets';
    }
}

// ===== SHOW TIMINGS =====
// ===== SHOW TIMINGS =====
function showTimings() {
    document.getElementById('showTimingsSection').style.display = 'block';
    renderCitySelector();
    renderDates();
    renderTheatres();

    // Scroll to timings
    document.getElementById('showTimingsSection').scrollIntoView({ behavior: 'smooth' });
}

function renderCitySelector() {
    // Insert city selector before theatres list if not exists
    let citySelector = document.getElementById('citySelector');
    if (!citySelector) {
        citySelector = document.createElement('div');
        citySelector.id = 'citySelector';
        citySelector.className = 'city-selector';
        citySelector.style.marginBottom = '20px';
        citySelector.innerHTML = `
            <div style="margin-bottom:10px; color:var(--text-secondary); font-size:0.9rem;"> <i class="fas fa-map-marker-alt"></i> Select City</div>
            <div class="cities-grid" style="display:flex; gap:10px; overflow-x:auto; padding-bottom:5px;">
                ${CITIES.map(city => `
                    <button class="city-btn ${selectedCity === city ? 'active' : ''}" onclick="selectCity('${city}')" 
                    style="padding:6px 14px; border-radius:20px; border:1px solid var(--border-color); background:var(--bg-card); color:var(--text-secondary); cursor:pointer; flex-shrink:0;">
                        ${city}
                    </button>
                `).join('')}
            </div>
        `;
        const list = document.getElementById('theatresList');
        list.parentNode.insertBefore(citySelector, list);
    }
}

function selectCity(city) {
    selectedCity = city;
    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim() === city);
        if (btn.textContent.trim() === city) {
            btn.style.background = 'var(--accent)';
            btn.style.color = 'white';
            btn.style.borderColor = 'var(--accent)';
        } else {
            btn.style.background = 'var(--bg-card)';
            btn.style.color = 'var(--text-secondary)';
            btn.style.borderColor = 'var(--border-color)';
        }
    });
    renderTheatres();
}

function renderDates() {
    const container = document.getElementById('dateSelector');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let html = '';

    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const isToday = i === 0;
        const label = isToday ? 'Today' : days[date.getDay()];
        const dateStr = date.toISOString().split('T')[0];

        html += `
            <div class="date-btn ${i === 0 ? 'active' : ''}" onclick="selectDate(this, '${dateStr}')">
                <span class="day">${label}</span>
                <span class="date">${date.getDate()}</span>
                <span class="month">${months[date.getMonth()]}</span>
            </div>
        `;
        if (i === 0) selectedDate = dateStr;
    }
    container.innerHTML = html;
}

function selectDate(el, dateStr) {
    document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    selectedDate = dateStr;
}

function renderTheatres() {
    const container = document.getElementById('theatresList');
    const filteredTheatres = THEATRES_DB.filter(t => t.city === selectedCity);

    if (filteredTheatres.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">No theatres found in ${selectedCity}</div>`;
        return;
    }

    container.innerHTML = filteredTheatres.map(theatre => {
        const screen = theatre.screens[0]; // Default to first screen for demo
        return `
            <div class="theatre-card">
                <div class="theatre-name">${theatre.name}</div>
                <div class="theatre-address"><i class="fas fa-map-marker-alt"></i> ${theatre.address}</div>
                <div class="show-times">
                    ${showTimes.map(time => `
                        <button class="show-time-btn" onclick="selectShowTime(${theatre.id}, '${theatre.name.replace(/'/g, "\\'")}', '${screen}', '${time}')">
                            ${time}
                            <span class="price">From ₹100</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function selectShowTime(theatreId, theatreName, screen, time) {
    selectedTheatre = { id: theatreId, name: theatreName, screen };
    selectedTime = time;
    selectedSeats = [];
    showPage('seats');
    renderSeatSelection();
}

// ===== SEAT SELECTION =====
function renderSeatSelection() {
    document.getElementById('seatsMovieTitle').textContent = selectedMovie.title;
    document.getElementById('seatsShowInfo').textContent = `${selectedTheatre.name} | ${selectedTheatre.screen} | ${formatDisplayDate(selectedDate)} | ${selectedTime}`;

    generateSeats();
    renderSeatMap();
    updateBookingSummary();
}

function generateSeats() {
    seatLayout = [];

    // Check for Sample Movie (ID 999) => ₹1 Pricing
    const isSample = selectedMovie && selectedMovie.id === 999;
    const premiumPrice = isSample ? 1 : 200;
    const standardPrice = isSample ? 1 : 150;
    const economyPrice = isSample ? 1 : 100;

    const categories = [
        { name: 'Premium', rows: ['A', 'B'], price: premiumPrice, cssClass: 'premium' },
        { name: 'Standard', rows: ['C', 'D', 'E', 'F', 'G'], price: standardPrice, cssClass: 'standard' },
        { name: 'Economy', rows: ['H', 'I', 'J'], price: economyPrice, cssClass: 'economy' }
    ];

    categories.forEach(cat => {
        cat.rows.forEach(row => {
            const seats = [];
            for (let i = 1; i <= 14; i++) {
                const isBooked = Math.random() < 0.2; // 20% chance booked
                seats.push({
                    id: row + i,
                    row: row,
                    number: i,
                    category: cat.name,
                    price: cat.price,
                    cssClass: cat.cssClass,
                    status: isBooked ? 'booked' : 'available'
                });
            }
            seatLayout.push({ row, category: cat.name, cssClass: cat.cssClass, seats });
        });
    });
}

function renderSeatMap() {
    const container = document.getElementById('seatMap');
    let html = '';
    let currentCategory = '';

    seatLayout.forEach(rowData => {
        if (rowData.category !== currentCategory) {
            currentCategory = rowData.category;
            html += `<div class="seat-category-label ${rowData.cssClass}">${currentCategory} — ₹${rowData.seats[0].price}</div>`;
        }

        html += '<div class="seat-row">';
        html += `<span class="seat-row-label">${rowData.row}</span>`;

        rowData.seats.forEach((seat, idx) => {
            // Add gap in middle (aisle)
            if (idx === 3 || idx === 11) {
                html += '<div class="seat-gap"></div>';
            }

            const statusClass = seat.status === 'booked' ? 'booked' : seat.cssClass;
            const selectedClass = selectedSeats.find(s => s.id === seat.id) ? 'selected' : '';

            html += `
                <div class="seat ${statusClass} ${selectedClass}" 
                     onclick="toggleSeat('${seat.id}')" 
                     title="${seat.id} - ${seat.category} ₹${seat.price}">
                    ${seat.status !== 'booked' ? seat.number : ''}
                </div>
            `;
        });

        html += `<span class="seat-row-label">${rowData.row}</span>`;
        html += '</div>';
    });

    container.innerHTML = html;
}

function toggleSeat(seatId) {
    // Find seat in layout
    let seatInfo = null;
    seatLayout.forEach(row => {
        const seat = row.seats.find(s => s.id === seatId);
        if (seat) seatInfo = seat;
    });

    if (!seatInfo || seatInfo.status === 'booked') return;

    const idx = selectedSeats.findIndex(s => s.id === seatId);
    if (idx >= 0) {
        selectedSeats.splice(idx, 1);
    } else {
        if (selectedSeats.length >= 10) {
            showToast('Maximum 10 seats can be selected', 'error');
            return;
        }
        selectedSeats.push(seatInfo);
    }

    renderSeatMap();
    updateBookingSummary();
}

function updateBookingSummary() {
    const seatsText = selectedSeats.length > 0
        ? selectedSeats.map(s => s.id).join(', ')
        : 'None';
    const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

    document.getElementById('selectedSeatsText').textContent = seatsText;
    document.getElementById('totalAmount').textContent = `₹${total}`;
    document.getElementById('proceedPayBtn').disabled = selectedSeats.length === 0;
}

// ===== PAYMENT =====
function proceedToPayment() {
    if (selectedSeats.length === 0) return;
    showPage('payment');
    renderPaymentPage();
}

let currentPayTotal = 0;

function renderPaymentPage() {
    const ticketPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const convFee = Math.round(ticketPrice * 0.02); // 2% convenience fee
    const subtotal = ticketPrice + convFee;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;
    currentPayTotal = total;

    document.getElementById('paymentPoster').src = imgUrl(selectedMovie.poster_path, 'w200');
    document.getElementById('paymentMovieTitle').textContent = selectedMovie.title;
    document.getElementById('paymentShowInfo').textContent = `${formatDisplayDate(selectedDate)} | ${selectedTime}`;
    document.getElementById('paymentSeats').textContent = `Seats: ${selectedSeats.map(s => s.id).join(', ')}`;

    document.getElementById('orderTicketPrice').textContent = `₹${ticketPrice}`;
    document.getElementById('orderConvFee').textContent = `₹${convFee}`;
    document.getElementById('orderGST').textContent = `₹${gst}`;
    document.getElementById('orderTotal').textContent = `₹${total}`;
    document.getElementById('payBtnAmount').textContent = `₹${total}`;

    selectPayment('upi');
    generateUPIPaymentQR(total);
}

function selectPayment(method) {
    currentPaymentMethod = method;

    // Clear timer when switching methods
    if (paymentTimer) {
        clearTimeout(paymentTimer);
        paymentTimer = null;
        document.getElementById('upiStatus').textContent = '';
    }

    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
    document.getElementById('payOptUPI').classList.toggle('active', method === 'upi');
    document.getElementById('payOptCard').classList.toggle('active', method === 'card');
    document.getElementById('payOptNet').classList.toggle('active', method === 'netbanking');

    document.getElementById('payFormUPI').style.display = method === 'upi' ? 'block' : 'none';
    document.getElementById('payFormCard').style.display = method === 'card' ? 'block' : 'none';
    document.getElementById('payFormNet').style.display = method === 'netbanking' ? 'block' : 'none';
}

const MERCHANT_UPI_ID = '7305167021@ybl';

function generateUPIPaymentQR(amount) {
    const upiUrl = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=CineVerse%20Tickets&am=${amount}&cu=INR&tn=Movie%20Ticket%20Booking`;
    const qrContainer = document.getElementById('upiQRCode');
    try {
        const qr = qrcode(0, 'M');
        qr.addData(upiUrl);
        qr.make();
        qrContainer.innerHTML = qr.createImgTag(5, 0);
    } catch (e) {
        qrContainer.innerHTML = '<p style="color:var(--text-muted);">QR generation failed</p>';
    }
    document.getElementById('upiIdDisplay').textContent = MERCHANT_UPI_ID;
    document.getElementById('upiAmountDisplay').textContent = '₹' + amount;

    // Auto-confirm simulation
    const statusEl = document.getElementById('upiStatus') || document.createElement('div');
    statusEl.id = 'upiStatus';
    statusEl.style.cssText = 'margin-top:10px; font-size:0.9rem; color:var(--accent); animation: pulse 1.5s infinite;';
    statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Waiting for payment confirmation...';
    qrContainer.parentNode.appendChild(statusEl);

    if (paymentTimer) clearTimeout(paymentTimer);
    paymentTimer = setTimeout(() => {
        processPayment(true); // true = auto
    }, 15000); // 15 seconds
}

function selectUPIApp(appName) {
    const upiUrl = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=CineVerse%20Tickets&am=${currentPayTotal}&cu=INR&tn=Movie%20Ticket%20Booking`;
    window.open(upiUrl, '_blank');
    showToast(`Opening ${appName}...`, 'info');
}

function selectBank(el, bankName) {
    document.querySelectorAll('.bank-option').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
}

function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    input.value = value;
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    input.value = value;
}

function processPayment(isAuto = false) {
    // For UPI — open deep link with actual amount
    if (currentPaymentMethod === 'upi' && !isAuto) {
        const upiUrl = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=CineVerse%20Tickets&am=${currentPayTotal}&cu=INR&tn=Movie%20Ticket%20Booking`;
        window.open(upiUrl, '_self');
        showToast('UPI payment request sent to ' + MERCHANT_UPI_ID, 'success');
    } else if (currentPaymentMethod === 'card') {
        const cardNum = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiry = document.getElementById('cardExpiry').value;
        const cvv = document.getElementById('cardCVV').value;
        const name = document.getElementById('cardName').value;
        if (cardNum.length < 16 || !expiry || cvv.length < 3 || !name) {
            showToast('Please fill all card details correctly', 'error');
            return;
        }
    } else if (currentPaymentMethod === 'netbanking') {
        const activeBank = document.querySelector('.bank-option.active');
        if (!activeBank) {
            showToast('Please select a bank', 'error');
            return;
        }
    }

    // Show processing
    document.getElementById('paymentProcessing').style.display = 'flex';

    // Simulate payment processing
    setTimeout(() => {
        document.getElementById('paymentProcessing').style.display = 'none';
        completeBooking();
    }, 3000);
}

function completeBooking() {
    const ticketPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const convFee = Math.round(ticketPrice * 0.02);
    const subtotal = ticketPrice + convFee;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    const booking = {
        id: 'CV' + Date.now().toString(36).toUpperCase(),
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title,
        posterPath: selectedMovie.poster_path,
        date: selectedDate,
        time: selectedTime,
        theatre: selectedTheatre.name,
        screen: selectedTheatre.screen,
        seats: selectedSeats.map(s => s.id),
        seatDetails: selectedSeats.map(s => ({ id: s.id, category: s.category, price: s.price })),
        totalAmount: total,
        paymentMethod: currentPaymentMethod,
        bookedAt: new Date().toISOString(),
        userId: currentUser.id
    };

    // Save booking
    const bookings = JSON.parse(localStorage.getItem('cineverse_bookings') || '[]');
    bookings.unshift(booking);
    localStorage.setItem('cineverse_bookings', JSON.stringify(bookings));

    // Save to Owner Global History
    saveToGlobalHistory(booking);

    // Show ticket
    showPage('ticket');
    renderTicket(booking);
    createConfetti();
    showToast('Booking confirmed! 🎉', 'success');
}

// ===== TICKET =====
function renderTicket(booking) {
    document.getElementById('ticketMovieName').textContent = booking.movieTitle;
    document.getElementById('ticketDate').textContent = formatDisplayDate(booking.date);
    document.getElementById('ticketTime').textContent = booking.time;
    document.getElementById('ticketScreen').textContent = booking.screen;
    document.getElementById('ticketSeats').textContent = booking.seats.join(', ');
    document.getElementById('ticketAmount').textContent = `₹${booking.totalAmount}`;
    document.getElementById('ticketBookingId').textContent = booking.id;
    document.getElementById('ticketTheatre').textContent = booking.theatre;

    // Set Poster
    document.getElementById('ticketPoster').src = imgUrl(booking.posterPath);

    // Generate QR code
    generateQRCode(booking);
}

function generateQRCode(booking) {
    const qrContainer = document.getElementById('ticketQR');
    try {
        const qr = qrcode(0, 'M');
        qr.addData(JSON.stringify({
            id: booking.id,
            movie: booking.movieTitle,
            date: booking.date,
            time: booking.time,
            seats: booking.seats.join(',')
        }));
        qr.make();
        qrContainer.innerHTML = qr.createImgTag(3, 0);
    } catch (e) {
        // Fallback if QR library fails
        qrContainer.innerHTML = `<div style="width:72px;height:72px;display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:#333;text-align:center;">QR<br>${booking.id}</div>`;
    }
}

async function downloadTicket() {
    try {
        showToast('Generating High-Quality PDF...', 'info');

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Get Current Booking Data
        const bookingId = document.getElementById('ticketBookingId').textContent;
        const movieTitle = document.getElementById('ticketMovieName').textContent;
        const date = document.getElementById('ticketDate').textContent;
        const time = document.getElementById('ticketTime').textContent;
        const theatre = document.getElementById('ticketTheatre').textContent;
        const screen = document.getElementById('ticketScreen').textContent;
        const seats = document.getElementById('ticketSeats').textContent;
        const amount = document.getElementById('ticketAmount').textContent;

        // Background - Dark Theme
        pdf.setFillColor(26, 5, 10); // #1a050a
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        // Header
        pdf.setTextColor(230, 0, 35); // Accent Red
        pdf.setFontSize(22);
        pdf.setFont(undefined, 'bold');
        pdf.text('CineVerse Ticket', pageWidth / 2, 20, { align: 'center' });

        // Movie Title
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(18);
        pdf.text(movieTitle, 20, 40);

        // Details Section
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.setTextColor(200, 200, 200);

        let y = 55;
        const lineHeight = 10;

        pdf.text(`Booking ID: ${bookingId}`, 20, y); y += lineHeight;
        pdf.text(`Date: ${date}`, 20, y); y += lineHeight;
        pdf.text(`Time: ${time}`, 20, y); y += lineHeight;
        pdf.text(`Theatre: ${theatre}`, 20, y); y += lineHeight;
        pdf.text(`Screen: ${screen}`, 20, y); y += lineHeight;
        pdf.text(`Seats: ${seats}`, 20, y); y += lineHeight;
        pdf.text(`Amount Paid: ${amount}`, 20, y); y += lineHeight + 5;

        // Visual Layout: Poster (Left) + QR (Right)

        // 1. Poster Image (Try to get from img tag)
        const posterImg = document.getElementById('ticketPoster');
        if (posterImg && posterImg.src && posterImg.complete) {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = posterImg.naturalWidth;
                canvas.height = posterImg.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(posterImg, 0, 0);
                const imgData = canvas.toDataURL('image/jpeg');
                pdf.addImage(imgData, 'JPEG', 20, y, 60, 90); // Poster
            } catch (e) {
                console.warn('Poster CORS issue in PDF', e);
                pdf.text('[Poster Image Not Available]', 20, y + 20);
            }
        }

        // 2. QR Code
        const qrContainer = document.getElementById('ticketQR');
        const qrImg = qrContainer.querySelector('img');
        if (qrImg) {
            try {
                pdf.addImage(qrImg.src, 'PNG', 120, y, 50, 50);
                pdf.setFontSize(10);
                pdf.text('Scan for Entry', 145, y + 55, { align: 'center' });
            } catch (e) {
                console.warn('QR Code issue', e);
            }
        }

        // Footer
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(10);
        pdf.text('Show this e-ticket at the cinema entrance.', pageWidth / 2, pageHeight - 20, { align: 'center' });
        pdf.text('© 2026 CineVerse. All rights reserved.', pageWidth / 2, pageHeight - 10, { align: 'center' });

        pdf.save(`CineVerse_Ticket_${bookingId}.pdf`);
        showToast('PDF Ticket Downloaded Successfully!', 'success');

    } catch (err) {
        console.error('PDF Generation Error:', err);
        showToast('PDF download failed. Please try again.', 'error');
    }
}


// ===== MY BOOKINGS =====
function loadBookings() {
    const container = document.getElementById('bookingsContainer');
    const bookings = JSON.parse(localStorage.getItem('cineverse_bookings') || '[]');
    const userBookings = bookings.filter(b => b.userId === currentUser.id);

    if (userBookings.length === 0) {
        container.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-ticket-alt"></i>
                <h3>No bookings yet</h3>
                <p>Start by browsing movies and booking your tickets!</p>
                <button class="btn btn-primary" onclick="navigate('movies')" style="margin-top:16px;">
                    <i class="fas fa-video"></i> Browse Movies
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = userBookings.map((booking, i) => `
        <div class="booking-card" style="animation-delay: ${i * 0.1}s">
            <div class="booking-card-header">
                <h3>${booking.movieTitle}</h3>
                <span class="booking-status">Confirmed</span>
            </div>
            <div class="booking-card-details">
                <div><small>Date</small>${formatDisplayDate(booking.date)}</div>
                <div><small>Time</small>${booking.time}</div>
                <div><small>Seats</small>${booking.seats.join(', ')}</div>
                <div><small>Amount</small>₹${booking.totalAmount}</div>
                <div><small>Theatre</small>${booking.theatre}</div>
                <div><small>Booking ID</small>${booking.id}</div>
            </div>
        </div>
    `).join('');
}

// ===== CONFETTI =====
function createConfetti() {
    const container = document.getElementById('confetti');
    container.innerHTML = '';
    const colors = ['#ff4757', '#ffd700', '#1e90ff', '#2ed573', '#ff6b81', '#a855f7'];

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            animation: confettiFall ${Math.random() * 3 + 2}s ease forwards;
            animation-delay: ${Math.random() * 1}s;
            opacity: 0.9;
        `;
        container.appendChild(piece);
    }

    // Add confetti animation style
    if (!document.getElementById('confettiStyle')) {
        const style = document.createElement('style');
        style.id = 'confettiStyle';
        style.textContent = `
            @keyframes confettiFall {
                0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
                100% { transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Clear after animation
    setTimeout(() => container.innerHTML = '', 5000);
}

// ===== UI HELPERS =====
function toggleMobileMenu() {
    document.getElementById('navLinks').classList.toggle('show');
}

function toggleUserDropdown() {
    document.getElementById('userDropdown').classList.toggle('show');
}

function closeUserDropdown() {
    document.getElementById('userDropdown').classList.remove('show');
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        closeUserDropdown();
    }
});

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
// ===== SAMPLE TICKET =====
function showSampleTicket() {
    const dummyBooking = {
        id: 'SAMPLE-DEMO',
        movieTitle: 'CineVerse Experience',
        posterPath: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', // Inception poster
        date: new Date().toISOString(),
        time: '10:00 AM',
        theatre: 'CineVerse IMAX',
        screen: 'Screen 1',
        seats: ['A1', 'A2'],
        totalAmount: 2,
        bookingDate: new Date().toISOString()
    };

    showPage('ticket');
    renderTicket(dummyBooking);
    // Hide confetti for sample
    document.getElementById('confetti').innerHTML = '';
}
