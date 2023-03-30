describe('PhotoGalleryApp', () => {
  let gallery;

  beforeEach(() => {
    gallery = new PhotoGalleryApp();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('eventHandler', () => {
    it('should call getImges on DOMContentLoaded', () => {
      const getImgesSpy = jest.spyOn(gallery, 'getImges');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      expect(getImgesSpy).toHaveBeenCalledWith(1);
    });

    it('should call getSearchedImages on searchForm submit', () => {
      const getSearchedImagesSpy = jest.spyOn(gallery, 'getSearchedImages');
      const form = gallery.searchForm;
      const input = form.querySelector('input');
      input.value = 'nature';
      form.dispatchEvent(new Event('submit'));
      expect(getSearchedImagesSpy).toHaveBeenCalled();
    });

    it('should call loadMoreImages on loadMore click', () => {
      const loadMoreImagesSpy = jest.spyOn(gallery, 'loadMoreImages');
      const button = gallery.loadMore;
      button.dispatchEvent(new Event('click'));
      expect(loadMoreImagesSpy).toHaveBeenCalled();
    });

    it('should call getImges on logo click', () => {
      const getImgesSpy = jest.spyOn(gallery, 'getImges');
      const logo = gallery.logo;
      logo.dispatchEvent(new Event('click'));
      expect(getImgesSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('getImges', () => {
    it('should fetch images from Pexels API', async () => {
      const mockData = { photos: [{ id: 1, src: { medium: 'img1.jpg' } }, { id: 2, src: { medium: 'img2.jpg' } }] };
      jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({ json: () => Promise.resolve(mockData) }));
      const generateHTMLSpy = jest.spyOn(gallery, 'GenerateHTML');
      await gallery.getImges(1);
      expect(fetch).toHaveBeenCalledWith('https://api.pexels.com/v1/curated?page=1&per_page=9', {
        method: 'GET',
        headers: { Accept: 'application/json', Authorization: gallery.API_KEY },
      });
      expect(generateHTMLSpy).toHaveBeenCalledWith(mockData.photos);
    });
  });

  describe('getSearchedImages', () => {
    it('should fetch searched images from Pexels API', async () => {
      const mockData = { photos: [{ id: 1, src: { medium: 'img1.jpg' } }, { id: 2, src: { medium: 'img2.jpg' } }] };
      jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({ json: () => Promise.resolve(mockData) }));
      const generateHTMLSpy = jest.spyOn(gallery, 'GenerateHTML');
      const form = gallery.searchForm;
      const input = form.querySelector('input');
      input.value = 'nature';
      await gallery.getSearchedImages(new Event('submit'));
      expect(fetch).toHaveBeenCalledWith('https://api.pexels.com/v1/search?query=nature&page=1&per_page=9', {
        method: 'GET',
        headers: { Accept: 'application/json', Authorization: gallery.API_KEY },
      });
      expect(generateHTMLSpy).toHaveBeenCalledWith(mockData.photos);
    });
