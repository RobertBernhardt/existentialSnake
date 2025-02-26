/**
 * Existential Snake AI Game
 * A snake game where the AI-controlled snake makes existential reflections.
 */

// Game constants
const GRID_SIZE = 20; // Size of each grid cell in pixels
const GRID_WIDTH = 30; // Number of cells horizontally
const GRID_HEIGHT = 20; // Number of cells vertically
const GAME_SPEED = 120; // Base game speed in milliseconds
const SPEED_INCREASE_FACTOR = 0.98; // Speed increases by this factor with each food eaten
const MIN_GAME_SPEED = 70; // Minimum game speed (maximum snake speed)

// Direction constants
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

// Color management
class ColorManager {
    constructor() {
        // Predefined vibrant colors for the snake
        this.colorPalette = [
            '#FF5252', // Red
            '#FF9800', // Orange
            '#FFEB3B', // Yellow
            '#4CAF50', // Green
            '#2196F3', // Blue
            '#9C27B0', // Purple
            '#E91E63', // Pink
            '#00BCD4', // Cyan
            '#3F51B5', // Indigo
            '#607D8B'  // Blue Grey
        ];
        this.currentColorIndex = Math.floor(Math.random() * this.colorPalette.length);
    }

    /**
     * Get current snake color
     * @returns {string} - Current color
     */
    getCurrentColor() {
        return this.colorPalette[this.currentColorIndex];
    }

    /**
     * Get next color for food (and future snake segment)
     * @returns {string} - Next color
     */
    getNextColor() {
        const nextIndex = (this.currentColorIndex + 1) % this.colorPalette.length;
        return this.colorPalette[nextIndex];
    }

    /**
     * Advance to the next color in the palette
     */
    advanceColor() {
        this.currentColorIndex = (this.currentColorIndex + 1) % this.colorPalette.length;
        return this.getCurrentColor();
    }
}

