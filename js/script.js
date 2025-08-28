document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
    });
  }

  // メインビジュアルのスライドショー
  let mainSlideIndex = 0;
  function showMainSlides() {
    const slides = document.querySelectorAll(".main-visual .slide");
    slides.forEach(slide => (slide.style.display = "none"));
    mainSlideIndex++;
    if (mainSlideIndex > slides.length) mainSlideIndex = 1;
    slides[mainSlideIndex - 1].style.display = "block";
    setTimeout(showMainSlides, 5000); // 5秒ごとに切り替え
  }
  showMainSlides();

  // 施設紹介のスライドショー
  let facilitySlideIndex = 0;
  function showFacilitySlides() {
    const slides = document.querySelectorAll(".facility-slideshow .slide");
    slides.forEach(slide => (slide.style.display = "none"));
    facilitySlideIndex++;
    if (facilitySlideIndex > slides.length) facilitySlideIndex = 1;
    slides[facilitySlideIndex - 1].style.display = "block";
    setTimeout(showFacilitySlides, 5000); // 5秒ごとに切り替え
  }
  showFacilitySlides();
});
