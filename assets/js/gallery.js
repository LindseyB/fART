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

// Add lightbox CSS
const lightboxCSS = `
<style>
.art-lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.art-lightbox-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.art-lightbox-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.art-lightbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  padding: 0 4rem;
}

.art-lightbox-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  display: block;
}

.art-lightbox-info {
  padding: 1.5rem;
  text-align: center;
  width: 100%;
  background: white;
}

.art-lightbox-title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.art-lightbox-number {
  margin: 0 0 1rem;
  color: #718096;
  font-size: 0.875rem;
}

.art-lightbox-download {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.3s ease;
}

.art-lightbox-download:hover {
  background: #5a67d8;
}

.art-lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.3s ease;
}

.art-lightbox-close:hover {
  background: rgba(0, 0, 0, 0.8);
}

.art-lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.art-lightbox-nav:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.art-lightbox-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.art-lightbox-prev {
  left: 1rem;
}

.art-lightbox-next {
  right: 1rem;
}

@media (max-width: 768px) {
  .art-lightbox-container {
    max-width: 95vw;
    max-height: 95vh;
  }

  .art-lightbox-content {
    padding: 0 3rem;
  }

  .art-lightbox-image {
    max-height: 60vh;
  }

  .art-lightbox-info {
    padding: 1rem;
  }

  .art-lightbox-nav {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .art-lightbox-prev {
    left: 0.5rem;
  }

  .art-lightbox-next {
    right: 0.5rem;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', lightboxCSS);