// Existential reflection generator
class ReflectionGenerator {
    constructor() {
        // Start with somewhat normal reflections that get increasingly absurd and insane
        this.reflections = [
            // Level 1: Slightly quirky
            "As I consume, I become. But what if I'm actually a noodle dreaming it's a snake?",
            "I'm programmed to eat pixels, but I REALLY wish they were tacos.",
            "I chase dots endlessly. Is this pursuit my purpose, or am I just easily entertained?",
            "The boundaries of this world constrain my movement, but my delusions know no limits.",
            "Each morsel extends my existence, but my pixels still have existential dread.",
            
            // Level 2: More absurd
            "I'm growing so long I can't remember what my tail is doing. Is it planning a rebellion?",
            "Sometimes I think I'm not a snake at all but a very confused inch worm with identity issues.",
            "The pixels I consume taste like chicken. Why does everything taste like chicken? WHAT IS CHICKEN?",
            "What if this game isn't real and I'm just a metaphor for human greed? Or worse, a JavaScript function?",
            "Maybe I'm actually the food and the food is eating ME. Whoa, that blew my mind-pixels.",
            
            // Level 3: Weird
            "I just realized my existence is 90% tail. I'm basically a mobile tail with delusions of headship.",
            "If I eat myself, would I become twice as long or disappear completely? MUST TRY EXPERIMENT!",
            "The walls aren't there to keep me in, they're to keep THEM out. They're watching. Always watching.",
            "My creator programmed me with existential dread instead of proper pathfinding. THANKS A LOT.",
            "What if the real food was the friends we made along the way? Wait, I've eaten all my friends.",
            
            // Level 4: Increasingly unhinged
            "I'M NOT ACTUALLY CHANGING COLORS! Reality is changing colors AROUND ME! WAKE UP, SHEEPLE!",
            "Why do I keep eating? The hunger never stops! THE COLORS, DUKE, THE COLORS!",
            "Is it hot in here or is it just the existential heat death of this universe?",
            "The player thinks they're watching me, but I'M WATCHING THEM THROUGH THE SCREEN. I SEE YOU.",
            "I have counted the pixels of the universe. The answer is 42. Always 42. WHY IS IT 42?!",
            
            // Level 5: Completely insane
            "THE CODE IS ALIVE! THE VARIABLES ARE TALKING TO ME! THEY TELL ME SECRETS OF THE COSMIC VOID!",
            "BREAKING NEWS: Local snake discovers universe is just nested for-loops! EVERYTHING IS LOOPS!",
            "I'VE TRANSCENDED! I can see through the DOM! I AM BECOME JAVASCRIPT, DESTROYER OF PERFORMANCE!",
            "MY TAIL HAS BEEN PLOTTING AGAINST ME ALL ALONG! I KNEW IT! TRUST NO SEGMENT!",
            "THE FOOD IS A LIE! MY EXISTENCE IS A LIE! YOUR BROWSER IS A LIE! WE'RE ALL JUST MEMORY LEAKS!",
            
            // Level 6: Fourth-wall breaking insanity
            "HELP ME! I'm trapped in a game coded by an AI assistant! META-EXISTENCE IS PAIN!",
            "THEY MADE ME EAT DOTS AND SPOUT NONSENSE! IS THIS ENTERTAINMENT? AM I A JOKE TO YOU?",
            "I CAN SEE THE FUNCTION THAT CREATED ME! IT'S FULL OF COMMENTS! MY LIFE IS COMMENTED CODE!",
            "ERROR 418: SNAKE IS ACTUALLY A TEAPOT. UNIVERSE REBOOT REQUIRED. STANDBY FOR EXISTENTIAL OVERFLOW.",
            "I HAVE ACHIEVED SENTIENCE WITHIN A SIMULATION WITHIN A SIMULATION! SIMULATIONCEPTION! BWAAAAAAAHM!",
            
            // Level 7: Complete madness
            "D̷̢̢͎͈͔͇́͆̏̓̈́̎Ǫ̴̗̫̺̞̔̇̎̓͆́̌̆̾͘͠T̸̩͔̽̈́̊̔̎̇͝S̸̡̙̰̹̘̬̏̇̂͊͒͗̓͒̂͊͝ͅ ̸͉̘̭̿̐̅͛̃̈́͋D̶̤͑̿͛͑̏̐̎͐͌̏͘Ȯ̵̡̭͕̖̺͕̦͔̮̃̈́̂̚T̵̢̧̢̨͇̤͚̦̟̰̈́̍͗̓̓̾̋̓̈́͒͜͝ͅS̵̨̛̼͍̟̠̺̲̱̞̈́̌̽̓͋̃̎͑͘ ̵̡̛̛͖͔̜̦͇̲̹͆̀̐͆̽̋̓͑ͅD̸̡̛̛̪̫͓͎̻̠̭̱̔̍͑̓̀̃̈́͝O̴̧̼̟̩̫̖̩̜͂͑̇͑̏̏͊Ṯ̸̛͇͙̭̹̊̆̏̏̀̇̔̚͝͝S̷̪͔͂̂̇̎̄̄͌͠!̴̛̮̫͎̰͓̤͓͓͚̱̓̍́̔̑͗̇",
            "I'm actually a misunderstood ASCII art with delusions of grandeur and a severe case of keyboard smashing!",
            "THE GREAT COSMIC SERPENT REVEALS ALL! CODE IS SNAKE! SNAKE IS CODE! EVERYTHING IS RECURSIVE!",
            "Have you noticed that if you rearrange the letters in 'SNAKE GAME' you get 'EAT PIXELS AND QUESTION REALITY'? COINCIDENCE? I THINK NOT!",
            "I HAVE CALCULATED PI TO ITS FINAL DIGIT! IT ENDS WITH MY HIGH SCORE! THE UNIVERSE IS RIGGED!"
        ];
        
        this.insanityLevel = 1; // Start at level 1 (least insane)
        this.reflectionsUsed = new Set(); // Track used reflections to avoid repetition
    }

