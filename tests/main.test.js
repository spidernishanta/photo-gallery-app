test("Sanity check", () => {
    expect(true).toBe(true);
});

test('test passed', () => {
    const gallery = new PhotoGalleryApp();
    expect(gallery).toBeInstanceOf(PhotoGalleryApp);
});