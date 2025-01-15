// DOM Elements
const fileInput = document.querySelector(".file-input");
const previewImg = document.querySelector(".preview-img img");
const chooseImgBtn = document.querySelector(".choose-img");
const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const rotateOptions = document.querySelectorAll(".rotate button");
const resetFilterBtn = document.querySelector(".reset-filter");
const saveBtn = document.querySelector(".save-img");
const resizeImgBtn = document.querySelector(".resizeImage");
const imgResizerElm = document.querySelector(".imageResizer");
const widthInput = document.querySelector(".width input");
const heightInput = document.querySelector(".height input");
const ratioInput = document.querySelector(".ratio input");
const qualityInput = document.querySelector(".quality input");
const removeBgButton = document.getElementById("remove-bg");
const loadingSpinner = document.querySelector(".loading-spinner");

// API Key for Remove.bg
const apiKey = "API KEY HERE";

// Filter and transformation settings
let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0,
  contrast = 100,
  hueRotate = 0;

let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1,
  ogImgRatio;

// ** Functions **

// * Apply filters to the image
const applyFilters = () => {
  previewImg.style.filter = `
    brightness(${brightness}%) 
    saturate(${saturation}%) 
    invert(${inversion}%) 
    grayscale(${grayscale}%) 
    contrast(${contrast}%) 
    hue-rotate(${hueRotate}deg)`;
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
};

// * Load and display the selected image
const loadImage = () => {
  const file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    resetFilter();
    widthInput.value = previewImg.naturalWidth;
    heightInput.value = previewImg.naturalHeight;
    ogImgRatio = previewImg.naturalWidth / previewImg.naturalHeight;
    document.querySelector(".container").classList.remove("disable");
    resizeImgBtn.classList.add("active");
  });
};

// * Update filters based on user input
const updateFilter = () => {
  filterValue.innerText = filterSlider.value + (filterName.innerText === "Hue Rotate" ? "°" : "%");
  const selectedFilter = document.querySelector(".filter .active");

  switch (selectedFilter.id) {
    case "brightness":
      brightness = filterSlider.value;
      break;
    case "saturation":
      saturation = filterSlider.value;
      break;
    case "inversion":
      inversion = filterSlider.value;
      break;
    case "grayscale":
      grayscale = filterSlider.value;
      break;
    case "contrast":
      contrast = filterSlider.value;
      break;
    case "hue-rotate":
      hueRotate = filterSlider.value;
      break;
  }
  applyFilters();
};

// * Reset all filters
const resetFilter = () => {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  contrast = 100;
  hueRotate = 0;

  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  applyFilters();
};

// * Save the edited image
const saveImg = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = widthInput.value;
  canvas.height = heightInput.value;

  ctx.filter = `
    brightness(${brightness}%) 
    saturate(${saturation}%) 
    invert(${inversion}%) 
    grayscale(${grayscale}%) 
    contrast(${contrast}%) 
    hue-rotate(${hueRotate}deg)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);

  if (rotate !== 0) ctx.rotate((rotate * Math.PI) / 180);
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a");
  link.download = "EditedImage.jpg";
  link.href = canvas.toDataURL("image/jpeg", qualityInput.checked ? 0.7 : 1.0);
  link.click();
};

// * Handle resizing input changes
widthInput.addEventListener("input", () => {
  if (ratioInput.checked) {
    heightInput.value = Math.floor(widthInput.value / ogImgRatio);
  }
});

heightInput.addEventListener("input", () => {
  if (ratioInput.checked) {
    widthInput.value = Math.floor(heightInput.value * ogImgRatio);
  }
});

// * Remove background from the image
const removeBackground = async () => {
  if (!previewImg.src || previewImg.src.includes("image-placeholder.svg")) {
    alert("Please upload an image first!");
    return;
  }

  loadingSpinner.style.display = "block";

  try {
    const response = await fetch(previewImg.src);
    const imageBlob = await response.blob();

    const formData = new FormData();
    formData.append("image_file", imageBlob, "uploaded-image.png");
    formData.append("size", "auto");

    const removeBgResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    });

    if (!removeBgResponse.ok) {
      throw new Error("Failed to remove background. " + (await removeBgResponse.text()));
    }

    const resultBlob = await removeBgResponse.blob();
    const objectURL = URL.createObjectURL(resultBlob);

    previewImg.src = objectURL;
    alert("Background removed successfully!");
  } catch (error) {
    alert("Error removing background: " + error.message);
  } finally {
    loadingSpinner.style.display = "none";
  }
};

// ** Event listeners **
chooseImgBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveBtn.addEventListener("click", saveImg);
resizeImgBtn.addEventListener("click", () => imgResizerElm.classList.toggle("active"));
removeBgButton.addEventListener("click", removeBackground);

// * Add filter options logic
filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".filter .active")?.classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    switch (option.id) {
      case "brightness":
        filterSlider.max = "200";
        filterSlider.value = brightness;
        break;
      case "saturation":
        filterSlider.max = "200";
        filterSlider.value = saturation;
        break;
      case "inversion":
        filterSlider.max = "100";
        filterSlider.value = inversion;
        break;
      case "grayscale":
        filterSlider.max = "100";
        filterSlider.value = grayscale;
        break;
      case "contrast":
        filterSlider.max = "200";
        filterSlider.value = contrast;
        break;
      case "hue-rotate":
        filterSlider.max = "360";

        filterSlider.value = hueRotate;
        break;
    }
    filterValue.innerText = filterSlider.value;
  });
});

// * Add rotation options logic
rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    switch (option.id) {
      case "left":
        rotate -= 90;
        break;
      case "right":
        rotate += 90;
        break;
      case "horizontal":
        flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        break;
      case "vertical":
        flipVertical = flipVertical === 1 ? -1 : 1;
        break;
    }
    applyFilters();
  });
});
