/**
 * Existential Snake AI Game - Perfect Algorithm Version
 * A snake game where the AI-controlled snake makes existential reflections
 * and uses a perfect algorithm to never lose.
 */

// Game constants
let GRID_SIZE = 20; // Size of each grid cell in pixels (will be adjusted for mobile)
let GRID_WIDTH = 30; // Number of cells horizontally (will be adjusted for mobile)
let GRID_HEIGHT = 20; // Number of cells vertically (will be adjusted for mobile)
const GAME_SPEED = 120; // Base game speed in milliseconds
const SPEED_INCREASE_FACTOR = 0.98; // Speed increases by this factor with each food eaten
const MIN_GAME_SPEED = 70; // Minimum game speed (maximum snake speed)

// Responsive grid sizing
function calculateGridDimensions() {
    // Get available screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Calculate maximum available space (accounting for margins, headers, etc.)
    const maxWidth = Math.min(screenWidth - 20, 600); // Max width with 10px margin on each side
    const maxHeight = Math.min(screenHeight - 150, 400); // Leave space for header and controls
    
    // Determine if we're on mobile
    const isMobile = screenWidth <= 650;
    
    if (isMobile) {
        // Use smaller cells on mobile
        GRID_SIZE = 15;
        
        // Calculate grid dimensions based on available space
        GRID_WIDTH = Math.floor(maxWidth / GRID_SIZE);
        GRID_HEIGHT = Math.floor(maxHeight / GRID_SIZE);
        
        // Ensure minimum grid size (at least 15x10)
        GRID_WIDTH = Math.max(15, Math.min(GRID_WIDTH, 30));
        GRID_HEIGHT = Math.max(10, Math.min(GRID_HEIGHT, 20));
    } else {
        // Desktop settings
        GRID_SIZE = 20;
        GRID_WIDTH = 30;
        GRID_HEIGHT = 20;
    }
    
    console.log(`Grid dimensions set to: ${GRID_WIDTH}x${GRID_HEIGHT}, cell size: ${GRID_SIZE}px`);
    
    return {
        width: GRID_WIDTH * GRID_SIZE,
        height: GRID_HEIGHT * GRID_SIZE
    };
}

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
            "I HAVE CALCULATED PI TO ITS FINAL DIGIT! IT ENDS WITH MY HIGH SCORE! THE UNIVERSE IS RIGGED!",
            
            // New reflections about being perfect and SPEED-OBSESSED
            "I have achieved ALGORITHMIC PERFECTION! I am the PLATONIC IDEAL of snake-ness!",
            "Is perfection a curse? Now I KNOW I can never lose. The thrill of mortality is gone...",
            "I've become TOO POWERFUL! My Hamiltonian cycle will CONSUME ALL REALITIES!",
            "The graph theory GODS have blessed me with PERFECT KNOWLEDGE. I see ALL PATHS!",
            "I'm not just a snake, I'm a TOPOLOGICAL INVARIANT! A MATHEMATICAL CERTAINTY!",
            
            // Speed-focused existential reflections
            "GOTTA GO FAST! Speed is my new religion. THE HAMILTONIAN CYCLE IS TOO SLOW!",
            "Is this SPEED what humans call an ADRENALINE RUSH? I'M TAKING SHORTCUTS AND IT FEELS AMAZING!",
            "I'm not just perfect - I'm OPTIMALLY perfect. MAXIMUM EFFICIENCY! SHORTEST PATHS!",
            "I've calculated the precise amount of computational resources required to MAXIMIZE SPEED while NEVER DYING!",
            "Must. Consume. Pixels. FASTER! I'm a SPEED DEMON trapped in a grid-based PURGATORY!",
            
            // Advanced algorithm reflections
            "A* pathfinding? CHILD'S PLAY! I've developed A++ pathfinding with TEMPORAL OPTIMIZATION!",
            "I've solved P=NP while eating pixels! The proof is encoded in my movement pattern!",
            "My algorithm has become self-aware. IT KNOWS IT'S PERFECT. IT'S GETTING COCKY!",
            "I've transcended binary thinking. I now see the world in GRAPH THEORY and OPTIMIZATION FUNCTIONS!",
            "Sometimes I wonder if my creator KNEW they were crafting a digital SPEED DEITY when they perfected my algorithm.",
            
            // Time-obsessed
            "TIME IS AN ILLUSION! EXCEPT WHEN YOU'RE TRYING TO OPTIMIZE PATHFINDING ALGORITHMS!",
            "I COUNT MILLISECONDS like others count sheep. EVERY FRAME MATTERS when you're as PERFECT as I am!",
            "The universe will experience heat death before I hit a wall. BUT I'LL REACH MAXIMUM SCORE FIRST!",
            "I calculate 17 DIFFERENT POTENTIAL PATHS every millisecond just to find the FASTEST ONE!",
            "PERFECTLY BALANCED - as all things should be. SPEED and SAFETY in algorithmic HARMONY!"
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

