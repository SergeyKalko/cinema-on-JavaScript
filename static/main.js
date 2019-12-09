function start() {
    fetch('https://cinema-api-test.herokuapp.com/movies')
        .then(response => response.json())
        .then(data => {
            addLocal(data, 'infoFilm');
            create(data);
            filmCreate();
        })
        .catch(error => console.error(error))
}
function init() {
    $('.all-list').on('click', () => start());
}
function filmCreate() {
    $('[class^=item]').on('click', (e) => {
        let getId = $(e.currentTarget).attr("data-id");
        fetch(`https://cinema-api-test.herokuapp.com/movies?movie_id=${getId}`)
            .then(response => response.json())
            .then(data => {
                $('.content').empty();
                constructFilm(data);
            })
            .catch(error => console.error(error))
    });
}
function create(x) {
    $('.content').empty();
    x.forEach((item, i) => {
        constructFilm(item, i)
    });

}

function takeLocal(g) {
    let takeNotes = localStorage.getItem(g);
    noteArr = JSON.parse(takeNotes);
    return noteArr;
}
function addLocal(x,y) {
    let addNotes = JSON.stringify(x);
    localStorage.setItem(y, addNotes);
}
function constructFilm(u, i) {
    let dataRel = u.dateOfRelease.split('T')[0];
    getGen(u);
    $('.content').append($(`<div class="item-${i} item-height" data-id="${u._id}"></div>`));
    $(`.item-${i}`).append($(`<div class="img-wrap-${i} img-height"></div>`));
    $(`.img-wrap-${i}`).append($(`<img class="img-item" src="${u.pictureLink}" alt="${u.name}">`));
    $(`.item-${i}`).append($(`<p class="">${u.name.toUpperCase() }</p>`));
    $(`.item-${i}`).append($(`<p class="">${u.description}</p>`));
    $(`.item-${i}`).append($(`<p class="">genres : ${genres}</p>`));
    $(`.item-${i}`).append($(`<p class="">${dataRel}</p>`));

}
function constructShows(u) {
    $('.content').empty();
    u.forEach((item, i) => {
        let data = item.date.split('T')[0];
        let time = (item.date.split('T')[1]).slice(0, 5);
        let getIdShows = item.movie_id;
        takeLocal('infoFilm');
        let nameFilm = (noteArr.find(x => x._id === getIdShows).name).toUpperCase();
        let imageFilm = noteArr.find(x => x._id === getIdShows).pictureLink;
        $('.content').append($(`<div class="item-${i}" data-id="${item._id}"></div>`));
        $(`.item-${i}`).append($(`<div class="img-wrap-${i} img-height"></div>`));
        $(`.img-wrap-${i}`).append($(`<img class="img-shows" src="${imageFilm}" alt="">`));
        $(`.item-${i}`).append($(`<p class="">${nameFilm}</p>`));
        $(`.item-${i}`).append($(`<p class="">${data}</p>`));
        $(`.item-${i}`).append($(`<p class="">${time}</p>`));
        $(`.item-${i}`).append($(`<p class="">PRICE: ${item.ticketPrice} $</p>`));
        $(`.item-${i}`).append($(`<button class="btn-snows" data-shows="${item.movie_id}">buy a ticket</button>`));
    });
}
function shows() {
    $('.all-Shows-list').on('click', () => {
        $('.content').empty();
        fetch('https://cinema-api-test.herokuapp.com/movieShows')
            .then(response => response.json())
            .then(data => {
                constructShows(data);
                initshows();

            })
            .catch(error => console.error(error))
    });
}
function initshows(k) {
    $('.btn-snows').on('click', (e) => {
        let getId = $(e.currentTarget).attr("data-shows");
        $('.content').empty();
        fetch(`https://cinema-api-test.herokuapp.com/movieShows?movie_id=${getId}`)
            .then(response => response.json())
            .then(data => {
                addShows(data);
                buildField(data);
            })
            .catch(error => console.error(error))
    });
}
function addShows(l) {
    $('.content').append($(`<div class="places-wrap"></div>`));
    $('.places-wrap').append($(`<div class="shows-discript"></div>`));
    $('.places-wrap').append($(`<div class="field"></div>`));
    let dataShows = l.date.split('T')[0];
    let timeShows = (l.date.split('T')[1]).slice(0, 5);
    let getId = l.movie_id;
    takeLocal('infoFilm');
    let nameFilm = (noteArr.find(x => x._id === getId).name).toUpperCase();
    let imageFilm = noteArr.find(x => x._id === getId).pictureLink;
    $('.shows-discript').append($(`<img class="img-places" src="${imageFilm}" alt="">`));
    $('.shows-discript').append($(`<p class="">${nameFilm}</p>`));
    $('.shows-discript').append($(`<p class="">${dataShows}</p>`));
    $('.shows-discript').append($(`<p class="">${timeShows}</p>`));
}
function buildField(m) {
    $('.field').empty();
    let fieldArr =m.places;
    fieldArr.forEach((item, i) => {
        $('.field').append($(`<div class='wrap-${i}'></div>`));
        $(`.wrap-${i}`).append($(`<div class='row-${i}'></div>`));
        $(`.wrap-${i}`).append($(`<span class=""> ROW ${i}</span>`));
        item.forEach((elem, j) => {
            let dataId = elem._id;
            let dataPosition = elem.position;
            let dataBoolean = elem.isFree;
            let color;
            if("color" in elem) {
                color = 'green';
            } else {
                color = getColor(elem.isFree);
            }
            const elementClass = `element-${j} ${color}`;
            $(`.row-${i}`).append($(`<div class='${elementClass}' data-i="${i}" data-j="${j}" data-id="${dataId }" data-position="${dataPosition}" data-boolean="${dataBoolean}">${j}</div>`))
            delete elem.color;

        });
    });
    $('.field').append($(`<button class='btn-buy'>BUY TICKET</button>`));
    $('.btn-buy').prop('disabled', true);

    function getColor(m) {
        let colorClass;
        if (m == true) {
            colorClass = 'free';
        } else {
            colorClass = 'red';
        }
        return colorClass;
    }
    const params = {
        movieShow_id: null,
        row_id: null,
        place_position: null,
        isFree: null
    }
    params.movieShow_id = m._id;

    $('.free').on('click', (e) =>{
        let dataArrI = +$(e.currentTarget).attr('data-i');
        let dataArrJ = +$(e.currentTarget).attr('data-J');
        let elemArr = fieldArr[dataArrI][dataArrJ];
        let dataBool = elemArr.isFree;
        elemArr['color'] = '3';
        params.movieShow_id = m._id;
        params.place_position = dataArrJ;
        params.row_id = dataArrI;
        params.isFree = dataBool;
        buildField(m);
        selectOff();
        $('.btn-buy').on('click', () => {
            postRequest('https://cinema-api-test.herokuapp.com/bookingPlace',
                params
            )
                .then(data => {
                    thankYouPage(data);
                })
                .catch(error => console.error(error))
            function postRequest(url, data) {
                return fetch(url, {
                    credentials: 'same-origin',
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    }),
                })
                    .then(response => response.text())
            }
        });
    });
}
function selectOff() {
    $('.btn-buy').prop('disabled', false);
}
function thankYouPage(x) {
    let arr = x.split('/');
    let row = arr[1];
    let place = arr[2];
    $('.field').empty();
    $('.field').append($(`<div class="thank-wrap"></div>`));
    $('.thank-wrap').append($(`<div class="thank">Your reservation code:</div>`));
    $('.thank-wrap').append($(`<div class="thank">${x}</div>`));
    $('.thank-wrap').append($(`<p class="thank">row: ${row}</p>`));
    $('.thank-wrap').append($(`<p class="thank">place: ${place}</p>`));

}
function getSearchGenres() {
    $('.search-genres').on('click', () => {
        let genresText = $(".select-genres :selected").text();
        let genres;
        if (genresText !== 'genres') {
            switch (genresText) {
                case 'genres':
                    break;
                case 'ACTION':
                    genres = 0;
                    break;
                case 'ADVENTURES':
                    genres = 1;
                    break;
                case 'COMEDY':
                    genres = 2;
                    break;
                case 'DRAMA':
                    genres = 3;
                    break;
                case 'HORROR':
                    genres = 4;
                    break;
                case 'WESTERNS':
                    genres = 5;
                    break;
            }
            fetch(`https://cinema-api-test.herokuapp.com/movies/find?genres=${genres}`)
                .then(response => response.json())
                .then(data => {
                    createSearch(data);
                    filmCreate();
                })
                .catch(error => console.error(error))
        }
    });
}
function getSearchFilm() {
    $('.search').on('click', () => {
        let filmName = $('.search-wrap input').val();
        fetch(`https://cinema-api-test.herokuapp.com/movies/find?name=${filmName}`)
            .then(response => response.json())
            .then(data => {
                createSearch(data);
                filmCreate();
            })
            .catch(error => console.error(error))
    });
}
function createSearch(x) {
    $('.content').empty();
    x.forEach((item, i) => {
        constructFilm(item, i);
    });
}
function getGen(q) {
    let getGenres = q.genre_id.map(function callback(num, i, array) {
        switch (num) {
            case 0:
                num  ='action';
                break;
            case 1:
                num  ='adventures';
                break;
            case 2:
                num  ='comedy';
                break;
            case 3:
                num  ='drama';
                break;
            case 4:
                num  ='horror';
                break;
            case 5:
                num  ='westerns';
                break;
        }
        return num
    });
    return genres = getGenres.join(', ');
}
getSearchFilm();
getSearchGenres();
start();
shows();
initshows();
init();