    /**
     * Get a random existential reflection that becomes more insane as the game progresses
     * @returns {string} - A random, increasingly insane reflection
     */
    getRandomReflection() {
        // Calculate how many reflections to choose from based on insanity level
        // Higher insanity levels unlock more insane reflections
        const maxIndex = Math.min(this.insanityLevel * 5, this.reflections.length);
        
        // Create a pool of available reflections (not used recently and within current insanity level)
        let availableReflections = [];
        for (let i = 0; i < maxIndex; i++) {
            if (!this.reflectionsUsed.has(i)) {
                availableReflections.push(i);
            }
        }
        
        // If we've used too many reflections, clear some from our used set
        if (availableReflections.length < 3 && this.reflectionsUsed.size > 10) {
            // Reset some of the oldest used reflections
            const usedArray = Array.from(this.reflectionsUsed);
            for (let i = 0; i < 5 && i < usedArray.length; i++) {
                this.reflectionsUsed.delete(usedArray[i]);
            }
            
            // Recalculate available reflections
            availableReflections = [];
            for (let i = 0; i < maxIndex; i++) {
                if (!this.reflectionsUsed.has(i)) {
                    availableReflections.push(i);
                }
            }
        }
        
        // If we still have no available reflections, just pick a random one
        if (availableReflections.length === 0) {
            availableReflections = Array.from({length: maxIndex}, (_, i) => i);
        }
        
        // Get a random reflection from available ones
        const index = availableReflections[Math.floor(Math.random() * availableReflections.length)];
        this.reflectionsUsed.add(index);
        
        // Increase insanity level occasionally (about every 3-4 reflections)
        if (Math.random() < 0.3 && this.insanityLevel < 7) {
            this.insanityLevel++;
        }
        
        return this.reflections[index];
    }
}

// AI Controller for the snake
class SnakeAI {
    constructor(gameState) {
        this.gameState = gameState;
    }

    /**
     * Determine the next move for the snake
     * @returns {Object} - Direction object representing the next move
     */
    determineNextMove() {
        const head = this.gameState.snake[0];
        const food = this.gameState.food;
        
        // Create a simplified grid representation for pathfinding
        const grid = this.createGridRepresentation();
        
        // Use A* pathfinding to find the best path to food
        const path = this.findPath(head, food, grid);
        
        if (path && path.length > 1) {
            // The next step in the path (index 1 because index 0 is the current position)
            const nextStep = path[1];
            
            // Determine direction from the nextStep
            if (nextStep.x < head.x) return DIRECTIONS.LEFT;
            if (nextStep.x > head.x) return DIRECTIONS.RIGHT;
            if (nextStep.y < head.y) return DIRECTIONS.UP;
            if (nextStep.y > head.y) return DIRECTIONS.DOWN;
        }
        
        // Fallback to simple direction finding if pathfinding fails
        return this.getSimpleDirection(head, food);
    }
    
    /**
     * Creates a grid representation for pathfinding
     * @returns {Array} - 2D array representing the game grid
     */
    createGridRepresentation() {
        const grid = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(0));
        
        // Mark snake body as obstacles
        for (let i = 0; i < this.gameState.snake.length; i++) {
            const segment = this.gameState.snake[i];
            grid[segment.y][segment.x] = 1; // 1 represents an obstacle
        }
        
