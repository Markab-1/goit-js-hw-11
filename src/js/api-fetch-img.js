import axios from "axios";
import Notiflix from "notiflix";
export { makeImgLink, processImages, processMoreImages };
    
const API_KEY = "25715190-c3c4d5478cb2124fb43ef72a8";
const BASE_URL = "https://pixabay.com/api/"; 

let imageLink = "";
let pageNumber = 1;
let currentImgAmount = 0;

const notiflixOptions = {
    timeout: 5000,
    clickToClose: true,
    fontSize: '20px',
    width: '400px',
};

function makeImgLink(link) {
    imageLink = BASE_URL + "?key=" + API_KEY + "&q=" + link + "&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=";
    pageNumber = 1;
}

async function processImages() { 
    resetPage();
    const currentImageLink = imageLink + `${pageNumber}`;
    const imgData = await getImages(currentImageLink);

            if (imgData.total > 0) {
                Notiflix.Notify.info(`Hooray! We found ${imgData.totalHits} images.`, notiflixOptions,);
                console.log("length", imgData.hits.length);
                currentImgAmount += imgData.hits.length;
                return imgData ;
            }
            if (imgData.total === 0) { Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.', notiflixOptions,); }
        
}

async function processMoreImages() {
    if (imageLink) {
        const currentImageLink = imageLink + `${pageNumber}`;

        const imgData = await getImages(currentImageLink);
            console.log(imgData.hits.length, currentImgAmount);
        if (currentImgAmount < imgData.total) {
            currentImgAmount += imgData.hits.length;
            return imgData;
            }
        if (currentImgAmount >= imgData.total) {
            Notiflix.Notify.failure('We\'re sorry, but you\'ve reached the end of search results.', notiflixOptions,);
            return (new Error);
        }
    }
}

function resetPage() {
    pageNumber = 1;
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
 