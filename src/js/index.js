import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = "25715190-c3c4d5478cb2124fb43ef72a8";
const BASE_URL = "https://pixabay.com/api/"; 

let imageLink = "";
let pageNumber = 1;
let currentImgAmount = 0;
var lightbox = new SimpleLightbox('.gallery a');

const notiflixOptions = {
    timeout: 5000,
    clickToClose: true,
    fontSize: '20px',
    width: '400px',
};

const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryList: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more'),
}

refs.searchForm.addEventListener("submit", onSearch);
refs.loadBtn.addEventListener("click",onLoadMore);

function onSearch(e) {
    e.preventDefault();

    cleanData(refs.galleryList);
    offVisible(refs.loadBtn);

    const searchQuery = e.target.elements.searchQuery.value;
    console.log(searchQuery);
  
   console.log(imageLink );
    if (searchQuery) {
        imageLink = BASE_URL + "?key=" + API_KEY + "&q=" + searchQuery + "&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=";
        pageNumber = 1;
        processImages(imageLink);
    }
}

function processImages(imageLink) { 
    const currentImageLink = imageLink + `${pageNumber}`;
    getImages(currentImageLink)
        .then(data => {
            console.log(data);
            if (data.total > 0) {
               Notiflix.Notify.info( `Hooray! We found ${data.totalHits} images.`, notiflixOptions,);
                insertMarkup(data);
                lightbox.refresh();
                scroll();
                onVisible(refs.loadBtn);
                currentImgAmount += data.hits.length;
            }
            if (data.total === 0) { Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.', notiflixOptions,); }
        });
}

function onLoadMore() {
    if (imageLink) {
        const currentImageLink = imageLink + `${pageNumber}`;
        getImages(currentImageLink)
            .then(data => { console.log(data.hits.length, currentImgAmount);
                if (currentImgAmount < data.total) {
                    insertMarkup(data);
                    lightbox.refresh();
                    scroll();
                    currentImgAmount += data.hits.length;
                }
                if (currentImgAmount >= data.total) {
                    Notiflix.Notify.failure('We\'re sorry, but you\'ve reached the end of search results.', notiflixOptions,);
                    offVisible(refs.loadBtn);
                }
            });
    }
}

async function getImages(imageLink) {
    try {
        const response =
            await axios.get(imageLink);
        pageNumber += 1;
        return response.data;  
        }
        catch (error) {
        console.error(error);
    }   
}
 
function cleanData(data) {
    data.innerHTML = "";
}

function insertMarkup(array) {
    refs.galleryList.insertAdjacentHTML('beforeend', galleryMarkup(array));
}

function onVisible(data) {
    data.classList.add('button-visible');
}

function offVisible(data) {
    data.classList.remove('button-visible');
}

function scroll() {
    const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
    });
}

function galleryMarkup(array) {
    return  array.hits.map((hit) =>
        `<a href='${hit.largeImageURL}' class="photo-link"> <div class="photo-card">
        <img src="${hit.webformatURL}" alt="" title="" loading="lazy" />
        <div class="info">
        <p class="info-item">
        <b>Likes </br> ${hit.likes}</b>
        </p>
        <p class="info-item">
        <b>Views </br> ${hit.views}</b>
        </p>
        <p class="info-item">
        <b>Comments </br> ${hit.comments}</b>
        </p>
        <p class="info-item">
        <b>Downloads </br> ${hit.downloads}</b>
        </p>
        </div>
        </div>
        </a>`).join("");
}