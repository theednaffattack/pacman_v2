export function createImage(src: string) {
  const image = new Image();
  image.src = src;
  // image.onload = function () {
  //   console.log("LOADED: ", src);
  // };
  return image;
}