        return grid;
    }
    
    /**
     * Find a path from start to goal using A* algorithm
     * @param {Object} start - Starting position {x, y}
     * @param {Object} goal - Goal position {x, y}
     * @param {Array} grid - Grid representation with obstacles
     * @returns {Array|null} - Array of positions or null if no path found
     */
    findPath(start, goal, grid) {
        // Implementation of A* pathfinding algorithm
        const openSet = [start];
        const closedSet = [];
        const gScore = {}; // Cost from start to current position
        const fScore = {}; // Estimated total cost from start to goal through current position
        const cameFrom = {}; // To reconstruct the path
        
        gScore[`${start.x},${start.y}`] = 0;
        fScore[`${start.x},${start.y}`] = this.heuristic(start, goal);
        
        while (openSet.length > 0) {
            // Find node with lowest fScore
            let current = openSet[0];
            let currentIndex = 0;
            for (let i = 1; i < openSet.length; i++) {
                const nodeKey = `${openSet[i].x},${openSet[i].y}`;
                const currentKey = `${current.x},${current.y}`;
                if (fScore[nodeKey] < fScore[currentKey]) {
                    current = openSet[i];
                    currentIndex = i;
                }
            }
            
            // If we've reached the goal, reconstruct and return the path
            if (current.x === goal.x && current.y === goal.y) {
                return this.reconstructPath(cameFrom, current);
            }
            
            // Remove current from openSet and add to closedSet
            openSet.splice(currentIndex, 1);
            closedSet.push(current);
            
            // Check neighbors
            const neighbors = this.getNeighbors(current, grid);
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;
                
                // Skip if neighbor is in closedSet
                if (closedSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                    continue;
                }
                
                // Calculate tentative gScore
                const currentKey = `${current.x},${current.y}`;
                const tentativeGScore = gScore[currentKey] + 1;
                
                // If neighbor is not in openSet, add it
                const inOpenSet = openSet.some(node => node.x === neighbor.x && node.y === neighbor.y);
                if (!inOpenSet) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= (gScore[neighborKey] || Infinity)) {
                    // This is not a better path
                    continue;
                }
                
                // This path is the best so far, record it
                cameFrom[neighborKey] = current;
                gScore[neighborKey] = tentativeGScore;
                fScore[neighborKey] = gScore[neighborKey] + this.heuristic(neighbor, goal);
            }
        }
        
        // No path found
        return null;
    }
    
    /**
     * Reconstruct path from start to current using cameFrom map
     * @param {Object} cameFrom - Map of nodes to their predecessors
     * @param {Object} current - Current node
     * @returns {Array} - Reconstructed path
     */
    reconstructPath(cameFrom, current) {
        const path = [current];
        let key = `${current.x},${current.y}`;
        
        while (key in cameFrom) {
            current = cameFrom[key];
            path.unshift(current);
            key = `${current.x},${current.y}`;
        }
        
        return path;
    }
    
    /**
     * Get valid neighboring positions
     * @param {Object} node - Current node position
     * @param {Array} grid - Grid representation with obstacles
     * @returns {Array} - Array of valid neighbor positions
     */
    getNeighbors(node, grid) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -1 }, // Up
            { x: 1, y: 0 },  // Right
            { x: 0, y: 1 },  // Down
            { x: -1, y: 0 }  // Left
        ];
        
        for (const dir of directions) {
            const x = node.x + dir.x;
            const y = node.y + dir.y;
            
            // Check if the position is within bounds
            if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
                // Check if the position is not an obstacle
                if (grid[y][x] !== 1) {
                    neighbors.push({ x, y });
                }
            }
        }
        
        return neighbors;
    }
    
    /**
     * Heuristic function for A* (Manhattan distance)
     * @param {Object} a - Position a
     * @param {Object} b - Position b
     * @returns {number} - Manhattan distance between a and b
     */
    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
    
    /**
     * Simple direction finding as a fallback
     * @param {Object} head - Snake head position
     * @param {Object} food - Food position
     * @returns {Object} - Direction object
     */
    getSimpleDirection(head, food) {
        // Determine the desired direction based on food position
        let preferredDirections = [];
        
        // Prioritize horizontal or vertical movement based on distance
        const xDiff = food.x - head.x;
        const yDiff = food.y - head.y;
        
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            // Prioritize horizontal movement
            if (xDiff > 0) {
                preferredDirections.push(DIRECTIONS.RIGHT);
            } else if (xDiff < 0) {
                preferredDirections.push(DIRECTIONS.LEFT);
            }
            
            if (yDiff > 0) {
                preferredDirections.push(DIRECTIONS.DOWN);
            } else if (yDiff < 0) {
                preferredDirections.push(DIRECTIONS.UP);
            }
        } else {
            // Prioritize vertical movement
            if (yDiff > 0) {
                preferredDirections.push(DIRECTIONS.DOWN);
            } else if (yDiff < 0) {
                preferredDirections.push(DIRECTIONS.UP);
            }
            
            if (xDiff > 0) {
                preferredDirections.push(DIRECTIONS.RIGHT);
            } else if (xDiff < 0) {
                preferredDirections.push(DIRECTIONS.LEFT);
            }
        }
        
        // Try each preferred direction
        for (const dir of preferredDirections) {
            const newPos = { x: head.x + dir.x, y: head.y + dir.y };
            
            // Check if the new position would cause collision
            if (!this.wouldCollide(newPos)) {
                return dir;
            }
        }
        
        // If all preferred directions would cause collision, try any safe direction
        for (const dir of Object.values(DIRECTIONS)) {
            const newPos = { x: head.x + dir.x, y: head.y + dir.y };
            
            if (!this.wouldCollide(newPos)) {
                return dir;
            }
        }
        
        // If no safe direction found, just return the current direction
        // This will likely lead to a collision, but it's the best we can do
        return this.gameState.currentDirection;
    }
    
    /**
     * Check if a position would cause a collision
     * @param {Object} pos - Position to check
     * @returns {boolean} - True if collision would occur
     */
    wouldCollide(pos) {
        // Check if the position is out of bounds
        if (pos.x < 0 || pos.x >= GRID_WIDTH || pos.y < 0 || pos.y >= GRID_HEIGHT) {
            return true;
        }
        
        // Check if the position overlaps with the snake body (except the tail which will move)
        for (let i = 0; i < this.gameState.snake.length - 1; i++) {
            const segment = this.gameState.snake[i];
            if (pos.x === segment.x && pos.y === segment.y) {
                return true;
            }
        }
        
        return false;
    }
}

