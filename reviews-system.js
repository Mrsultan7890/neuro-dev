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
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = star.dataset.rating;
            stars.forEach((s, i) => {
                s.classList.toggle('active', i < rating);
            });
            modal.dataset.rating = rating;
        });
        
        star.addEventListener('mouseover', () => {
            const rating = star.dataset.rating;
            stars.forEach((s, i) => {
                s.style.color = i < rating ? '#ffd700' : '#333';
            });
        });
    });
    
    // Reset on mouse leave
    modal.querySelector('.star-rating').addEventListener('mouseleave', () => {
        const currentRating = modal.dataset.rating || 0;
        stars.forEach((s, i) => {
            s.style.color = i < currentRating ? '#ffd700' : '#333';
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
        showNotification('Please select a rating', 'error');
        return;
    }
    
    if (!reviewText.trim()) {
        showNotification('Please write a review', 'error');
        return;
    }
    
    try {
        reviewsSystem.addReview(courseId, rating, reviewText, userName);
        updateCourseRatings();
        displayAllReviews(); // Refresh reviews display
        closeReviewModal();
        showNotification('Review submitted successfully!', 'success');
    } catch (error) {
        console.error('Error submitting review:', error);
        showNotification('Error submitting review', 'error');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'error' ? '#ff6b6b' : '#00ff41'};
        color: ${type === 'error' ? '#fff' : '#000'};
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10001;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
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

// Display all reviews function
function displayAllReviews() {
    const reviewsContainer = document.getElementById('reviews-display');
    if (!reviewsContainer) return;
    
    const allReviews = [];
    
    // Collect all reviews from all courses
    Object.keys(reviewsSystem.reviews).forEach(courseId => {
        const courseReviews = reviewsSystem.reviews[courseId];
        courseReviews.forEach(review => {
            allReviews.push({
                ...review,
                courseId: courseId,
                courseName: getCourseNameById(courseId)
            });
        });
    });
    
    // Sort by date (newest first)
    allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (allReviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="no-reviews">Abhi tak koi review nahi hai. Pehla review aap diye!</p>';
        return;
    }
    
    // Display reviews
    reviewsContainer.innerHTML = allReviews.slice(0, 6).map(review => {
        const reviewText = review.review.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        return `
        <div class="user-review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <strong>${review.userName}</strong>
                    <span class="course-name">${review.courseName}</span>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
            </div>
            <div class="review-text">
                <p>"${reviewText}"</p>
            </div>
            <div class="review-footer">
                <span class="review-date">${review.date}</span>
                <button class="helpful-btn" onclick="markReviewHelpful('${review.courseId}', ${review.id})">
                    <i class="fas fa-thumbs-up"></i> Helpful (${review.helpful || 0})
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// Get course name by ID
function getCourseNameById(courseId) {
    const courseNames = {
        'termux-basics': 'Termux Basics',
        'termux-advanced': 'Termux Advanced',
        'nethunter-rootless': 'NetHunter Rootless',
        'nethunter-tools': 'NetHunter Tools',
        'networking': 'Networking Course',
        'web-security': 'Web App Security',
        'mobile-osint': 'Mobile Security & OSINT',
        'nethunter-troubleshooting': 'NetHunter Troubleshooting',
        'python-complete': 'Complete Python Programming',
        'python-basics-kids': 'Python for Kids',
        'hands-on-ml-scikit-learn': 'Hands-On ML with Scikit-Learn',
        'python-ai-ml': 'Python for AI/ML'
    };
    return courseNames[courseId] || 'Unknown Course';
}

// Mark review as helpful
function markReviewHelpful(courseId, reviewId) {
    reviewsSystem.markHelpful(courseId, reviewId);
    displayAllReviews(); // Refresh display
    showNotification('Review marked as helpful!', 'success');
}

// Update ratings on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        updateCourseRatings();
        displayAllReviews();
    }, 1000);
});