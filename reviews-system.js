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
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const headerTitle = document.createElement('h3');
    const starIcon = document.createElement('i');
    starIcon.className = 'fas fa-star';
    headerTitle.appendChild(starIcon);
    headerTitle.appendChild(document.createTextNode(' Course Review'));
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '×';
    closeBtn.onclick = closeReviewModal;
    
    modalHeader.appendChild(headerTitle);
    modalHeader.appendChild(closeBtn);
    
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    // Rating section
    const ratingSection = document.createElement('div');
    ratingSection.className = 'rating-section';
    
    const ratingLabel = document.createElement('label');
    ratingLabel.textContent = 'Rating:';
    
    const starRating = document.createElement('div');
    starRating.className = 'star-rating';
    starRating.id = 'star-rating';
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.dataset.rating = i;
        star.textContent = '★';
        starRating.appendChild(star);
    }
    
    ratingSection.appendChild(ratingLabel);
    ratingSection.appendChild(starRating);
    
    // Review section
    const reviewSection = document.createElement('div');
    reviewSection.className = 'review-section';
    
    const reviewLabel = document.createElement('label');
    reviewLabel.setAttribute('for', 'review-text');
    reviewLabel.textContent = 'Review (Roman Urdu mein):';
    
    const reviewTextarea = document.createElement('textarea');
    reviewTextarea.id = 'review-text';
    reviewTextarea.placeholder = 'Apna experience share kariye...';
    
    reviewSection.appendChild(reviewLabel);
    reviewSection.appendChild(reviewTextarea);
    
    // Name section
    const nameSection = document.createElement('div');
    nameSection.className = 'name-section';
    
    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'user-name');
    nameLabel.textContent = 'Name (Optional):';
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'user-name';
    nameInput.placeholder = 'Anonymous';
    
    nameSection.appendChild(nameLabel);
    nameSection.appendChild(nameInput);
    
    // Modal actions
    const modalActions = document.createElement('div');
    modalActions.className = 'modal-actions';
    
    const submitBtn = document.createElement('button');
    submitBtn.className = 'submit-btn';
    submitBtn.textContent = 'Submit Review';
    submitBtn.onclick = () => submitReview(courseId);
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-btn';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = closeReviewModal;
    
    modalActions.appendChild(submitBtn);
    modalActions.appendChild(cancelBtn);
    
    modalBody.appendChild(ratingSection);
    modalBody.appendChild(reviewSection);
    modalBody.appendChild(nameSection);
    modalBody.appendChild(modalActions);
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    
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
    
    // Display reviews safely
    reviewsContainer.innerHTML = '';
    
    allReviews.slice(0, 6).forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'user-review-card';
        
        const reviewHeader = document.createElement('div');
        reviewHeader.className = 'review-header';
        
        const reviewerInfo = document.createElement('div');
        reviewerInfo.className = 'reviewer-info';
        
        const userName = document.createElement('strong');
        userName.textContent = review.userName;
        
        const courseName = document.createElement('span');
        courseName.className = 'course-name';
        courseName.textContent = review.courseName;
        
        reviewerInfo.appendChild(userName);
        reviewerInfo.appendChild(courseName);
        
        const reviewRating = document.createElement('div');
        reviewRating.className = 'review-rating';
        reviewRating.innerHTML = generateStars(review.rating);
        
        reviewHeader.appendChild(reviewerInfo);
        reviewHeader.appendChild(reviewRating);
        
        const reviewText = document.createElement('div');
        reviewText.className = 'review-text';
        
        const reviewPara = document.createElement('p');
        reviewPara.textContent = `"${review.review}"`;
        reviewText.appendChild(reviewPara);
        
        const reviewFooter = document.createElement('div');
        reviewFooter.className = 'review-footer';
        
        const reviewDate = document.createElement('span');
        reviewDate.className = 'review-date';
        reviewDate.textContent = review.date;
        
        const helpfulBtn = document.createElement('button');
        helpfulBtn.className = 'helpful-btn';
        helpfulBtn.onclick = () => markReviewHelpful(review.courseId, review.id);
        
        const thumbIcon = document.createElement('i');
        thumbIcon.className = 'fas fa-thumbs-up';
        helpfulBtn.appendChild(thumbIcon);
        helpfulBtn.appendChild(document.createTextNode(` Helpful (${review.helpful || 0})`));
        
        reviewFooter.appendChild(reviewDate);
        reviewFooter.appendChild(helpfulBtn);
        
        reviewCard.appendChild(reviewHeader);
        reviewCard.appendChild(reviewText);
        reviewCard.appendChild(reviewFooter);
        
        reviewsContainer.appendChild(reviewCard);
    });
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