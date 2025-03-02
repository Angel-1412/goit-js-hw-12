import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { fetchImages } from "./js/pixabay-api";
import { renderGallery, showLoader, hideLoader } from "./js/render-function";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const gallery = document.querySelector(".gallery");
  const loader = document.getElementById("loader");
  const loadMoreBtn = document.getElementById("load-more");
  const endMessage = document.getElementById("end-message");

  if (!form || !input || !gallery || !loader || !loadMoreBtn || !endMessage) {
    console.error("Один або кілька елементів не знайдено в DOM!");
    return;
  }

  let query = "";
  let page = 1;
  let totalHits = 0;
  let loadedItems = 0;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    query = input.value.trim();
    page = 1;
    loadedItems = 0;

    if (query === "") {
      iziToast.warning({
        message: "Поле пошуку не може бути порожнім!",
        position: "topRight",
      });
      return;
    }

    gallery.innerHTML = "";
    loadMoreBtn.classList.add("hidden");
    showLoader(loader);

    try {
      const response = await fetchImages(query, page);
      const hits = response.hits;
      totalHits = response.totalHits;

      if (totalHits === 0) {
        iziToast.info({
          message: "Sorry, there are no images matching your search query. Please try again!",
          position: "topRight",
        });
        hideLoader(loader);
        return;
      }

      renderGallery(hits, gallery, true);
      loadedItems += hits.length;

      if (loadedItems < totalHits) {
        loadMoreBtn.classList.remove("hidden");
      } else {
        loadMoreBtn.classList.add("hidden");
        endMessage.style.display = "block";
      }
    } catch (error) {
      iziToast.error({
        title: "❌ Помилка",
        message: "Не вдалося виконати запит. Спробуйте ще раз!",
        position: "topRight",
      });
    } finally {
      hideLoader(loader);
    }
  });

  loadMoreBtn.addEventListener("click", async () => {
    page += 1;
    showLoader(loader);

    try {
      const response = await fetchImages(query, page);
      const hits = response.hits;

      if (hits.length === 0) {
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: "topRight",
        });
        loadMoreBtn.classList.add("hidden");
        return;
      }

      renderGallery(hits, gallery);
      loadedItems += hits.length;

      const cardHeight = document.querySelector(".image-card")?.getBoundingClientRect().height || 0;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });

      if (loadedItems >= totalHits) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
      loadMoreBtn.classList.add("hidden");
    } else {
      loadMoreBtn.classList.remove("hidden");
    }
    } catch (error) {
      iziToast.error({
        title: "❌ Помилка",
        message: "Не вдалося завантажити більше зображень. Спробуйте ще раз!",
        position: "topRight",
      });
    } finally {
      hideLoader(loader);
    }
  });
});
