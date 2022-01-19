import './sass/main.scss';
import PicturesApi from './fetch.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

//
//
const form = document.querySelector('#search-form');
const inputEl = form.querySelector('input');
const gallerys = document.querySelector('.gallery');
const btnLoadMore = document.querySelectorAll('button')[1];

const InfiniteScroll = require('infinite-scroll');
let gallery = new SimpleLightbox('.gallery a');
const picturesApi = new PicturesApi();
//
//
form.addEventListener('submit', SubmFunc);
btnLoadMore.addEventListener('click', loadMorePictures);

//
function SubmFunc(event) {
  event.preventDefault();
  picturesApi.inputValue = form.elements.searchQuery.value;
  picturesApi.resetPage();
  clearPage();

  //
  picturesApi
    .fetchPictures()
    .then(post => {
      if (post.total === 0) {
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.',
        );
        btnLoadMore.classList.add('js-hidden');
        return;
      } else {
        btnLoadMore.classList.remove('js-hidden');
        renderPictures(post);
        new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250,
        });
        smoothScroll();
      }
      if (checkCollection(post)) return;
    })
    .catch(err => {
      alert('Oops, error:'`${err}`);
    });
}

function clearPage() {
  gallerys.innerHTML = '';
}

function renderPictures(post) {
  gallerys.innerHTML = makeMarkup(post.hits);
}

function makeMarkup(imagesObj) {
  return imagesObj
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
          <a class="img-link" href="${largeImageURL}"><img class="img-item" src="${webformatURL}" alt="${tags}" loading="lazy"/>
          </a>
          <div class="info">
            <p class="info-item">
              <b class="info-b">Likes <br/> <span class="info-span"> ${likes}<span></b>
            </p>
            <p class="info-item">
              <b class="info-b">Views <span class="info-span">${views}<span></b>
            </p>
            <p class="info-item">
              <b class="info-b">Comments <span class="info-span">${comments}<span></b>
            </p>
            <p class="info-item">
              <b class="info-b">Downloads <span class="info-span">${downloads}<span></b>
            </p>
          </div>
        </div>`;
    })
    .join('');
}

function loadMorePictures() {
  picturesApi.fetchPictures().then(post => {
    gallerys.insertAdjacentHTML('beforeend', makeMarkup(post.hits));
    smoothScroll();
    if (checkCollection(post)) return;
  });
}

function checkCollection(post) {
  if (Math.ceil(post.totalHits / 40) <= picturesApi.page - 1) {
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    return true;
  }
  return false;
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 1,
    behavior: 'smooth',
  });
}

document.addEventListener('scroll', handleScroll);

function handleScroll(e) {
  let topHeight = document.documentElement.scrollTop;
  let clHeight = document.documentElement.clientHeight;
  let scrHeight = document.documentElement.scrollHeight;
  if (Math.round(clHeight + topHeight) === scrHeight) {
    loadMorePictures();
  }
}
