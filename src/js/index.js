import SimpleLightbox from 'simplelightbox';
import { makeImgLink, processImages, processMoreImages } from './api-fetch-img'
import { galleryMarkup } from './markup'
import 'simplelightbox/dist/simple-lightbox.min.css';

var lightbox = new SimpleLightbox('.gallery a');

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

    if (searchQuery) {
        makeImgLink(searchQuery);
        processImages()
        .then(data => onResolve(data));
    }
}

function onResolve(data) {
    insertMarkup(data);
    lightbox.refresh();
    scroll();
    if (data.totalHits > 40) {
       onVisible(refs.loadBtn); 
    }   
}

function onLoadMore() {
    processMoreImages()
        .then(data => {
            insertMarkup(data);
            lightbox.refresh();
            scroll();
        })
    .catch(error => offVisible(refs.loadBtn));
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