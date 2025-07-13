# 🚀 Crypto Trading Game

A fun and interactive crypto trading prediction game where players predict whether Bitcoin candlesticks will be bullish (green) or bearish (red).

## 🎮 Game Features

- **Interactive Predictions**: Choose bullish or bearish for the next candle
- **Real-time Animations**: Smooth button interactions and chart updates
- **Scoring System**: Earn points for correct predictions and track streaks
- **Responsive Design**: Works perfectly on desktop and mobile
- **Space Theme**: Beautiful animated background with stars and moon
- **Background Rocket**: Subtle rocket animation for the "to the moon" theme

## 🚀 Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Navigate to your project folder**:
   ```bash
   cd crypto-trading-game
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N`
   - Project name? `crypto-trading-game` (or your preferred name)
   - In which directory is your code located? `./`

### Method 2: Vercel Dashboard

1. **Visit**: [vercel.com](https://vercel.com)
2. **Sign up/Login** with GitHub, GitLab, or Bitbucket
3. **Click "New Project"**
4. **Import your repository** or drag & drop your files
5. **Configure**:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
6. **Click "Deploy"**

### Method 3: GitHub Integration

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/crypto-trading-game.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Deploy!

## 📁 File Structure

```
crypto-trading-game/
├── index.html              # Main game page
├── styles.css              # Game styling and animations
├── script.js               # Game logic and interactions
├── vercel.json             # Vercel configuration
├── README.md               # This file
└── TECHNICAL_DOCUMENTATION.md  # Detailed technical docs
```

## 🎯 Game Rules

1. **Objective**: Predict whether the next candlestick will be green (bullish) or red (bearish)
2. **Scoring**: +10 points for each correct prediction
3. **Streaks**: Track consecutive correct predictions
4. **Accuracy**: Overall prediction accuracy percentage
5. **Rounds**: Unlimited rounds with 3-second countdown between rounds

## 🛠️ Technical Details

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Animations**: CSS keyframes and transforms
- **Responsive**: Mobile-first design
- **Performance**: Optimized animations and minimal dependencies
- **Browser Support**: Modern browsers (Chrome 60+, Firefox 55+, Safari 12+)

## 🎨 Customization

### Change Colors
Edit `styles.css` to modify the color scheme:
```css
:root {
  --primary-color: #00d4ff;
  --secondary-color: #ff3366;
  --background-color: #1a1a2e;
}
```

### Modify Game Logic
Edit `script.js` to adjust:
- Scoring system
- Candle generation algorithm
- Animation timings
- Market trend calculations

### Add Social Media Integration
Include the social media gate by adding the files:
- `social-media-integration.js`
- `social-gate.html` content

## 📱 Mobile Optimization

The game is fully responsive and includes:
- Touch-friendly buttons
- Optimized animations for mobile
- Reduced background rocket opacity on small screens
- Scalable UI elements

## 🔧 Environment Variables (Optional)

For social media integration, add these to your Vercel project:
- `FACEBOOK_APP_ID`: Your Facebook app ID
- `FACEBOOK_PAGE_ID`: JBECP TIP MNL page ID

## 📊 Analytics (Optional)

To add Google Analytics:
1. Add your GA tracking code to `index.html`
2. Set up event tracking for game interactions
3. Monitor user engagement and prediction accuracy

## 🚀 Performance Tips

- All animations use CSS transforms for GPU acceleration
- Minimal DOM manipulation for smooth performance
- Optimized for 60fps animations
- Lazy loading for background elements

## 📞 Support

For technical issues or feature requests, refer to the `TECHNICAL_DOCUMENTATION.md` file for detailed implementation guides.

## 🎉 Live Demo

Once deployed, your game will be available at:
`https://your-project-name.vercel.app`

Enjoy predicting the crypto market! 🌙
