export const getImageAttribute = (url, callback) => {
  if (!url) {
    callback(375);
    return;
  }
  let img = new Image();
  img.onload = function () {
    let width = img.width;
    let height = img.height;
    let radio = 375 / width;
    callback(height * radio);
  };
  img.onerror = function () {
    callback(375);
  };
  img.src = url;
};
export const getVideoAttribute = (url, callback) => {
  if (!url) {
    callback(375);
    return;
  }
  let videoElement = document.createElement("video");
  videoElement.src = url;
  videoElement.addEventListener("loadedmetadata", function () {
    URL.revokeObjectURL(url);
    let width = videoElement.videoWidth;
    let height = videoElement.videoHeight;
    let radio = 375 / width;
    callback(height * radio);
  });
};
