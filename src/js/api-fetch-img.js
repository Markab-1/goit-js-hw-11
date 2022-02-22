import axios from "axios";
export { makeImgLink, processImages, processMoreImages };
    
const API_KEY = "25715190-c3c4d5478cb2124fb43ef72a8";
const BASE_URL = "https://pixabay.com/api/"; 

let imageLink = "";
let pageNumber = 1;
let currentImgAmount = 0;

function makeImgLink(link) {
    imageLink = BASE_URL + "?key=" + API_KEY + "&q=" + link + "&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=";
    pageNumber = 1;
}

async function processImages() { 
    resetPage();
    const currentImageLink = imageLink + `${pageNumber}`;
    const imgData = await getImages(currentImageLink);

    currentImgAmount += imgData.hits.length;
    return imgData ;   
}

async function processMoreImages() {
    if (imageLink) {
        const currentImageLink = imageLink + `${pageNumber}`;

        const imgData = await getImages(currentImageLink);
        if (currentImgAmount < imgData.total) {
            currentImgAmount += imgData.hits.length;
            return imgData;
            }
        if (currentImgAmount >= imgData.total) { return (new Error); }
    }
}

function resetPage() {
    pageNumber = 1;
    currentImgAmount = 0;
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
 