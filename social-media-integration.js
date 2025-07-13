/**
 * Social Media Integration for Crypto Trading Game
 * Junior Blockchain Education Consortium of the Philippines - TIP MNL
 * 
 * This module implements mandatory social media engagement before game access
 * Required actions: Page like + Post sharing with specific hashtags
 */

// Social Media Gate Configuration
const SOCIAL_CONFIG = {
    FACEBOOK_APP_ID: 'YOUR_FACEBOOK_APP_ID',
    FACEBOOK_PAGE_ID: 'YOUR_PAGE_ID', // JBECP TIP MNL Page ID
    REQUIRED_HASHTAGS: ['#JBECPTIPWAVE', '#JBECP'],
    VERIFICATION_EXPIRY_DAYS: 30,
    ORGANIZATION_NAME: 'Junior Blockchain Education Consortium of the Philippines - TIP MNL'
};

// Social Media Gate State Management
const socialMediaGate = {
    requirements: {
        pageLike: false,
        postShared: false,
        hashtagsUsed: false
    },
    
    // Check if all requirements are met
    checkRequirements() {
        return Object.values(this.requirements).every(req => req === true);
    },
    
    // Update requirement status
    updateRequirement(type, status) {
        this.requirements[type] = status;
        this.updateUI();
        this.checkUnlockCondition();
    },
    
    // Update UI based on current requirements
    updateUI() {
        Object.keys(this.requirements).forEach(req => {
            const checkbox = document.getElementById(`${req}Checkbox`);
            const button = document.getElementById(`${req}Button`);
            
            if (checkbox) checkbox.checked = this.requirements[req];
            if (button && this.requirements[req]) {
                button.disabled = true;
                button.textContent = '✓ Completed';
                button.classList.add('completed');
            }
        });
    },
    
    // Check if game can be unlocked
    checkUnlockCondition() {
        const verifyBtn = document.getElementById('verifyGameAccess');
        const allComplete = this.checkRequirements();
        
        verifyBtn.disabled = !allComplete;
        verifyBtn.classList.toggle('ready', allComplete);
        
        if (allComplete) {
            verifyBtn.textContent = '🚀 Access Game Now!';
        }
    },
    
    // Unlock the game
    unlockGame() {
        if (this.checkRequirements()) {
            // Store verification with timestamp
            localStorage.setItem('socialVerified', 'true');
            localStorage.setItem('verificationDate', new Date().toISOString());
            localStorage.setItem('verificationData', JSON.stringify(this.requirements));
            
            // Hide social gate and show game
            document.getElementById('socialGate').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'block';
            
            // Initialize game
            if (typeof initGame === 'function') {
                initGame();
            }
            
            // Track successful verification
            this.trackEvent('social_verification_complete');
            
            // Show success message
            this.showSuccessMessage();
        }
    },
    
    // Show success message after verification
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'verification-success';
        message.innerHTML = `
            <div class="success-content">
                <h3>🎉 Welcome to the Crypto Trading Game!</h3>
                <p>Thank you for supporting JBECP TIP MNL!</p>
                <p>Your game access is now active.</p>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    },
    
    // Track analytics events
    trackEvent(eventName, data = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': 'social_engagement',
                'event_label': 'jbecp_tip_mnl',
                ...data
            });
        }
    }
};

// Facebook SDK Integration
window.fbAsyncInit = function() {
    FB.init({
        appId: SOCIAL_CONFIG.FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
    });
    
    // Check login status on init
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            checkExistingLike();
        }
    });
};

// Load Facebook SDK
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Facebook Page Like Function
function likePage() {
    FB.login(function(response) {
        if (response.authResponse) {
            // Check if user liked the page
            FB.api(`/me/likes/${SOCIAL_CONFIG.FACEBOOK_PAGE_ID}`, function(response) {
                if (response.data && response.data.length > 0) {
                    socialMediaGate.updateRequirement('pageLike', true);
                    socialMediaGate.trackEvent('page_like_completed');
                } else {
                    // Redirect to page for manual like
                    window.open(`https://www.facebook.com/${SOCIAL_CONFIG.FACEBOOK_PAGE_ID}`, '_blank');
                    
                    // Show instruction modal
                    showLikeInstructionModal();
                }
            });
        }
    }, {scope: 'user_likes'});
}

// Check if user already liked the page
function checkExistingLike() {
    FB.api(`/me/likes/${SOCIAL_CONFIG.FACEBOOK_PAGE_ID}`, function(response) {
        if (response.data && response.data.length > 0) {
            socialMediaGate.updateRequirement('pageLike', true);
        }
    });
}

