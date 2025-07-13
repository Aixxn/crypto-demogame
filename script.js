let gameState = {
    score: 0,
    streak: 0,
    totalPredictions: 0,
    correctPredictions: 0,
    round: 1,
    currentPrice: 45234.56,
    candles: [],
    userPrediction: null,
    gameActive: true,
    bullishStreak: 0,
    bearishStreak: 0
};

// Initialize the game
function initGame() {
    // Generate initial candles
    for (let i = 0; i < 8; i++) {
        gameState.candles.push(generateRandomCandle());
    }
    updateChart();
    updateStats();
    updateMarketIndicator();
    startMarketAnimation();
}

// Generate a random candle with market trend influence
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

// Calculate market trend based on recent candles
function calculateMarketTrend() {
    if (gameState.candles.length < 3) return 0;
    
    const recentCandles = gameState.candles.slice(-5);
    const bullishCount = recentCandles.filter(c => c.type === 'bullish').length;
    const bearishCount = recentCandles.filter(c => c.type === 'bearish').length;
    
    return (bullishCount - bearishCount) / recentCandles.length;
}

// Update market indicator
function updateMarketIndicator() {
    const indicator = document.getElementById('marketIndicator');
    const trend = calculateMarketTrend();
    
    if (trend > 0.2) {
        indicator.textContent = '🚀 Bull Market';
        indicator.className = 'market-indicator bullish';
    } else if (trend < -0.2) {
        indicator.textContent = '🐻 Bear Market';
        indicator.className = 'market-indicator bearish';
    } else {
        indicator.textContent = '📊 Market Neutral';
        indicator.className = 'market-indicator';
    }
}

// Enhanced market animation with better performance
function startMarketAnimation() {
    // Keep this function for potential future market indicator animations
    return () => {}; // Return empty cleanup function
}







// Update the chart display with interactive elements
function updateChart() {
    const chart = document.getElementById('chart');
    chart.innerHTML = '';

    gameState.candles.forEach((candle, index) => {
        const candleEl = document.createElement('div');
        candleEl.className = `candle ${candle.type}`;
        if (index === gameState.candles.length - 1) {
            candleEl.classList.add('current');
        }

        // Add tooltip data
        const tooltipText = `Price: $${candle.price.toFixed(2)} | ${candle.type.toUpperCase()}`;
        candleEl.setAttribute('data-tooltip', tooltipText);

        // Add click interaction
        candleEl.addEventListener('click', () => {
            showCandleDetails(candle, index);
        });

        const wickEl = document.createElement('div');
        wickEl.className = 'candle-wick';
        wickEl.style.height = `${candle.wickHeight}px`;
        wickEl.style.top = '-5px';

        const bodyEl = document.createElement('div');
        bodyEl.className = 'candle-body';
        bodyEl.style.height = `${candle.bodyHeight}px`;

        candleEl.appendChild(wickEl);
        candleEl.appendChild(bodyEl);
        chart.appendChild(candleEl);
    });

    // Update current price with animation
    const lastCandle = gameState.candles[gameState.candles.length - 1];
    const prevPrice = gameState.currentPrice;
    gameState.currentPrice = lastCandle.price;
    updatePriceDisplay(prevPrice);
}

// Show candle details when clicked
function showCandleDetails(candle, index) {
    const message = `Candle ${index + 1}: $${candle.price.toFixed(2)} (${candle.type.toUpperCase()})`;
    const resultEl = document.getElementById('resultMessage');
    resultEl.textContent = message;
    resultEl.className = `result-message ${candle.type === 'bullish' ? 'result-correct' : 'result-incorrect'}`;

    // Clear message after 2 seconds
    setTimeout(() => {
        if (resultEl.textContent === message) {
            resultEl.textContent = '';
            resultEl.className = 'result-message';
        }
    }, 2000);
}

// Update price display with enhanced animations
function updatePriceDisplay(prevPrice) {
    const priceEl = document.getElementById('currentPrice');

    // Add updating animation first
    priceEl.classList.add('price-updating');

    setTimeout(() => {
        priceEl.textContent = `${gameState.currentPrice.toFixed(2)}`;

        // Remove updating class and add trend class
        priceEl.classList.remove('price-updating');

        if (prevPrice && gameState.currentPrice > prevPrice) {
            priceEl.className = 'price-display price-up';
        } else if (prevPrice && gameState.currentPrice < prevPrice) {
            priceEl.className = 'price-display price-down';
        } else {
            priceEl.className = 'price-display';
        }
    }, 200);

    // Reset to normal after animation
    setTimeout(() => {
        priceEl.className = 'price-display';
    }, 1000);
}

