# Crypto Trading Game - Technical Documentation

## Table of Contents
1. [Game Overview](#game-overview)
2. [Game Mechanics](#game-mechanics)
3. [User Interface Documentation](#user-interface-documentation)
4. [Technical Implementation](#technical-implementation)
5. [Social Media Integration](#social-media-integration)
6. [Game Rules](#game-rules)
7. [Code Architecture](#code-architecture)

## Game Overview

The Crypto Trading Game is a web-based prediction game where players predict whether the next candlestick will be bullish (green/up) or bearish (red/down). The game features real-time animations, interactive elements, and a scoring system based on prediction accuracy.

### Core Technologies
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Animations**: CSS Keyframes, CSS Transforms
- **Architecture**: Event-driven, State-based

## Game Mechanics

### 1. Prediction System

#### Button Functionality
```javascript
function makePrediction(prediction) {
    if (!gameState.gameActive) return;
    
    // Visual feedback for button click
    const clickedButton = prediction === 'bullish' ? 
        document.getElementById('bullishBtn') : 
        document.getElementById('bearishBtn');
    
    // Trigger click animation
    clickedButton.style.transform = 'translateY(-2px) scale(1.08)';
    setTimeout(() => {
        clickedButton.style.transform = '';
    }, 200);
    
    gameState.userPrediction = prediction;
    gameState.gameActive = false;
}
```

**Prediction Flow:**
1. User clicks "TO THE MOON" (bullish) or "BEARISH" button
2. Button triggers visual feedback animation
3. Game state updates with user prediction
4. Buttons become disabled
5. Loading message appears
6. New candle generates after 1.5 second delay
7. Prediction result calculated and displayed

### 2. Candlestick Generation Algorithm

#### Market Trend Calculation
```javascript
function calculateMarketTrend() {
    if (gameState.candles.length < 3) return 0;
    
    const recentCandles = gameState.candles.slice(-5);
    const bullishCount = recentCandles.filter(c => c.type === 'bullish').length;
    const bearishCount = recentCandles.length - bullishCount;
    
    return (bullishCount - bearishCount) / recentCandles.length;
}
```

#### Candle Generation Logic
```javascript
function generateRandomCandle() {
    const marketTrend = calculateMarketTrend();
    const trendInfluence = marketTrend * 0.3; // 30% influence
    const randomFactor = Math.random() - 0.5; // -0.5 to 0.5
    
    const isGreen = (trendInfluence + randomFactor) > 0;
    const baseHeight = 20 + Math.random() * 60;
    const wickHeight = 5 + Math.random() * 15;
    
    return {
        type: isGreen ? 'bullish' : 'bearish',
        bodyHeight: baseHeight,
        wickHeight: wickHeight,
        price: gameState.currentPrice + (Math.random() - 0.5) * 200
    };
}
```

**Algorithm Components:**
- **Market Trend**: Calculated from last 5 candles (-1 to +1 range)
- **Trend Influence**: 30% weight on market direction
- **Random Factor**: 70% randomness for unpredictability
- **Visual Properties**: Random height and wick size for realism

### 3. Scoring System

#### Game State Structure
```javascript
let gameState = {
    score: 0,                    // Total points earned
    streak: 0,                   // Current correct prediction streak
    totalPredictions: 0,         // Total predictions made
    correctPredictions: 0,       // Total correct predictions
    round: 1,                    // Current round number
    currentPrice: 45234.56,      // Current BTC price
    candles: [],                 // Array of candle objects
    userPrediction: null,        // 'bullish' or 'bearish'
    gameActive: true,            // Game state flag
    bullishStreak: 0,           // Consecutive bullish predictions
    bearishStreak: 0            // Consecutive bearish predictions
};
```

#### Scoring Mechanics
- **Correct Prediction**: +10 points
- **Streak Bonus**: Maintained across consecutive correct predictions
- **Accuracy Calculation**: `(correctPredictions / totalPredictions) * 100`

#### Win/Loss Determination
```javascript
function checkPrediction(actualResult) {
    gameState.totalPredictions++;
    const isCorrect = gameState.userPrediction === actualResult;
    
    if (isCorrect) {
        gameState.correctPredictions++;
        gameState.score += 10;
        gameState.streak++;
        
        // Track prediction streaks
        if (gameState.userPrediction === 'bullish') {
            gameState.bullishStreak++;
        } else {
            gameState.bearishStreak++;
        }
        
        showWinModal(gameState.userPrediction);
    } else {
        gameState.streak = 0;
        gameState.bullishStreak = 0;
        gameState.bearishStreak = 0;
    }
    
    gameState.round++;
    updateStats();
}
```

### 4. Round Progression and Timing

#### Round Flow
1. **Prediction Phase**: User makes prediction (unlimited time)
2. **Generation Phase**: 1.5 second delay with loading message
3. **Result Phase**: New candle appears, result calculated
4. **Feedback Phase**: Win/loss modal or message displayed
5. **Countdown Phase**: 3-second countdown to next round
6. **Reset Phase**: Buttons re-enabled, new round begins

#### Timing Mechanics
```javascript
// Generation delay
setTimeout(() => {
    const nextCandle = generateRandomCandle();
    // ... process result
}, 1500);

// Countdown between rounds
function startCountdown() {
    let seconds = 3;
    const countdownInterval = setInterval(() => {
        countdownEl.textContent = `Next round in ${seconds} seconds...`;
        seconds--;
        
        if (seconds < 0) {
            clearInterval(countdownInterval);
            // Re-enable game
            gameState.gameActive = true;
        }
    }, 1000);
}
```

## User Interface Documentation

### 1. Button Interaction Mechanics

#### Hover Effects (CSS)
```css
.btn-bullish:hover {
    background: linear-gradient(135deg, #00d4aa 0%, #00b894 50%, #00a085 100%);
    transform: translateY(-4px) scale(1.05);
    box-shadow:
        0 16px 48px rgba(0, 255, 136, 0.5),
        0 8px 16px rgba(0, 255, 136, 0.3);
    animation: buttonPulse 0.6s ease-in-out;
}
```

#### Click Animations
```css
@keyframes buttonClick {
    0% { transform: translateY(-4px) scale(1.05); }
    50% { transform: translateY(-1px) scale(1.08); }
    100% { transform: translateY(-2px) scale(1.02); }
}
```

#### Disabled States
```css
.btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}
```

### 2. Chart Visualization System

#### Candlestick Rendering
```javascript
function updateChart() {
    const chart = document.getElementById('chart');
    chart.innerHTML = '';
    
    gameState.candles.forEach((candle, index) => {
        const candleEl = document.createElement('div');
        candleEl.className = `candle ${candle.type}`;
        
        // Add tooltip data
        const tooltipText = `Price: $${candle.price.toFixed(2)} | ${candle.type.toUpperCase()}`;
        candleEl.setAttribute('data-tooltip', tooltipText);
        
        // Add click interaction
        candleEl.addEventListener('click', () => {
            showCandleDetails(candle, index);
        });
        
        // Create visual elements
        const wickEl = document.createElement('div');
        wickEl.className = 'candle-wick';
        wickEl.style.height = `${candle.wickHeight}px`;
        
        const bodyEl = document.createElement('div');
        bodyEl.className = 'candle-body';
        bodyEl.style.height = `${candle.bodyHeight}px`;
        
        candleEl.appendChild(wickEl);
        candleEl.appendChild(bodyEl);
        chart.appendChild(candleEl);
    });
}
```

#### Interactive Tooltips (CSS)
```css
.candle:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    white-space: nowrap;
    z-index: 1000;
    opacity: 1;
    animation: tooltipFadeIn 0.3s ease-in-out;
}
```

### 3. Price Display Updates

#### Animation Sequence
```javascript
function updatePriceDisplay(prevPrice) {
    const priceEl = document.getElementById('currentPrice');
    
    // Phase 1: Update animation
    priceEl.classList.add('price-updating');
    
    setTimeout(() => {
        // Phase 2: Update value and trend
        priceEl.textContent = `${gameState.currentPrice.toFixed(2)}`;
        priceEl.classList.remove('price-updating');
        
        if (prevPrice && gameState.currentPrice > prevPrice) {
            priceEl.className = 'price-display price-up';
        } else if (prevPrice && gameState.currentPrice < prevPrice) {
            priceEl.className = 'price-display price-down';
        }
    }, 200);
    
    // Phase 3: Reset to normal
    setTimeout(() => {
        priceEl.className = 'price-display';
    }, 1000);
}
```

#### Price Animation Keyframes
```css
@keyframes enhancedPriceUp {
    0% {
        transform: scale(1) translateY(0);
        box-shadow: 0 0 0 rgba(0, 255, 136, 0);
        filter: brightness(1);
    }
    25% {
        transform: scale(1.08) translateY(-4px);
        box-shadow: 0 12px 32px rgba(0, 255, 136, 0.5);
        filter: brightness(1.2);
    }
    100% {
        transform: scale(1) translateY(0);
        box-shadow: 0 4px 16px rgba(0, 255, 136, 0.2);
        filter: brightness(1);
    }
}
```

### 4. Statistics Counter Animations

#### Update Trigger System
```javascript
function animateStatUpdate(elementId, newValue) {
    const element = document.getElementById(elementId);
    const currentValue = element.textContent;
    
    if (currentValue !== newValue.toString()) {
        element.classList.add('updating');
        
        setTimeout(() => {
            element.textContent = newValue;
        }, 150);
        
        setTimeout(() => {
            element.classList.remove('updating');
        }, 600);
    }
}
```

#### Animation Keyframes
```css
@keyframes statUpdate {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); color: #ffd700; }
    100% { transform: scale(1); }
}

## Technical Implementation Details

### 1. JavaScript Function Documentation

#### Core Game Functions

**`makePrediction(prediction)`**
- **Purpose**: Handles user prediction input and initiates game round
- **Parameters**: `prediction` (string) - 'bullish' or 'bearish'
- **Side Effects**: Updates game state, disables buttons, triggers animations
- **Flow**: Visual feedback → State update → UI changes → Candle generation

**`generateRandomCandle()`**
- **Purpose**: Creates new candlestick with market trend influence
- **Returns**: Candle object with type, dimensions, and price
- **Algorithm**: 30% trend influence + 70% randomness
- **Dependencies**: `calculateMarketTrend()`, `gameState.currentPrice`

**`checkPrediction(actualResult)`**
- **Purpose**: Evaluates user prediction against actual result
- **Parameters**: `actualResult` (string) - 'bullish' or 'bearish'
- **Side Effects**: Updates score, streak, statistics
- **Triggers**: Win modal display, stat animations

**`updateChart()`**
- **Purpose**: Renders candlestick chart with interactive elements
- **Features**: Tooltip data, click handlers, visual styling
- **Performance**: DOM manipulation optimized with innerHTML clearing

#### State Management Functions

**`updateStats()`**
- **Purpose**: Updates all statistical displays with animations
- **Triggers**: `animateStatUpdate()` for each stat element
- **Calculations**: Accuracy percentage, streak tracking

**`updatePriceDisplay(prevPrice)`**
- **Purpose**: Animates price changes with trend indicators
- **Parameters**: `prevPrice` (number) - Previous price for comparison
- **Phases**: Update animation → Value change → Trend display → Reset

### 2. CSS Animation System

#### Animation Categories

**Button Interactions**
```css
/* Hover pulse effect */
@keyframes buttonPulse {
    0% { box-shadow: 0 8px 32px rgba(0, 255, 136, 0.3); }
    50% { box-shadow: 0 16px 48px rgba(0, 255, 136, 0.6); }
    100% { box-shadow: 0 8px 32px rgba(0, 255, 136, 0.3); }
}

/* Click feedback */
@keyframes buttonClick {
    0% { transform: translateY(-4px) scale(1.05); }
    50% { transform: translateY(-1px) scale(1.08); }
    100% { transform: translateY(-2px) scale(1.02); }
}
```

**Chart Interactions**
```css
/* Tooltip fade-in */
@keyframes tooltipFadeIn {
    0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
    100% { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* Candle hover effect */
.candle:hover {
    transform: scale(1.15);
    z-index: 10;
    filter: brightness(1.2) drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}
```

**Background Animation**
```css
/* Continuous rocket flight */
@keyframes backgroundRocketFlight {
    0% {
        bottom: 5vh; left: -5vw;
        transform: rotate(-15deg) scale(0.8);
        opacity: 0;
    }
    25% {
        bottom: 25vh; left: 25vw;
        transform: rotate(0deg) scale(1);
        opacity: 0.4;
    }
    75% {
        bottom: 75vh; left: 75vw;
        transform: rotate(25deg) scale(0.9);
        opacity: 0.2;
    }
    100% {
        bottom: 95vh; left: 105vw;
        transform: rotate(35deg) scale(0.5);
        opacity: 0;
    }
}
```

### 3. Event Handling and State Management

#### Event Flow Diagram
```
User Click → Button Animation → State Update → UI Disable →
Loading Display → Candle Generation → Result Calculation →
Feedback Display → Countdown → State Reset → UI Enable
```

#### State Transitions
```javascript
// Game state machine
const GAME_STATES = {
    WAITING: 'waiting',      // Waiting for user prediction
    PROCESSING: 'processing', // Generating new candle
    SHOWING_RESULT: 'result', // Displaying win/loss
    COUNTDOWN: 'countdown'    // Countdown to next round
};

// State management
function setState(newState) {
    gameState.currentState = newState;
    updateUIForState(newState);
}
```

#### Error Handling
```javascript
function makePrediction(prediction) {
    // Guard clause for invalid state
    if (!gameState.gameActive) {
        console.warn('Game not active, prediction ignored');
        return;
    }

    // Validate prediction input
    if (!['bullish', 'bearish'].includes(prediction)) {
        console.error('Invalid prediction type:', prediction);
        return;
    }

    // Continue with prediction logic...
}
```

### 4. Background Rocket Animation Implementation

#### CSS Implementation
```css
.background-rocket {
    position: absolute;
    font-size: 2rem;
    opacity: 0.3;
    z-index: -1;
    animation: backgroundRocketFlight 15s linear infinite;
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
    pointer-events: none;
}
```

#### Performance Considerations
- **CSS-only animation**: No JavaScript overhead
- **GPU acceleration**: Uses transform properties
- **Low opacity**: Minimal visual distraction
- **Behind interface**: z-index: -1 prevents interaction conflicts
- **Pointer events disabled**: No interference with game elements

#### Responsive Behavior
```css
@media (max-width: 768px) {
    .background-rocket {
        font-size: 1.5rem;
        opacity: 0.2;
    }
}
```

## Social Media Integration Requirements

### 1. Implementation Strategy

#### Verification Gate System
```javascript
const socialMediaGate = {
    requirements: {
        pageLike: false,
        postShared: false,
        hashtagsUsed: false
    },

    checkRequirements() {
        return Object.values(this.requirements).every(req => req === true);
    },

    unlockGame() {
        if (this.checkRequirements()) {
            document.getElementById('gameContainer').style.display = 'block';
            document.getElementById('socialGate').style.display = 'none';
        }
    }
};
```

#### Required Social Actions
1. **Page Like Verification**
   - Target: "Junior Blockchain Education Consortium of the Philippines - TIP MNL"
   - Method: Facebook Like Button API integration
   - Verification: FB.api callback confirmation

2. **Post Sharing Requirement**
   - Platform: Facebook, Twitter, Instagram, or LinkedIn
   - Content: Pre-defined message about the game
   - Tags: Must include organization mention
   - Hashtags: #JBECPTIPWAVE #JBECP (mandatory)

3. **Verification Modal Implementation**
```html
<div id="socialGate" class="social-gate-modal">
    <div class="gate-content">
        <h2>🚀 Join the Crypto Trading Community!</h2>
        <p>Complete these steps to access the game:</p>

        <div class="requirement-item">
            <input type="checkbox" id="likeReq" disabled>
            <label>Like our Facebook page</label>
            <button onclick="likePage()">Like Page</button>
        </div>

        <div class="requirement-item">
            <input type="checkbox" id="shareReq" disabled>
            <label>Share about the game with #JBECPTIPWAVE #JBECP</label>
            <button onclick="sharePost()">Share Post</button>
        </div>

        <button id="verifyBtn" onclick="verifyRequirements()" disabled>
            Verify & Play Game
        </button>
    </div>
</div>
```

### 2. Integration Functions

#### Facebook SDK Integration
```javascript
// Initialize Facebook SDK
window.fbAsyncInit = function() {
    FB.init({
        appId: 'YOUR_APP_ID',
        cookie: true,
        xfbml: true,
        version: 'v18.0'
    });
};

// Like verification
function likePage() {
    FB.api('/me/likes/PAGE_ID', function(response) {
        if (response.data && response.data.length > 0) {
            socialMediaGate.requirements.pageLike = true;
            document.getElementById('likeReq').checked = true;
            checkAllRequirements();
        }
    });
}

// Share post function
function sharePost() {
    const shareContent = {
        method: 'share',
        href: window.location.href,
        quote: 'Just discovered this amazing crypto trading game! 🚀 Test your prediction skills and learn about market trends. #JBECPTIPWAVE #JBECP'
    };

    FB.ui(shareContent, function(response) {
        if (response && !response.error_message) {
            socialMediaGate.requirements.postShared = true;
            document.getElementById('shareReq').checked = true;
            checkAllRequirements();
        }
    });
}
```

#### Verification System
```javascript
function checkAllRequirements() {
    const allComplete = socialMediaGate.checkRequirements();
    document.getElementById('verifyBtn').disabled = !allComplete;

    if (allComplete) {
        document.getElementById('verifyBtn').textContent = 'Access Game Now!';
        document.getElementById('verifyBtn').classList.add('ready');
    }
}

function verifyRequirements() {
    if (socialMediaGate.checkRequirements()) {
        // Store verification in localStorage
        localStorage.setItem('socialVerified', 'true');
        localStorage.setItem('verificationDate', new Date().toISOString());

        // Unlock game
        socialMediaGate.unlockGame();

        // Analytics tracking
        gtag('event', 'social_verification_complete', {
            'event_category': 'engagement',
            'event_label': 'game_access'
        });
    }
}
```

### 3. Verification Persistence
```javascript
// Check verification on page load
document.addEventListener('DOMContentLoaded', function() {
    const isVerified = localStorage.getItem('socialVerified');
    const verificationDate = localStorage.getItem('verificationDate');

    // Check if verification is still valid (e.g., 30 days)
    if (isVerified && verificationDate) {
        const daysSinceVerification = (new Date() - new Date(verificationDate)) / (1000 * 60 * 60 * 24);

        if (daysSinceVerification < 30) {
            // Skip social gate
            document.getElementById('socialGate').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'block';
        } else {
            // Re-verification required
            localStorage.removeItem('socialVerified');
            localStorage.removeItem('verificationDate');
            showSocialGate();
        }
    } else {
        showSocialGate();
    }
});
```

## Game Rules Documentation

### 1. Core Game Rules

#### Prediction Mechanics
- **Objective**: Predict whether the next candlestick will be green (bullish/up) or red (bearish/down)
- **Time Limit**: No time limit for making predictions
- **Prediction Options**:
  - **"TO THE MOON"** button: Predicts bullish/green candle (price increase)
  - **"BEARISH"** button: Predicts bearish/red candle (price decrease)

#### Candlestick Color Rules
```javascript
// Candle type determination
const isGreen = (trendInfluence + randomFactor) > 0;
const candleType = isGreen ? 'bullish' : 'bearish';

// Visual representation
// Green/Bullish: Upward price movement
// Red/Bearish: Downward price movement
```

### 2. Scoring Mechanics

#### Point System
- **Correct Prediction**: +10 points
- **Incorrect Prediction**: 0 points (no penalty)
- **Streak Bonus**: Maintained count of consecutive correct predictions
- **No Maximum Score**: Unlimited scoring potential

#### Accuracy Calculation
```javascript
const accuracy = gameState.totalPredictions > 0
    ? Math.round((gameState.correctPredictions / gameState.totalPredictions) * 100)
    : 0;
```

#### Streak System
- **Current Streak**: Consecutive correct predictions
- **Bullish Streak**: Consecutive correct bullish predictions
- **Bearish Streak**: Consecutive correct bearish predictions
- **Streak Reset**: Any incorrect prediction resets all streaks to 0

### 3. Round Progression Rules

#### Round Structure
1. **Prediction Phase**: Player selects bullish or bearish
2. **Processing Phase**: 1.5-second delay with loading indicator
3. **Result Phase**: New candle appears, result determined
4. **Feedback Phase**: Success/failure message displayed
5. **Countdown Phase**: 3-second countdown to next round
6. **Reset Phase**: New round begins, buttons re-enabled

#### Round Timing
```javascript
const TIMING_CONFIG = {
    PREDICTION_DELAY: 1500,    // ms - Candle generation delay
    COUNTDOWN_DURATION: 3,      // seconds - Between rounds
    MODAL_DISPLAY_TIME: 3000,   // ms - Win modal display
    ANIMATION_DURATION: 600     // ms - UI animations
};
```

#### Game Progression
- **Infinite Rounds**: No maximum round limit
- **Continuous Play**: Automatic progression between rounds
- **Chart History**: Maintains last 10 candles for trend analysis
- **Price Evolution**: Price changes based on candle outcomes

### 4. Win/Loss Conditions

#### Win Condition
```javascript
const isCorrect = gameState.userPrediction === actualResult;
// userPrediction: 'bullish' or 'bearish'
// actualResult: 'bullish' or 'bearish'
```

#### Success Feedback
- **Bullish Win**: "TO THE MOON!" modal with celebration
- **Bearish Win**: "BEARISH MASTERY!" modal with congratulations
- **Visual Effects**: Animated statistics, price highlights
- **Audio**: None (silent game)

#### Failure Handling
- **No Penalty**: Score remains unchanged
- **Streak Reset**: All streak counters reset to 0
- **Feedback Message**: "Wrong prediction. The market is unpredictable!"
- **Immediate Recovery**: Next round available after countdown

## Code Architecture

### 1. File Structure
```
crypto-trading-game/
├── crypto.html              # Main HTML structure
├── styles.css               # CSS styles and animations
├── script.js                # JavaScript game logic
└── TECHNICAL_DOCUMENTATION.md # This documentation
```

### 2. Module Organization

#### HTML Structure
```html
<!-- Core game container -->
<div class="game-container">
    <!-- Header section -->
    <div class="header">
        <h1>🚀 Crypto Trading Game</h1>
        <p>Predict the next candle: Will it reach the moon? 🌙</p>
    </div>

    <!-- Statistics display -->
    <div class="stats">
        <div class="stat-item">
            <div class="stat-value" id="score">0</div>
            <div>Score</div>
        </div>
        <!-- Additional stats... -->
    </div>

    <!-- Chart visualization -->
    <div class="chart-container">
        <div class="chart-title">BTC/USD - 1m Chart</div>
        <div class="price-display" id="currentPrice">$45,234.56</div>
        <div class="candlestick-chart" id="chart"></div>
    </div>

    <!-- Game controls -->
    <div class="game-controls">
        <div class="result-message" id="resultMessage"></div>
        <div class="prediction-buttons">
            <button class="btn btn-bullish" id="bullishBtn">TO THE MOON</button>
            <button class="btn btn-bearish" id="bearishBtn">BEARISH</button>
        </div>
        <div class="countdown" id="countdown"></div>
    </div>
</div>
```

#### CSS Architecture
```css
/* 1. Base styles and resets */
/* 2. Background and space theme */
/* 3. Game container and layout */
/* 4. Interactive elements (buttons, charts) */
/* 5. Animations and keyframes */
/* 6. Responsive design */
/* 7. Utility classes */
```

#### JavaScript Architecture
```javascript
// 1. Global state management
let gameState = { /* ... */ };

// 2. Core game functions
function initGame() { /* ... */ }
function makePrediction() { /* ... */ }
function generateRandomCandle() { /* ... */ }

// 3. UI update functions
function updateChart() { /* ... */ }
function updateStats() { /* ... */ }
function updatePriceDisplay() { /* ... */ }

// 4. Animation and interaction handlers
function animateStatUpdate() { /* ... */ }
function showCandleDetails() { /* ... */ }

// 5. Event listeners and initialization
document.addEventListener('DOMContentLoaded', initGame);
```

### 3. Data Flow Diagram

```
User Input (Button Click)
    ↓
makePrediction(prediction)
    ↓
State Update (gameState.userPrediction)
    ↓
UI Feedback (Button animations, loading)
    ↓
Candle Generation (generateRandomCandle)
    ↓
Result Calculation (checkPrediction)
    ↓
Score Update (updateStats with animations)
    ↓
Chart Update (updateChart with new candle)
    ↓
Feedback Display (Modal or message)
    ↓
Countdown Timer (startCountdown)
    ↓
Game Reset (Re-enable buttons, new round)
```

### 4. Performance Considerations

#### Optimization Strategies
- **DOM Manipulation**: Batch updates, innerHTML clearing
- **Animation Performance**: CSS transforms over position changes
- **Memory Management**: Limited candle history (max 10)
- **Event Handling**: Debounced interactions, guard clauses

#### Browser Compatibility
- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+
- **Mobile Support**: Responsive design, touch interactions
- **Fallbacks**: Graceful degradation for older browsers

#### Loading Performance
- **Minimal Dependencies**: No external libraries
- **Inline Styles**: Critical CSS inlined
- **Lazy Loading**: Background animations start after DOM ready

### 5. Testing Strategy

#### Unit Testing Approach
```javascript
// Example test cases
describe('Game Mechanics', () => {
    test('generateRandomCandle returns valid candle object', () => {
        const candle = generateRandomCandle();
        expect(candle).toHaveProperty('type');
        expect(['bullish', 'bearish']).toContain(candle.type);
        expect(candle.bodyHeight).toBeGreaterThan(0);
    });

    test('checkPrediction updates score correctly', () => {
        gameState.userPrediction = 'bullish';
        checkPrediction('bullish');
        expect(gameState.score).toBe(10);
        expect(gameState.streak).toBe(1);
    });
});
```

#### Integration Testing
- **User Flow Testing**: Complete prediction cycles
- **Animation Testing**: CSS animation completion
- **Responsive Testing**: Multiple device sizes
- **Performance Testing**: Memory usage, frame rates

#### Manual Testing Checklist
- [ ] Button interactions work correctly
- [ ] Candle generation produces varied results
- [ ] Scoring system calculates accurately
- [ ] Animations complete without glitches
- [ ] Mobile responsiveness functions properly
- [ ] Social media integration works (when implemented)

---

## Conclusion

This technical documentation provides a comprehensive overview of the Crypto Trading Game's architecture, mechanics, and implementation details. The game combines engaging user interactions with educational value about market prediction and cryptocurrency trading concepts.

For implementation questions or feature requests, refer to the specific sections above or consult the inline code comments in the source files.
```