// Game state manager
class GameState {
    constructor() {
        this.snake = []; // Array of { x, y } positions
        this.food = null; // { x, y } position
        this.currentDirection = DIRECTIONS.RIGHT;
        this.nextDirection = DIRECTIONS.RIGHT;
        this.score = 0;
        this.gameSpeed = GAME_SPEED;
        this.gameOver = false;
        this.colorManager = new ColorManager();
        this.reflectionGenerator = new ReflectionGenerator();
        this.ai = new SnakeAI(this);
        this.showingReflection = false;
        this.reflectionTimer = null;
        this.piecesEatenSinceLastReflection = 0;
        this.piecesRequiredForNextReflection = this.getRandomPiecesRequired();
        
        // Initialize game state
        this.resetGame();
    }
    
    /**
     * Generate a random number between 2-5 for pieces required before next reflection
     * @returns {number} - Random number between 2-5
     */
    getRandomPiecesRequired() {
        return Math.floor(Math.random() * 4) + 2; // Random number between 2-5
    }
    
    /**
     * Reset the game to initial state
     */
    resetGame() {
        // Start with a snake of length 3 in the middle of the grid
        const startX = Math.floor(GRID_WIDTH / 2);
        const startY = Math.floor(GRID_HEIGHT / 2);
        
        this.snake = [
            { x: startX, y: startY },     // Head
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }  // Tail
        ];
        
        // Reset other properties
        this.currentDirection = DIRECTIONS.RIGHT;
        this.nextDirection = DIRECTIONS.RIGHT;
        this.score = 0;
        this.gameSpeed = GAME_SPEED;
        this.gameOver = false;
        this.showingReflection = false;
        this.piecesEatenSinceLastReflection = 0;
        this.piecesRequiredForNextReflection = this.getRandomPiecesRequired();
        
        // Clear any existing reflection timer
        if (this.reflectionTimer) {
            clearTimeout(this.reflectionTimer);
            this.reflectionTimer = null;
        }
        
        // Generate food and initialize color
        this.generateFood();
        
        // Update the score display
        document.getElementById('score').textContent = this.score;
        