// Make a prediction with visual feedback
function makePrediction(prediction) {
    if (!gameState.gameActive) return;

    // Add visual feedback for button click
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

    // Disable buttons with smooth transition
    document.getElementById('bullishBtn').disabled = true;
    document.getElementById('bearishBtn').disabled = true;

    // Show loading message with animation
    const resultEl = document.getElementById('resultMessage');
    resultEl.textContent = 'Generating next candle...';
    resultEl.className = 'result-message loading';
    resultEl.style.opacity = '0';
    resultEl.style.transform = 'translateY(10px)';

    setTimeout(() => {
        resultEl.style.opacity = '1';
        resultEl.style.transform = 'translateY(0)';
    }, 100);
    
    // Generate next candle after a delay
    setTimeout(() => {
        const nextCandle = generateRandomCandle();
        gameState.candles.push(nextCandle);
        
        // Remove oldest candle if we have too many
        if (gameState.candles.length > 10) {
            gameState.candles.shift();
        }
        
        updateChart();
        updateMarketIndicator();
        checkPrediction(nextCandle.type);
        
        // Start countdown for next round
        startCountdown();
    }, 1500);
}

// Check if prediction was correct
function checkPrediction(actualResult) {
    gameState.totalPredictions++;
    const isCorrect = gameState.userPrediction === actualResult;

    if (isCorrect) {
        gameState.correctPredictions++;
        gameState.score += 10;
        gameState.streak++;

        // Track prediction streaks without triggering rocket animation
        if (gameState.userPrediction === 'bullish') {
            gameState.bullishStreak++;
        } else {
            gameState.bearishStreak++;
        }

        // Show success modal
        setTimeout(() => {
            showWinModal(gameState.userPrediction);
        }, 500);

        document.getElementById('resultMessage').textContent = '';
        document.getElementById('resultMessage').className = 'result-message';
    } else {
        gameState.streak = 0;
        gameState.bullishStreak = 0;
        gameState.bearishStreak = 0;

        document.getElementById('resultMessage').textContent = 'Wrong prediction. The market is unpredictable!';
        document.getElementById('resultMessage').className = 'result-message result-incorrect';
    }

    gameState.round++;
    updateStats();
}

// Show win modal
function showWinModal(predictionType) {
    const modal = document.getElementById('winModal');
    const modalIcon = modal.querySelector('.modal-icon');
    const modalTitle = modal.querySelector('.modal-content > div:nth-child(3)');
    const modalMessage = modal.querySelector('.modal-content > div:nth-child(4)');

    // Update modal content based on prediction type
    if (predictionType === 'bullish') {
        modalIcon.textContent = '📈';
        modalTitle.textContent = 'TO THE MOON!';
        modalMessage.textContent = 'Congratulations! Your bullish prediction was spot on!';
        modalTitle.style.color = '#4ecdc4';
        modalIcon.style.animation = 'modalPulse 2s ease-in-out infinite';
    } else if (predictionType === 'bearish') {
        modalIcon.textContent = '📉';
        modalTitle.textContent = 'BEARISH MASTERY!';
        modalMessage.textContent = 'Congratulations! Your bearish prediction was correct!';
        modalTitle.style.color = '#ff6b6b';
        modalIcon.style.animation = 'modalPulse 2s ease-in-out infinite';
    }

    modal.style.display = 'flex';

    // Auto-close after 3 seconds
    setTimeout(() => {
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    }, 3000);
}

// Start countdown for next round
function startCountdown() {
    let seconds = 3;
    const countdownEl = document.getElementById('countdown');

    const countdownInterval = setInterval(() => {
        countdownEl.textContent = `Next round in ${seconds} seconds...`;
        seconds--;

        if (seconds < 0) {
            clearInterval(countdownInterval);
            countdownEl.textContent = '';

            // Re-enable buttons
            document.getElementById('bullishBtn').disabled = false;
            document.getElementById('bearishBtn').disabled = false;
            document.getElementById('resultMessage').textContent = '';

            gameState.gameActive = true;
            gameState.userPrediction = null;
        }
    }, 1000);
}

// Update stats display with animations
function updateStats() {
    animateStatUpdate('score', gameState.score);
    animateStatUpdate('streak', gameState.streak);
    animateStatUpdate('round', gameState.round);

    const accuracy = gameState.totalPredictions > 0
        ? Math.round((gameState.correctPredictions / gameState.totalPredictions) * 100)
        : 0;
    animateStatUpdate('accuracy', `${accuracy}%`);
}

// Animate stat counter updates
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

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('closeWinModal');
    if (closeBtn) {
        closeBtn.onclick = function() {
            document.getElementById('winModal').style.display = 'none';
        };
    }

    // Close modal when clicking outside
    document.getElementById('winModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
});

// Initialize the game when page loads
window.addEventListener('load', initGame);
