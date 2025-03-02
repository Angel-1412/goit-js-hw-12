import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox(".image-card a", { 
  captionsData: "alt", 
  captionDelay: 250 
});

export function renderGallery(images, galleryElement, clear = false) {
  if (clear) {
    galleryElement.innerHTML = "";
  }
  if (images.length === 0) {
    galleryElement.innerHTML = "<p>Sorry, there are no images matching your search query. Please try again!</p>";
    return;
  }

  const markup = images
    .map(
      (image) => `
      <div class="image-card">
        <a href="${image.largeImageURL}" target="_blank">
          <img src="${image.webformatURL}" alt="${image.tags}">
        </a>
        <div class="info">
          <p>Likes <span>${image.likes}</span></p>
          <p>Views <span>${image.views}</span></p>
          <p>Comments <span>${image.comments}</span></p>
          <p>Downloads <span>${image.downloads}</span></p>
        </div>
      </div>`
    )
    .join("");

    galleryElement.insertAdjacentHTML("beforeend", markup);
  lightbox.refresh();
}

export function showLoader(loaderElement) {
  loaderElement.classList.remove("hidden");
}

export function hideLoader(loaderElement) {
  loaderElement.classList.add("hidden");
}

export function showLoadMoreButton(buttonElement) {
  buttonElement.style.display = "inline-block";
}

export function hideLoadMoreButton(buttonElement) {
  buttonElement.style.display = "none";
}

export function showEndMessage(messageElement) {
  messageElement.style.display = "block";
}

export function hideEndMessage(messageElement) {
  messageElement.style.display = "none";
}