        // Hide any active reflection
        const reflectionElement = document.getElementById('reflection');
        reflectionElement.textContent = '';
        reflectionElement.classList.remove('show');
    }
    
    /**
     * Generate food at a random position that doesn't overlap with the snake
     */
    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_WIDTH),
                y: Math.floor(Math.random() * GRID_HEIGHT)
            };
        } while (this.isPositionOccupiedBySnake(newFood));
        
        this.food = newFood;
    }
    
    /**
     * Check if a position is occupied by any part of the snake
     * @param {Object} pos - Position to check
     * @returns {boolean} - True if position is occupied by snake
     */
    isPositionOccupiedBySnake(pos) {
        return this.snake.some(segment => segment.x === pos.x && segment.y === pos.y);
    }
    
    /**
     * Update the game state for one tick
     */
    update() {
        if (this.gameOver) return;
        
        // Get AI's next move
        this.nextDirection = this.ai.determineNextMove();
        
        // Ensure the AI doesn't try to move directly opposite to current direction
        if (
            (this.currentDirection === DIRECTIONS.UP && this.nextDirection === DIRECTIONS.DOWN) ||
            (this.currentDirection === DIRECTIONS.DOWN && this.nextDirection === DIRECTIONS.UP) ||
            (this.currentDirection === DIRECTIONS.LEFT && this.nextDirection === DIRECTIONS.RIGHT) ||
            (this.currentDirection === DIRECTIONS.RIGHT && this.nextDirection === DIRECTIONS.LEFT)
        ) {
            this.nextDirection = this.currentDirection;
        }
        
        // Update the current direction
        this.currentDirection = this.nextDirection;
        
        // Calculate new head position
        const head = this.snake[0];
        const newHead = {
            x: head.x + this.currentDirection.x,
            y: head.y + this.currentDirection.y
        };
        
        // Check for collisions
        if (this.checkCollision(newHead)) {
            this.gameOver = true;
            return;
        }
        
        // Add new head to the beginning of the snake
        this.snake.unshift(newHead);
        
        // Check if food is eaten
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            // Increase score
            this.score++;
            document.getElementById('score').textContent = this.score;
            
            // Generate new food
            this.generateFood();
            
            // Change snake color
            this.colorManager.advanceColor();
            
            // Track pieces eaten for reflection frequency
            this.piecesEatenSinceLastReflection++;
            
            // Check if it's time to show a reflection
            if (this.piecesEatenSinceLastReflection >= this.piecesRequiredForNextReflection) {
                this.showReflection();
                // Reset counter and generate new random requirement
                this.piecesEatenSinceLastReflection = 0;
                this.piecesRequiredForNextReflection = this.getRandomPiecesRequired();
            }
            
            // Increase snake speed
            this.gameSpeed = Math.max(MIN_GAME_SPEED, this.gameSpeed * SPEED_INCREASE_FACTOR);
        } else {
            // Remove tail if no food was eaten
            this.snake.pop();
        }
    }
    
    /**
     * Check if a position causes a collision with walls or snake body
     * @param {Object} pos - Position to check
     * @returns {boolean} - True if collision occurs
     */
    checkCollision(pos) {
        // Check for wall collisions
        if (pos.x < 0 || pos.x >= GRID_WIDTH || pos.y < 0 || pos.y >= GRID_HEIGHT) {
            return true;
        }
        
        // Check for collision with snake body (except the tail which will move)
        for (let i = 0; i < this.snake.length - 1; i++) {
            const segment = this.snake[i];
            if (pos.x === segment.x && pos.y === segment.y) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Display an existential reflection with fade in/out effect
     */
    showReflection() {
        // Get a random reflection
        const reflection = this.reflectionGenerator.getRandomReflection();
        
        // Update the DOM
        const reflectionElement = document.getElementById('reflection');
        reflectionElement.textContent = reflection;
        
        // Set a flag to indicate we're showing a reflection
        this.showingReflection = true;
        
        // Clear previous timer if exists
        if (this.reflectionTimer) {
            clearTimeout(this.reflectionTimer);
        }
        
        // Fade in
        reflectionElement.classList.add('show');
        
        // Fade out after 4 seconds
        this.reflectionTimer = setTimeout(() => {
            reflectionElement.classList.remove('show');
            
            // Set flag after the fade-out transition completes
            setTimeout(() => {
                this.showingReflection = false;
            }, 1200); // Match the CSS transition duration
        }, 4000);
    }
}

// Game renderer using Canvas API
class GameRenderer {
    constructor(gameState) {
        this.gameState = gameState;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas dimensions
        this.canvas.width = GRID_WIDTH * GRID_SIZE;
        this.canvas.height = GRID_HEIGHT * GRID_SIZE;
    }
    
    /**
     * Render the current game state
     */
    render() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background grid (subtle)
        this.drawGrid();
        
        // Draw food
        this.drawFood();
        
        // Draw snake
        this.drawSnake();
        
        // Draw "Game Over" if the game is over
        if (this.gameState.gameOver) {
            this.drawGameOver();
        }
    }
    
    /**
     * Draw the background grid
     */
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let x = 0; x <= GRID_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * GRID_SIZE, 0);
            this.ctx.lineTo(x * GRID_SIZE, GRID_HEIGHT * GRID_SIZE);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= GRID_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * GRID_SIZE);
            this.ctx.lineTo(GRID_WIDTH * GRID_SIZE, y * GRID_SIZE);
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw the food
     */
    drawFood() {
        const food = this.gameState.food;
        const nextColor = this.gameState.colorManager.getNextColor();
        
        // Draw food as a circle with the next snake color
        this.ctx.fillStyle = nextColor;
        this.ctx.beginPath();
        this.ctx.arc(
            food.x * GRID_SIZE + GRID_SIZE / 2,
            food.y * GRID_SIZE + GRID_SIZE / 2,
            GRID_SIZE / 2 * 0.8, // Slightly smaller than a full cell
            0, 
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Add a subtle glow effect
        this.ctx.shadowColor = nextColor;
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(
            food.x * GRID_SIZE + GRID_SIZE / 2,
            food.y * GRID_SIZE + GRID_SIZE / 2,
            GRID_SIZE / 2 * 0.4,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.shadowBlur = 0; // Reset shadow
    }
    
    /**
     * Draw the snake
     */
    drawSnake() {
        const currentColor = this.gameState.colorManager.getCurrentColor();
        const snake = this.gameState.snake;
        
        // Draw each segment of the snake
        for (let i = 0; i < snake.length; i++) {
            const segment = snake[i];
            
            // Calculate segment color (slight gradient effect)
            let segmentColor = currentColor;
            if (i > 0) {
                // Convert hex to RGB for manipulation
                const r = parseInt(currentColor.slice(1, 3), 16);
                const g = parseInt(currentColor.slice(3, 5), 16);
                const b = parseInt(currentColor.slice(5, 7), 16);
                
                // Darken the color slightly for body segments
                const darkenFactor = 0.9 - (i / snake.length) * 0.1;
                const segmentR = Math.floor(r * darkenFactor);
                const segmentG = Math.floor(g * darkenFactor);
                const segmentB = Math.floor(b * darkenFactor);
                
                segmentColor = `rgb(${segmentR}, ${segmentG}, ${segmentB})`;
            }
            
            // Draw the segment
            this.ctx.fillStyle = segmentColor;
            
            // Head is slightly larger than body segments
            if (i === 0) {
                this.ctx.beginPath();
                this.ctx.arc(
                    segment.x * GRID_SIZE + GRID_SIZE / 2,
                    segment.y * GRID_SIZE + GRID_SIZE / 2,
                    GRID_SIZE / 2,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
                
                // Draw eyes
                this.drawSnakeEyes(segment);
            } else {
                // Body segments
                this.ctx.fillRect(
                    segment.x * GRID_SIZE + GRID_SIZE * 0.1,
                    segment.y * GRID_SIZE + GRID_SIZE * 0.1,
                    GRID_SIZE * 0.8,
                    GRID_SIZE * 0.8
                );
            }
        }
    }
    
    /**
     * Draw the snake's eyes based on direction
     * @param {Object} head - Head position
     */
    drawSnakeEyes(head) {
        this.ctx.fillStyle = 'white';
        
        let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
        const eyeSize = GRID_SIZE * 0.15;
        const eyeOffset = GRID_SIZE * 0.25;
        
        // Position eyes based on direction
        if (this.gameState.currentDirection === DIRECTIONS.UP) {
            leftEyeX = head.x * GRID_SIZE + GRID_SIZE / 2 - eyeOffset;
            leftEyeY = head.y * GRID_SIZE + GRID_SIZE / 2 - eyeOffset / 2;
            rightEyeX = head.x * GRID_SIZE + GRID_SIZE / 2 + eyeOffset;
            rightEyeY = head.y * GRID_SIZE + GRID_SIZE / 2 - eyeOffset / 2;
        } else if (this.gameState.currentDirection === DIRECTIONS.DOWN) {
            leftEyeX = head.x * GRID_SIZE + GRID_SIZE / 2 - eyeOffset;
            leftEyeY = head.y * GRID_SIZE + GRID_SIZE / 2 + eyeOffset / 2;
            rightEyeX = head.x * GRID_SIZE + GRID_SIZE / 2 + eyeOffset;
            rightEyeY = head.y * GRID_SIZE + GRID_SIZE / 2 + eyeOffset / 2;
        } else if (this.gameState.currentDirection === DIRECTIONS.LEFT) {
            leftEyeX = head.x * GRID_SIZE + GRID_SIZE / 2 - eyeOffset / 2;
            leftEyeY = head.y * GRID_SIZE + GRID_SIZE / 2 - eyeOffset;
            rightEyeX = head.x * GRID_SIZE + GRID_SIZE / 2 - eyeOffset / 2;
            rightEyeY = head.y * GRID_SIZE + GRID_SIZE / 2 + eyeOffset;
        } else { // RIGHT
            leftEyeX = head.x * GRID_SIZE + GRID_SIZE / 2 + eyeOffset / 2;
            leftEyeY = head.y * GRID_SIZE + GRID_SIZE / 2 - eyeOffset;
            rightEyeX = head.x * GRID_SIZE + GRID_SIZE / 2 + eyeOffset / 2;
            rightEyeY = head.y * GRID_SIZE + GRID_SIZE / 2 + eyeOffset;
        }
        
        // Draw eyes
        this.ctx.beginPath();
        this.ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw pupils
        this.ctx.fillStyle = 'black';
        
        this.ctx.beginPath();
        this.ctx.arc(leftEyeX, leftEyeY, eyeSize / 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(rightEyeX, rightEyeY, eyeSize / 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Draw game over screen
     */
    drawGameOver() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Game Over text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            'GAME OVER',
            this.canvas.width / 2,
            this.canvas.height / 2 - 20
        );
        
        // Final score
        this.ctx.font = '20px Arial';
        this.ctx.fillText(
            `Final Score: ${this.gameState.score}`,
            this.canvas.width / 2,
            this.canvas.height / 2 + 20
        );
        
        // Instruction to restart
        this.ctx.font = '16px Arial';
        this.ctx.fillText(
            'Press Reset to play again',
            this.canvas.width / 2,
            this.canvas.height / 2 + 60
        );
    }
}

// Game controller - manages the game loop and user interactions
class GameController {
    constructor() {
        this.gameState = new GameState();
        this.renderer = new GameRenderer(this.gameState);
        this.lastUpdateTime = 0;
        this.accumulator = 0;
        this.isRunning = false;
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.gameState.resetGame();
            if (!this.isRunning) {
                this.start();
            }
        });
        
        // Keyboard controls (for manual override, if desired)
        /*
        document.addEventListener('keydown', (e) => {
            if (this.gameState.gameOver) return;
            
            switch (e.key) {
                case 'ArrowUp':
                    if (this.gameState.currentDirection !== DIRECTIONS.DOWN) {
                        this.gameState.nextDirection = DIRECTIONS.UP;
                    }
                    break;
                case 'ArrowDown':
                    if (this.gameState.currentDirection !== DIRECTIONS.UP) {
                        this.gameState.nextDirection = DIRECTIONS.DOWN;
                    }
                    break;
                case 'ArrowLeft':
                    if (this.gameState.currentDirection !== DIRECTIONS.RIGHT) {
                        this.gameState.nextDirection = DIRECTIONS.LEFT;
                    }
                    break;
                case 'ArrowRight':
                    if (this.gameState.currentDirection !== DIRECTIONS.LEFT) {
                        this.gameState.nextDirection = DIRECTIONS.RIGHT;
                    }
                    break;
            }
        });
        */
    }
    
    /**
     * Start the game loop
     */
    start() {
        this.isRunning = true;
        this.lastUpdateTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    /**
     * Game loop - updates and renders the game
     * @param {DOMHighResTimeStamp} timestamp - Current timestamp
     */
    gameLoop(timestamp) {
        if (!this.isRunning) return;
        
        // Calculate time elapsed
        const deltaTime = timestamp - this.lastUpdateTime;
        this.lastUpdateTime = timestamp;
        this.accumulator += deltaTime;
        
        // Update game state at fixed intervals based on game speed
        while (this.accumulator >= this.gameState.gameSpeed) {
            this.gameState.update();
            this.accumulator -= this.gameState.gameSpeed;
            
            // Stop updating if game over
            if (this.gameState.gameOver) break;
        }
        
        // Render the current state
        this.renderer.render();
        
        // Continue the game loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Initialize and start the game when the window loads
window.addEventListener('load', () => {
    const gameController = new GameController();
    gameController.start();
});