const API_KEY = "369cafa9-6745-4f83-b350-6edaa8ba305a";
let page = 1;
let API_URL_POPULAR_none = `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=`; //пустая ссылка топа для перемещния по страницам 
let API_URL_PREMIER = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2023&month=MAY`; //ссылка на премьеры в мае
let API_URL_POPULAR = 
`https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=${page}`; //подгрузка подборки фильмов через api
const API_URL_SEARCH = 
"https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword="; //поиск по ключевым словам через api

const API_URL_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/"

getMovies(API_URL_POPULAR); // вызов асинхронной функции



async function getMovies(url) // создание асинхронной функции для запроса
{
    const resp = await fetch(url, {
        headers:{
            "Content-Type" : "application/json",
            "X-API-KEY": API_KEY,
        },
    });

    const respData = await resp.json();
    showMovies(respData);

    

}
showPageBtns();
let voteNum; //создаём переменную для рейтинга фильмов

function getClassByRate(vote) //функция для выбора цвета обводки в завасимости от рейтинга и для перобразованая рейтинга из строк в числа для однообразия
{


    if(vote.endsWith('%'))
    {
       voteNum = new Number (vote.slice(0,vote.length - 1)) / 10; //присваем переменной voteNum значение атрибута rating из объектов movie и переопределяем в number 
    }
    else
    {
    
        voteNum = new Number(vote);//присваем переменной voteNum значение атрибута rating из объектов movie и переопределяем в number
    }

    if(voteNum >= 7)
    {
        return "green";
    }
    else if(voteNum > 5)
    {
        return "orange";
    }
    else
    {
        return "red";
    }
}

function showMovies(data) //функция которая отрисовывает карточки сайта
{
    const moviesEl = document.querySelector(".movies"); //указываем где будут отрисовываться карточки

    document.querySelector(".movies").innerHTML = ""; //очищаем блок с карточками для вывода новых из поиска или по подбору

    data.films.forEach(movie => // проходимся по всем объектам в массиве movie 
    { 
        

        const movieEL = document.createElement("div") // создание элемента
       
        movieEL.classList.add("movie") // добавляем класс movie в наш блок
        movieEL.innerHTML = 
        `
            <div class="movie">
                <div class="movie__cover-ineer">
                    <img src="${movie.posterUrlPreview}"
                    class="movie_cover"
                    alt="${movie.nameRu}">
                    <div class="movie__cover--darkened">

                    </div>
                </div>
                <div class="movie__info">
                    <div class="movie__title">${movie.nameRu}</div>
                    <div class="movie__category">${movie.genres.map((genre) => ` ${genre.genre}`)}</div>
                    ${movie.rating && 
                        `
                        <div class="movie__average movie__average--${getClassByRate(movie.rating)}">${voteNum}</div>
                        `
                    }
                    
                </div>
            </div>
        `
        console.log(movie.countries[0].country)
     // отрисовывем карточку фильма

        moviesEl.appendChild(movieEL);
    })
}


// поиск

const form = document.querySelector("form"); // создаем переменную для обращения к форме
const search = document.querySelector(".header__search"); // создаём переменную для обращения к строке поиска


form.addEventListener("submit", (e) => {
    e.preventDefault();
    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`

    if(search.value)
    {
        getMovies(apiSearchUrl);
        search.value = "";
    }
})

// pagination

let next = document.getElementById("next"); //ловим кнопку вперед

next.addEventListener("click", nextPage); //задаём ей действие

function nextPage() // созданире функии для перехода на след стр
{ //прибавляем значению page 1 для перехода на следующею стр
   if(page === 20) // чтобы не выдвала пустую страницу при попытке попасть на предыдущую если мы на первой
    {
        page = 20;
    }
    else
    {
        page +=1;//прибавляем значению page 1 для перехода на следующею стр
    }
   getMovies(API_URL_POPULAR_none + page); // вызываем функцию для запроса ссылки из api,функция отрисовки карточек уже внутри
}

let back = document.getElementById("back"); //всё вышеописанное,только для кнопки назад

back.addEventListener("click", prevPage);

function prevPage()
{
    page -= 1;
    if(page === 0) // чтобы не выдвала пустую страницу при попытке попасть на предыдущую если мы на первой
    {
        page = 1;
    }
    getMovies(API_URL_POPULAR_none + page);
}

//page-numbers

function showPageBtns() 
{

    let pages = [];
    for (let i = 0; i < 20; i++) {
      pages[i] = i + 1;

      let pageBtn = document.createElement("button");

      pageBtn.classList.add("btn");
      pageBtn.setAttribute("data-page", pages[i]);
      pageBtn.innerHTML = pages[i];
      pageBtn.addEventListener("click", () => {
        pageReload(pages[i]);
      });
      document.getElementById("page-numbers").appendChild(pageBtn);
    }
  
  }
  
  function pageReload(count) {
    page = count;
    
    getMovies(API_URL_POPULAR_none + page);
  }

//   modal
// получаем кнопку, которая будет открывать модальное окно
var btn = document.getElementById('openModal');

// получаем само модальное окно
var modal = document.getElementById('modal');

// получаем элемент для закрытия модального окна (иконка "x")
var close = document.getElementsByClassName('close')[0];

// при клике на кнопку открываем модальное окно
btn.onclick = function() {
    modal.style.display = "block";
}

// при клике на элемент для закрытия модального окна закрываем его
close.onclick = function() {
    modal.style.display = "none";
}

// при клике вне модального окна закрываем его
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
//подборка

let ganer = document.getElementById('ganer');
let filmyear = document.getElementById('year');
let ratyng = document.getElementById('rating');
let filmcountrie = document.getElementById('countrie');

let yearValue = parseInt(year.value);
let ratingValue = parseInt(rating.value);

async function getMoviesList(url) // создание асинхронной функции для запроса
{
    const resp = await fetch(url, {
        headers:{
            "Content-Type" : "application/json",
            "X-API-KEY": API_KEY,
        },
    });

    const respData = await resp.json();
    console.log(respData);

    showMoviesList(respData);
}



function showMoviesList(data)
{
 const moviesEl = document.querySelector(".movies"); //указываем где будут отрисовываться карточки

    document.querySelector(".movies").innerHTML = ""; //очищаем блок с карточками для вывода новых из поиска или по подбору

    data.films.forEach(movie => // проходимся по всем объектам в массиве movie 
    { 
        

        
            const movieEL =   movieEL = document.createElement("div") // создание элемента
            movieEL.classList.add("movie") 
       
            // добавляем класс movie в наш блок
            
            movie.rating >= ratyng.value && movie.year >= filmyear.value && (movie.genres[0].genre == ganer.value)
            && movie.countries[0].country === filmcountrie.value ?
          
            movieEL.innerHTML = 
            `
                <div class="movie">
                    <div class="movie__cover-ineer">
                        <img src="${movie.posterUrlPreview}"
                        class="movie_cover"
                        alt="${movie.nameRu}">
                        <div class="movie__cover--darkened">
    
                        </div>
                    </div>
                    <div class="movie__info">
                        <div class="movie__title">${movie.nameRu}</div>
                        <div class="movie__category">${movie.genres.map((genre) => ` ${genre.genre}`)}</div>
                        ${movie.rating && 
                            `
                            <div class="movie__average movie__average--${getClassByRate(movie.rating)}">${voteNum}</div>
                            `
                        }
                        
                    </div>
                </div>
            `   
        
        
        : null
     // отрисовывем карточку фильма
                   
        moviesEl.appendChild(movieEL);
      
    })
}


document.querySelector('#submit').onclick = function()
{
    
    getMoviesList(API_URL_POPULAR_none + page);
}









