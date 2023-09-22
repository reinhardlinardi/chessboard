# Chessboard
A responsive client-side chess editor and self-analysis web page with minimal dependencies. Inspired by [Lichess](https://lichess.org/).

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en)
- [Yarn 2+](https://yarnpkg.com/)

### Installation
1. Clone or download the repository
2. Install dependencies
```
yarn install
```
3. Build static files
```
make
```

### Run
1. Run static file server
```
yarn node server.js
```
2. Open localhost:8080

## Stack
- HTML 5 + CSS 3 + JS
- [SCSS](https://sass-lang.com/)
- [TS](https://www.typescriptlang.org/)
- [Vue.js](https://vuejs.org/)

## Features
### Editor
- Drag and drop or click to edit
- Position validation
- Import FEN by text or URL

### Self-analysis
- Fully playable chess game
- Automatic draw detection
- Drag and drop or click to move
- Legal move hints
- Moves history 
- Import FEN by URL
