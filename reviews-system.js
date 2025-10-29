// Course Reviews & Ratings System
class ReviewsSystem {
    constructor() {
        this.storageKey = 'neuro-dev-reviews';
        this.reviews = this.loadReviews();
    }

    loadReviews() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || {};
        } catch (error) {
            return {};
        }
    }

    saveReviews() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.reviews));
    }

    addReview(courseId, rating, reviewText, userName = 'Anonymous') {
        if (!this.reviews[courseId]) {
            this.reviews[courseId] = [];
        }
        
        const review = {
            id: Date.now(),
            rating: parseInt(rating),
            review: reviewText,
            userName: userName,
            date: new Date().toLocaleDateString(),
            helpful: 0
        };
        
        this.reviews[courseId].push(review);
        this.saveReviews();
        return review;
    }

    getCourseReviews(courseId) {
        return this.reviews[courseId] || [];
    }

    getAverageRating(courseId) {
        const reviews = this.getCourseReviews(courseId);
        if (reviews.length === 0) return 0;
        
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    }

    getReviewCount(courseId) {
        return this.getCourseReviews(courseId).length;
    }

    markHelpful(courseId, reviewId) {
        const reviews = this.reviews[courseId];
        if (reviews) {
            const review = reviews.find(r => r.id === reviewId);
            if (review) {
                review.helpful = (review.helpful || 0) + 1;
                this.saveReviews();
            }
        }
    }
}

// Review Modal Functions
function showReviewModal(courseId) {
    const modal = document.createElement('div');
    modal.className = 'review-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-star"></i> Course Review</h3>
                <button class="close-btn" onclick="closeReviewModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="rating-section">
                    <label>Rating:</label>
                    <div class="star-rating" id="star-rating">
                        <span class="star" data-rating="1">★</span>
                        <span class="star" data-rating="2">★</span>
                        <span class="star" data-rating="3">★</span>
                        <span class="star" data-rating="4">★</span>
                        <span class="star" data-rating="5">★</span>
                    </div>
                </div>
                <div class="review-section">
                    <label for="review-text">Review (Roman Urdu mein):</label>
                    <textarea id="review-text" placeholder="Apna experience share kariye..."></textarea>
                </div>
                <div class="name-section">
                    <label for="user-name">Name (Optional):</label>
                    <input type="text" id="user-name" placeholder="Anonymous">
                </div>
                <div class="modal-actions">
                    <button onclick="submitReview('${courseId}')" class="submit-btn">Submit Review</button>
                    <button onclick="closeReviewModal()" class="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Star rating interaction
    const stars = modal.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.dataset.rating;
            stars.forEach((s, index) => {
                s.classList.toggle('active', index < rating);
            });
            modal.dataset.rating = rating;
        });
    });
}

function closeReviewModal() {
    const modal = document.querySelector('.review-modal');
    if (modal) modal.remove();
}

function submitReview(courseId) {
    const modal = document.querySelector('.review-modal');
    const rating = modal.dataset.rating;
    const reviewText = document.getElementById('review-text').value;
    const userName = document.getElementById('user-name').value || 'Anonymous';
    
    if (!rating) {
        alert('Please select a rating');
        return;
    }
    
    if (!reviewText.trim()) {
        alert('Please write a review');
        return;
    }
    
    reviewsSystem.addReview(courseId, rating, reviewText, userName);
    updateCourseRatings();
    closeReviewModal();
    showNotification('Review submitted successfully!');
}

function updateCourseRatings() {
    document.querySelectorAll('.course-card').forEach(card => {
        const courseId = card.dataset.module;
        const avgRating = reviewsSystem.getAverageRating(courseId);
        const reviewCount = reviewsSystem.getReviewCount(courseId);
        
        let ratingElement = card.querySelector('.course-rating');
        if (!ratingElement && (avgRating > 0 || reviewCount > 0)) {
            ratingElement = document.createElement('div');
            ratingElement.className = 'course-rating';
            card.querySelector('.course-stats').appendChild(ratingElement);
        }
        
        if (ratingElement) {
            ratingElement.innerHTML = `
                <span class="rating-stars">${generateStars(avgRating)}</span>
                <span class="rating-text">${avgRating} (${reviewCount})</span>
            `;
        }
        
        // Add review button if not exists
        let reviewBtn = card.querySelector('.review-btn');
        if (!reviewBtn) {
            reviewBtn = document.createElement('button');
            reviewBtn.className = 'review-btn';
            reviewBtn.innerHTML = '<i class="fas fa-star"></i> Rate Course';
            reviewBtn.onclick = () => showReviewModal(courseId);
            card.querySelector('.course-actions').appendChild(reviewBtn);
        }
    });
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Initialize Reviews System
const reviewsSystem = new ReviewsSystem();

// Update ratings on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateCourseRatings, 1000);
});