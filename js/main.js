class PhotoGalleryApp {
    constructor() {
        this.API_KEY = 'T0hrX9mdzSK85Q9mHxDoNnRuzpueIrB1loiURxZvnICNKMktJUJVPd95';
        this.galleryDIv = document.querySelector('.gallery');
        this.searchForm = document.querySelector('.header form');
        this.loadMore = document.querySelector('.load-more');
        this.logo = document.querySelector('.logo');
        this.pageIndex = 1;
        this.searchValueGlobal = '';
        this.eventHandler();
    }
    // eventHandler for events
    eventHandler() {
        document.addEventListener('DOMContentLoaded', () => {
            this.getImges(1);
        });

        //searching the images
        this.searchForm.addEventListener('submit', (e) => {
            this.pageIndex = 1;
            this.getSearchedImages(e);
        });

        //loading more images
        this.loadMore.addEventListener('click', (e) => {
            this.loadMoreImages(e);
        });

        this.logo.addEventListener('click', () => {
            this.pageIndex = 1;
            this.galleryDIv.innerHTML = '';
            this.getImges(this.pageIndex);
        });
    }

    //getting the images using pexels api
    async getImges(index) {
        this.loadMore.setAttribute('data-img', 'curated');
        const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=9 `;
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);
    }

    //fetching of images
    async fetchImages(baseURL) {
        const response = await fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: this.API_KEY
            }
        });
        const data = await response.json();
        // console.log(data);
        return data;
    }

    //generation of HTML for displaying the images
    GenerateHTML(photos) {
        photos.forEach(photo => {
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                <a href='${photo.src.large}' data-lightbox="mygallery" data-title="<br/>Name: ${photo.alt}
                 <br/><br/>ID: ${photo.id}
                 <br/><br/>Dimensions: ${photo.width}x${photo.height}">
                 <img src="${photo.src.medium}">
                  
                  <h3>${photo.photographer}</h3>
                </a>
                `;
            this.galleryDIv.appendChild(item);
        });
    }

    //getting searched images using pexels api
    async getSearchedImages(e) {
        this.loadMore.setAttribute('data-img', 'search');
        e.preventDefault();
        this.galleryDIv.innerHTML = '';
        const searchValue = e.target.querySelector('input').value;
        this.searchValueGlobal = searchValue;
        const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=9`
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);
        e.target.reset();
    }

    //getting more searched images
    async getMoreSearchedImages(index) {
        const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=9`
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);
    }

    //loading more images
    loadMoreImages(e) {
        let index = ++this.pageIndex;
        const loadMoreData = e.target.getAttribute('data-img');
        if (loadMoreData === 'curated') {
            // load next page for curated]
            this.getImges(index)
        } else {
            // load next page for search
            this.getMoreSearchedImages(index);
        }
    }
}

const gallery = new PhotoGalleryApp;