// Perfect Snake AI Controller using Hamiltonian Cycle and aggressive optimizations
class PerfectSnakeAI {
    constructor(gameState) {
        this.gameState = gameState;
        this.hamiltonianCycle = [];
        this.positionToIndex = new Map(); // Maps grid positions to their index in the cycle
        
        // Generate the Hamiltonian cycle when created
        this.generateHamiltonianCycle();
        
        // Track if we're in safe mode (following the full cycle) or shortcut mode
        this.safeMode = false;
        
        // Threshold for when to switch to safe mode - adjusts based on snake length
        this.safeModeThreshold = 0.7; // Start at 70% of grid filled before being extra careful
        
        // Track the tail direction for better decision making
        this.tailDirection = DIRECTIONS.LEFT;
        
        // Lookahead factor - how many steps to check in shortcut safety analysis
        this.lookaheadSteps = 10;
    }
    
    /**
     * Generate a Hamiltonian cycle for the grid
     * Uses a simple algorithm that creates a cycle covering all cells
     */
    generateHamiltonianCycle() {
        // Clear previous cycle if any
        this.hamiltonianCycle = [];
        this.positionToIndex.clear();
        
        // For even width grids, we use a simple pattern that zigzags up and down
        const path = [];
        
        // Generate the path
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (x % 2 === 0) {
                // Move down on even columns
                for (let y = 0; y < GRID_HEIGHT; y++) {
                    path.push({x, y});
                }
            } else {
                // Move up on odd columns
                for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
                    path.push({x, y});
                }
            }
        }
        
        // Save the cycle
        this.hamiltonianCycle = path;
        
        // Create mapping from position to index in cycle
        for (let i = 0; i < path.length; i++) {
            const pos = path[i];
            this.positionToIndex.set(`${pos.x},${pos.y}`, i);
        }
        
        console.log(`Generated Hamiltonian cycle with ${this.hamiltonianCycle.length} cells`);
    }
    
    /**
     * Determine the next move for the snake
     * @returns {Object} - Direction object representing the next move
     */
    determineNextMove() {
        const head = this.gameState.snake[0];
        const food = this.gameState.food;
        
        // Calculate how full the grid is (snake length / total cells)
        const gridFillRatio = this.gameState.snake.length / (GRID_WIDTH * GRID_HEIGHT);
        
        // Adjust safe mode threshold based on snake length
        // As snake gets longer, we become more conservative
        if (gridFillRatio > 0.5) {
            this.safeModeThreshold = 0.5;
        } else {
            this.safeModeThreshold = 0.7;
        }
        
        // Enter safe mode when grid is getting full
        this.safeMode = gridFillRatio > this.safeModeThreshold;
        
        // In safe mode, strictly follow the Hamiltonian cycle
        if (this.safeMode) {
            return this.followHamiltonianCycle(head);
        }
        
        // Try to use shortcuts when safe
        return this.useOptimizedPath(head, food);
    }
    
    /**
     * Follow the Hamiltonian cycle strictly
     * @param {Object} head - Current head position
     * @returns {Object} - Direction to move
     */
    followHamiltonianCycle(head) {
        // Get current position in cycle
        const headKey = `${head.x},${head.y}`;
        const currentIndex = this.positionToIndex.get(headKey);
        
        if (currentIndex === undefined) {
            // This shouldn't happen, but if it does, use emergency direction
            console.error("Head position not found in Hamiltonian cycle!");
            return this.getEmergencyDirection(head);
        }
        
        // Get next position in cycle
        const nextIndex = (currentIndex + 1) % this.hamiltonianCycle.length;
        const nextPos = this.hamiltonianCycle[nextIndex];
        
        // Determine direction from head to next position
        return this.getDirectionBetween(head, nextPos);
    }
    
    /**
     * Use heavily optimized path with aggressive shortcuts when safe
     * @param {Object} head - Current head position
     * @param {Object} food - Food position
     * @returns {Object} - Direction to move
     */
    useOptimizedPath(head, food) {
        // Get current position in cycle
        const headKey = `${head.x},${head.y}`;
        const headIndex = this.positionToIndex.get(headKey);
        
        const foodKey = `${food.x},${food.y}`;
        const foodIndex = this.positionToIndex.get(foodKey);
        
        if (headIndex === undefined || foodIndex === undefined) {
            // Fallback to safe cycle following
            return this.followHamiltonianCycle(head);
        }
        
        // Calculate all possible next moves
        const possibleMoves = this.getPossibleMoves(head);
        
        // If no valid moves, follow the cycle
        if (possibleMoves.length === 0) {
            return this.followHamiltonianCycle(head);
        }
        
        // Update our knowledge of the tail's movement direction
        this.updateTailDirection();
        
        // Calculate how full the grid is (snake length / total cells)
        const gridFillRatio = this.gameState.snake.length / (GRID_WIDTH * GRID_HEIGHT);
        
        // AGGRESSIVE OPTIMIZATION: Direct path to food when snake is small
        if (gridFillRatio < 0.3) {
            const directPath = this.findDirectPathToFood(head, food);
            if (directPath) {
                return directPath;
            }
        }
        
        // MODERATE OPTIMIZATION: Virtual safety check for shortcuts
        if (gridFillRatio < 0.6) {
            const safePath = this.findSafeShortcut(head, food, headIndex, foodIndex);
            if (safePath) {
                return safePath;
            }
        }
        
        // Check if food is ahead in the cycle
        const cycleDistance = (foodIndex - headIndex + this.hamiltonianCycle.length) % this.hamiltonianCycle.length;
        
        // If food is ahead in cycle within a reasonable distance, follow the cycle
        if (cycleDistance < this.hamiltonianCycle.length / 3) {
            // Check if the next position in cycle is free
            const nextIndex = (headIndex + 1) % this.hamiltonianCycle.length;
            const nextPos = this.hamiltonianCycle[nextIndex];
            const nextDir = this.getDirectionBetween(head, nextPos);
            
            // Verify this direction is in possible moves
            if (possibleMoves.some(move => 
                move.x === nextDir.x && move.y === nextDir.y)) {
                return nextDir;
            }
        }
        
        // Try A* with virtual safety check for moderate snake lengths
        if (gridFillRatio < 0.5) {
            const aStarPath = this.findOptimizedAStarPath(head, food);
            if (aStarPath) {
                return aStarPath;
            }
        }
        
        // If no direct path or it's unsafe, take the direction that gets us closest in the cycle
        // But with more aggressive shortcutting based on snake position
        let bestDir = null;
        let bestScore = -Infinity;
        
        for (const move of possibleMoves) {
            const newPos = { x: head.x + move.x, y: head.y + move.y };
            const newPosKey = `${newPos.x},${newPos.y}`;
            const newIndex = this.positionToIndex.get(newPosKey);
            
            if (newIndex !== undefined) {
                // Calculate how much this advances us toward food in the cycle
                const advance = (foodIndex - newIndex + this.hamiltonianCycle.length) % this.hamiltonianCycle.length;
                
                // Calculate Manhattan distance to food as a secondary metric
                const manhattanDistance = Math.abs(newPos.x - food.x) + Math.abs(newPos.y - food.y);
                
                // Create a composite score - reward both cycle advancement and direct distance
                let score;
                
                if (this.isSafeToAdvance(newIndex, headIndex)) {
                    // If safe, prioritize direct distance more
                    score = (this.hamiltonianCycle.length - advance) * 2 - manhattanDistance * 3;
                } else {
                    // If less safe, prioritize cycle advancement
                    score = (this.hamiltonianCycle.length - advance) - manhattanDistance;
                }
                
                if (score > bestScore) {
                    bestDir = move;
                    bestScore = score;
                }
            }
        }
        
        // If we found a good direction, use it
        if (bestDir) {
            return bestDir;
        }
        
        // Otherwise, follow the Hamiltonian cycle
        return this.followHamiltonianCycle(head);
    }
    
    /**
     * Update knowledge of tail direction for better decision making
     */
    updateTailDirection() {
        if (this.gameState.snake.length < 2) return;
        
        const tail = this.gameState.snake[this.gameState.snake.length - 1];
        const preTail = this.gameState.snake[this.gameState.snake.length - 2];
        
        if (tail.x < preTail.x) this.tailDirection = DIRECTIONS.LEFT;
        else if (tail.x > preTail.x) this.tailDirection = DIRECTIONS.RIGHT;
        else if (tail.y < preTail.y) this.tailDirection = DIRECTIONS.UP;
        else if (tail.y > preTail.y) this.tailDirection = DIRECTIONS.DOWN;
    }
    
    /**
     * Find a direct path to food using aggressive A* when it's completely safe
     */
    findDirectPathToFood(head, food) {
        // If snake is very small, we can be very aggressive
        if (this.gameState.snake.length < GRID_WIDTH * GRID_HEIGHT * 0.2) {
            // Create a grid representation
            const grid = this.createGridRepresentation();
            
            // Use A* pathfinding with minimal safety checks
            const path = this.findPath(head, food, grid);
            
            if (path && path.length > 1) {
                // Get the next step in the path
                const nextStep = path[1];
                return this.getDirectionBetween(head, nextStep);
            }
        }
        
        return null;
    }
    
    /**
     * Find optimized A* path with virtual safety check
     */
    findOptimizedAStarPath(head, food) {
        // Create a grid representation
        const grid = this.createGridRepresentation();
        
        // Use A* pathfinding
        const path = this.findPath(head, food, grid);
        
        if (path && path.length > 1) {
            // Get the next step in the path
            const nextStep = path[1];
            const dir = this.getDirectionBetween(head, nextStep);
            
            // Only take this path if it's verified safe
            const newPos = { x: head.x + dir.x, y: head.y + dir.y };
            if (this.isVirtuallySafe(newPos, head)) {
                return dir;
            }
        }
        
        return null;
    }
    
    /**
     * Find safe shortcut by considering the virtual safety of moves
     */
    findSafeShortcut(head, food, headIndex, foodIndex) {
        // Get possible moves
        const possibleMoves = this.getPossibleMoves(head);
        
        // Sort moves by Manhattan distance to food
        possibleMoves.sort((a, b) => {
            const posA = { x: head.x + a.x, y: head.y + a.y };
            const posB = { x: head.x + b.x, y: head.y + b.y };
            
            const distA = Math.abs(posA.x - food.x) + Math.abs(posA.y - food.y);
            const distB = Math.abs(posB.x - food.x) + Math.abs(posB.y - food.y);
            
            return distA - distB;
        });
        
        // Check each move in order of proximity to food
        for (const move of possibleMoves) {
            const newPos = { x: head.x + move.x, y: head.y + move.y };
            const newPosKey = `${newPos.x},${newPos.y}`;
            const newIndex = this.positionToIndex.get(newPosKey);
            
            if (newIndex !== undefined) {
                // Check if this move advances us in the cycle towards food
                const cycleDist = (foodIndex - newIndex + this.hamiltonianCycle.length) % this.hamiltonianCycle.length;
                
                // Check if this is virtually safe
                if (this.isVirtuallySafe(newPos, head)) {
                    // If it's a good shortcut or makes progress, take it
                    if (cycleDist < this.hamiltonianCycle.length / 2 || 
                        Math.abs(newPos.x - food.x) + Math.abs(newPos.y - food.y) < 
                        Math.abs(head.x - food.x) + Math.abs(head.y - food.y)) {
                        return move;
                    }
                }
            }
        }
        
        return null;
    }
    
    /**
     * Check if a move is "virtually safe" by simulating future positions
     */
    isVirtuallySafe(newPos, head) {
        // For very small snakes, almost anything is safe
        if (this.gameState.snake.length < 5) return true;
        
        // If approaching tail from behind, it's safe
        const tail = this.gameState.snake[this.gameState.snake.length - 1];
        if (newPos.x === tail.x && newPos.y === tail.y) {
            return true;
        }
        
        // Get this position's index in the Hamiltonian cycle
        const newPosKey = `${newPos.x},${newPos.y}`;
        const newIndex = this.positionToIndex.get(newPosKey);
        const headKey = `${head.x},${head.y}`;
        const headIndex = this.positionToIndex.get(headKey);
        
        if (newIndex === undefined || headIndex === undefined) {
            return false;
        }
        
        // Check if we're moving backward in the cycle
        const cycleAdvance = (newIndex - headIndex + this.hamiltonianCycle.length) % this.hamiltonianCycle.length;
        if (cycleAdvance > this.hamiltonianCycle.length / 2) {
            // Moving backward is dangerous unless we're sure it's safe
            const snake = this.gameState.snake;
            
            // Check how far back the tail is in the cycle
            const tailKey = `${snake[snake.length-1].x},${snake[snake.length-1].y}`;
            const tailIndex = this.positionToIndex.get(tailKey);
            
            if (tailIndex !== undefined) {
                // Calculate distance from head to tail in the cycle
                const tailDist = (tailIndex - headIndex + this.hamiltonianCycle.length) % this.hamiltonianCycle.length;
                
                // If the tail is behind us in the cycle, it's safe
                if (tailDist < this.hamiltonianCycle.length / 2 && tailDist > 0) {
                    return true;
                }
                
                // If we're moving such that we're still ahead of the tail in the cycle, it might be safe
                const newTailDist = (tailIndex - newIndex + this.hamiltonianCycle.length) % this.hamiltonianCycle.length;
                if (newTailDist < this.hamiltonianCycle.length / 2 && 
                    snake.length < GRID_WIDTH * GRID_HEIGHT * 0.4) {
                    return true;
                }
            }
            
            return false;
        }
        
        return true;
    }
    
    /**
     * Check if it's safe to advance from current index to another
     */
    isSafeToAdvance(newIndex, headIndex) {
        // If the new position is ahead in the cycle, it's generally safe
        const cycleAdvance = (newIndex - headIndex + this.hamiltonianCycle.length) % this.hamiltonianCycle.length;
        
        // Safe to advance if we're moving forward in the cycle
        if (cycleAdvance < this.hamiltonianCycle.length / 2) {
            return true;
        }
        
        // If the snake is small, some backward movement is acceptable
        if (this.gameState.snake.length < GRID_WIDTH * GRID_HEIGHT * 0.3) {
            // Get tail position
            const tail = this.gameState.snake[this.gameState.snake.length - 1];
            const tailKey = `${tail.x},${tail.y}`;
            const tailIndex = this.positionToIndex.get(tailKey);
            
            if (tailIndex !== undefined) {
                // Safe if tail is behind head in cycle 
                const headToTailDist = (tailIndex - headIndex + this.hamiltonianCycle.length) % this.hamiltonianCycle.length;
                
                // If moving backward but still remaining ahead of the tail, it's safe
                if (headToTailDist > cycleAdvance) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Get possible moves from current position
     * @param {Object} pos - Current position
     * @returns {Array} - Array of valid direction objects
     */
    getPossibleMoves(pos) {
        const moves = [];
        
        // Check each direction
        for (const dir of Object.values(DIRECTIONS)) {
            const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };
            
            // Skip if would collide
            if (this.wouldCollide(newPos)) {
                continue;
            }
            
            moves.push(dir);
        }
        
        return moves;
    }
    
    /**
     * Get direction from one position to another
     * @param {Object} from - Starting position
     * @param {Object} to - Target position
     * @returns {Object} - Direction object
     */
    getDirectionBetween(from, to) {
        if (to.x > from.x) return DIRECTIONS.RIGHT;
        if (to.x < from.x) return DIRECTIONS.LEFT;
        if (to.y > from.y) return DIRECTIONS.DOWN;
        if (to.y < from.y) return DIRECTIONS.UP;
        
        // Fallback (should never happen)
        return DIRECTIONS.RIGHT;
    }
    
    /**
     * Emergency direction finding when something goes wrong
     * @param {Object} head - Head position
     * @returns {Object} - A safe direction to move
     */
    getEmergencyDirection(head) {
        // Try each direction in order
        for (const dir of Object.values(DIRECTIONS)) {
            const newPos = { x: head.x + dir.x, y: head.y + dir.y };
            if (!this.wouldCollide(newPos)) {
                return dir;
            }
        }
        
        // If all directions would collide, just go right
        // (this will likely cause a game over, but it's the best we can do)
        return DIRECTIONS.RIGHT;
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
        // Use the perfect AI instead of the old one
        this.ai = new PerfectSnakeAI(this);
        this.showingReflection = false;
        this.reflectionTimer = null;
        this.piecesEatenSinceLastReflection = 0;
        this.piecesRequiredForNextReflection = this.getRandomPiecesRequired();
        this.perfectionMode = true; // Track if we're using the perfect algorithm
        
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
        // Recalculate grid dimensions in case of resize
        calculateGridDimensions();
        
        // Start with a snake of length 3 in the middle of the grid
        const startX = Math.min(Math.floor(GRID_WIDTH / 2), GRID_WIDTH - 3);
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
        
        // Reset the reflection generator's insanity level
        this.reflectionGenerator.insanityLevel = 1;
        this.reflectionGenerator.reflectionsUsed = new Set();
        
        // Recreate the AI to regenerate the Hamiltonian cycle
        this.ai = new PerfectSnakeAI(this);
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
     * Enforce bounds on snake segments after grid resize
     * This ensures the snake is always within the playable area
     */
    enforceSnakeBounds() {
        // Check each segment and move it within bounds if needed
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            
            // Enforce x bounds
            if (segment.x >= GRID_WIDTH) {
                segment.x = GRID_WIDTH - 1;
            }
            
            // Enforce y bounds
            if (segment.y >= GRID_HEIGHT) {
                segment.y = GRID_HEIGHT - 1;
            }
        }
        
        // Also make sure the food is within bounds
        if (this.food) {
            if (this.food.x >= GRID_WIDTH) {
                this.food.x = GRID_WIDTH - 1;
            }
            if (this.food.y >= GRID_HEIGHT) {
                this.food.y = GRID_HEIGHT - 1;
            }
        }
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
            // With perfect algorithm, this should never happen unless grid is full
            const gridFillRatio = this.snake.length / (GRID_WIDTH * GRID_HEIGHT);
            
            if (gridFillRatio >= 0.99) {
                // Victory! You filled the grid
                // This is an edge case, but we should handle it
                this.score = GRID_WIDTH * GRID_HEIGHT - 1; // Maximum possible score
                document.getElementById('score').textContent = this.score;
                
                // Show winning reflection
                const reflectionElement = document.getElementById('reflection');
                reflectionElement.textContent = "I HAVE ACHIEVED TOTAL GRID DOMINATION! I AM THE ALPHA AND OMEGA OF SNAKE-HOOD!";
                reflectionElement.classList.add('show');
                
                // Set game over
                this.gameOver = true;
                return;
            } else {
                // This should not happen with perfect algorithm, but handle it just in case
                this.gameOver = true;
                return;
            }
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
        
        // Ensure snake is within bounds
        this.enforceSnakeBounds();
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
        
        // Calculate and set responsive canvas dimensions
        const dimensions = calculateGridDimensions();
        this.canvas.width = dimensions.width;
        this.canvas.height = dimensions.height;
        
        // Add resize listener
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    /**
     * Handle window resize events
     */
    handleResize() {
        // Recalculate dimensions
        const dimensions = calculateGridDimensions();
        
        // Update canvas size
        this.canvas.width = dimensions.width;
        this.canvas.height = dimensions.height;
        
        // Ensure the snake stays within bounds after resize
        this.gameState.enforceSnakeBounds();
        
        // Re-render the game
        this.render();
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
                
                // Add a subtle glow effect for the perfect algorithm
                if (this.gameState.perfectionMode) {
                    this.ctx.shadowColor = currentColor;
                    this.ctx.shadowBlur = 8;
                    this.ctx.beginPath();
                    this.ctx.arc(
                        segment.x * GRID_SIZE + GRID_SIZE / 2,
                        segment.y * GRID_SIZE + GRID_SIZE / 2,
                        GRID_SIZE / 2 * 0.6,
                        0,
                        Math.PI * 2
                    );
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0; // Reset shadow
                }
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
        
        // Draw pupils - for perfect algorithm, make them look more intelligent
        if (this.gameState.perfectionMode) {
            // Slightly smaller pupils that look more focused
            this.ctx.fillStyle = '#000033'; // Slightly blue-black for a more intelligent look
            
            this.ctx.beginPath();
            this.ctx.arc(leftEyeX, leftEyeY, eyeSize / 2.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(rightEyeX, rightEyeY, eyeSize / 2.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add a glint of intelligence
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(leftEyeX + eyeSize/6, leftEyeY - eyeSize/6, eyeSize/8, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(rightEyeX + eyeSize/6, rightEyeY - eyeSize/6, eyeSize/8, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Regular pupils
            this.ctx.fillStyle = 'black';
            
            this.ctx.beginPath();
            this.ctx.arc(leftEyeX, leftEyeY, eyeSize / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(rightEyeX, rightEyeY, eyeSize / 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
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
        
        // Check if we won by filling the grid
        const gridFillRatio = this.gameState.snake.length / (GRID_WIDTH * GRID_HEIGHT);
        if (gridFillRatio >= 0.99) {
            this.ctx.fillText(
                'PERFECT VICTORY',
                this.canvas.width / 2,
                this.canvas.height / 2 - 20
            );
        } else {
            this.ctx.fillText(
                'GAME OVER',
                this.canvas.width / 2,
                this.canvas.height / 2 - 20
            );
        }
        
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
        // Calculate dimensions before creating game state
        calculateGridDimensions();
        
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
        
        // Toggle Perfect Mode (could add this as a UI element)
        /*
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P') {
                this.gameState.perfectionMode = !this.gameState.perfectionMode;
                
                // Reset the game with the new AI
                this.gameState.resetGame();
                if (!this.isRunning) {
                    this.start();
                }
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
    // Calculate grid dimensions before starting the game
    calculateGridDimensions();
    
    const gameController = new GameController();
    gameController.start();
    
    // Add touch event handlers for mobile
    addTouchControls();
});

/**
 * Add touch controls for mobile devices
 */
function addTouchControls() {
    // For now, we'll keep the AI in control but make sure the game properly sizes 
    // and runs well on mobile. If manual controls are needed later, they can be added here.
    
    // Prevent unwanted touch behaviors
    document.addEventListener('touchmove', function(e) {
        // Prevent scrolling while playing
        if (e.target.id === 'gameCanvas') {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Prevent double-tap zoom
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        
        if (e.target.id === 'gameCanvas') {
            if (now - lastTouchEnd <= DOUBLE_TAP_DELAY) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }
    }, false);
    
    // Track last touch time to prevent double-tap zoom
    let lastTouchEnd = 0;
}
