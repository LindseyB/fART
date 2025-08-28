// Simple lightbox functionality
class ArtGalleryLightbox {
  constructor() {
    this.createLightbox();
    this.attachEventListeners();
  }

  createLightbox() {
    const lightboxHTML = `
      <div id="art-lightbox" class="art-lightbox" style="display: none;">
        <div class="art-lightbox-overlay"></div>
        <div class="art-lightbox-container">
          <button class="art-lightbox-close">&times;</button>
          <div class="art-lightbox-content">
            <img class="art-lightbox-image" alt="">
            <div class="art-lightbox-info">
              <h3 class="art-lightbox-title"></h3>
              <p class="art-lightbox-number"></p>
              <a class="art-lightbox-download" href="" target="_blank">View Full Size</a>
            </div>
          </div>
          <button class="art-lightbox-nav art-lightbox-prev">‹</button>
          <button class="art-lightbox-nav art-lightbox-next">›</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
  }

  attachEventListeners() {
    const lightbox = document.getElementById('art-lightbox');
    const galleryLinks = document.querySelectorAll('.art-gallery-link');

    // Convert gallery links to array for navigation
    this.galleryItems = Array.from(galleryLinks);

    // Add click listeners to gallery items
    galleryLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.openLightbox(index);
      });
    });

    // Close lightbox event listeners
    lightbox.querySelector('.art-lightbox-close').addEventListener('click', () => this.closeLightbox());
    lightbox.querySelector('.art-lightbox-overlay').addEventListener('click', () => this.closeLightbox());

    // Navigation event listeners
    lightbox.querySelector('.art-lightbox-prev').addEventListener('click', () => this.navigateImage(-1));
    lightbox.querySelector('.art-lightbox-next').addEventListener('click', () => this.navigateImage(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.style.display || lightbox.style.display === 'none') return;

      switch(e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.navigateImage(-1);
          break;
        case 'ArrowRight':
          this.navigateImage(1);
          break;
      }
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    const lightbox = document.getElementById('art-lightbox');

    this.updateLightboxContent();
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Focus management for accessibility
    setTimeout(() => {
      lightbox.querySelector('.art-lightbox-close').focus();
    }, 100);
  }

  closeLightbox() {
    const lightbox = document.getElementById('art-lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  navigateImage(direction) {
    this.currentIndex += direction;

    if (this.currentIndex < 0) {
      this.currentIndex = this.galleryItems.length - 1;
    } else if (this.currentIndex >= this.galleryItems.length) {
      this.currentIndex = 0;
    }

    this.updateLightboxContent();
  }

  updateLightboxContent() {
    const currentItem = this.galleryItems[this.currentIndex];
    const lightbox = document.getElementById('art-lightbox');

    const img = currentItem.querySelector('.art-gallery-image');
    const title = currentItem.querySelector('.art-gallery-title');
    const number = currentItem.querySelector('.art-gallery-number');
    const fullSizeUrl = currentItem.href;

    // Update lightbox content
    lightbox.querySelector('.art-lightbox-image').src = img.src.replace('&w=500&h=500', '&w=800&h=800');
    lightbox.querySelector('.art-lightbox-image').alt = img.alt;
    lightbox.querySelector('.art-lightbox-title').textContent = title.textContent;
    lightbox.querySelector('.art-lightbox-number').textContent = number.textContent;
    lightbox.querySelector('.art-lightbox-download').href = fullSizeUrl;

    // Update navigation button states
    const prevBtn = lightbox.querySelector('.art-lightbox-prev');
    const nextBtn = lightbox.querySelector('.art-lightbox-next');

    prevBtn.style.opacity = this.galleryItems.length > 1 ? '1' : '0.5';
    nextBtn.style.opacity = this.galleryItems.length > 1 ? '1' : '0.5';
    prevBtn.disabled = this.galleryItems.length <= 1;
    nextBtn.disabled = this.galleryItems.length <= 1;
  }
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelectorAll('.art-gallery-link').length > 0) {
    new ArtGalleryLightbox();
  }
});
