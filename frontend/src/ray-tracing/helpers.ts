export const constructImageDataFromPlainArray = (
    plainArray: number[],
    width: number,
    height: number
): ImageData => {
    const imageData = new ImageData(width, height);
    for (let i = 0; i < plainArray.length; i++) {
        imageData.data[i] = plainArray[i];
    }
    return imageData;
};
