export { galleryMarkup };

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