// Show instruction modal for manual like
function showLikeInstructionModal() {
    const modal = document.createElement('div');
    modal.className = 'instruction-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Please Like Our Page</h3>
            <p>1. Like the "${SOCIAL_CONFIG.ORGANIZATION_NAME}" page</p>
            <p>2. Return to this page</p>
            <p>3. Click "Verify Like" to continue</p>
            <button onclick="verifyLike()" class="verify-btn">Verify Like</button>
            <button onclick="this.parentElement.parentElement.remove()" class="close-btn">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Verify page like manually
function verifyLike() {
    FB.api(`/me/likes/${SOCIAL_CONFIG.FACEBOOK_PAGE_ID}`, function(response) {
        if (response.data && response.data.length > 0) {
            socialMediaGate.updateRequirement('pageLike', true);
            document.querySelector('.instruction-modal').remove();
        } else {
            alert('Please like our page first, then try again.');
        }
    });
}

// Share Post Function
function sharePost() {
    const shareContent = {
        method: 'share',
        href: window.location.href,
        quote: `🚀 Just discovered this amazing crypto trading game! Test your prediction skills and learn about market trends with ${SOCIAL_CONFIG.ORGANIZATION_NAME}! ${SOCIAL_CONFIG.REQUIRED_HASHTAGS.join(' ')}`
    };
    
    FB.ui(shareContent, function(response) {
        if (response && !response.error_message) {
            // Verify hashtags in the shared content
            if (verifyHashtags(shareContent.quote)) {
                socialMediaGate.updateRequirement('postShared', true);
                socialMediaGate.updateRequirement('hashtagsUsed', true);
                socialMediaGate.trackEvent('post_shared_completed');
            }
        } else {
            console.error('Share failed:', response);
        }
    });
}

// Verify required hashtags
function verifyHashtags(content) {
    return SOCIAL_CONFIG.REQUIRED_HASHTAGS.every(hashtag => 
        content.toLowerCase().includes(hashtag.toLowerCase())
    );
}

// Alternative sharing methods for other platforms
function shareToTwitter() {
    const text = encodeURIComponent(`🚀 Just discovered this amazing crypto trading game! Test your prediction skills and learn about market trends with ${SOCIAL_CONFIG.ORGANIZATION_NAME}! ${SOCIAL_CONFIG.REQUIRED_HASHTAGS.join(' ')}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    
    // Manual verification required
    setTimeout(() => {
        if (confirm('Did you successfully post with the required hashtags?')) {
            socialMediaGate.updateRequirement('postShared', true);
            socialMediaGate.updateRequirement('hashtagsUsed', true);
        }
    }, 3000);
}

function shareToLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Crypto Trading Game - JBECP TIP MNL');
    const summary = encodeURIComponent(`Test your crypto prediction skills! ${SOCIAL_CONFIG.REQUIRED_HASHTAGS.join(' ')}`);
    
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank');
    
    // Manual verification required
    setTimeout(() => {
        if (confirm('Did you successfully post with the required hashtags?')) {
            socialMediaGate.updateRequirement('postShared', true);
            socialMediaGate.updateRequirement('hashtagsUsed', true);
        }
    }, 3000);
}

// Verification persistence check
function checkExistingVerification() {
    const isVerified = localStorage.getItem('socialVerified');
    const verificationDate = localStorage.getItem('verificationDate');
    
    if (isVerified && verificationDate) {
        const daysSinceVerification = (new Date() - new Date(verificationDate)) / (1000 * 60 * 60 * 24);
        
        if (daysSinceVerification < SOCIAL_CONFIG.VERIFICATION_EXPIRY_DAYS) {
            // Valid verification exists
            return true;
        } else {
            // Verification expired
            localStorage.removeItem('socialVerified');
            localStorage.removeItem('verificationDate');
            localStorage.removeItem('verificationData');
            return false;
        }
    }
    
    return false;
}

// Initialize social media gate
function initSocialGate() {
    if (checkExistingVerification()) {
        // Skip social gate
        document.getElementById('socialGate').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        
        // Initialize game directly
        if (typeof initGame === 'function') {
            initGame();
        }
    } else {
        // Show social gate
        document.getElementById('socialGate').style.display = 'flex';
        document.getElementById('gameContainer').style.display = 'none';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initSocialGate();
    
    // Bind social action buttons
    const likeBtn = document.getElementById('likePageButton');
    const shareBtn = document.getElementById('sharePostButton');
    const verifyBtn = document.getElementById('verifyGameAccess');
    
    if (likeBtn) likeBtn.addEventListener('click', likePage);
    if (shareBtn) shareBtn.addEventListener('click', sharePost);
    if (verifyBtn) verifyBtn.addEventListener('click', () => socialMediaGate.unlockGame());
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { socialMediaGate, SOCIAL_CONFIG };
}
