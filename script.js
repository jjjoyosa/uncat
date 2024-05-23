const boardSize = 6; // Increased board size to allow the red block to slide out
const blockSize = 60; // Each block is 60x60 pixels
const gameBoard = document.getElementById('game-board');

// Initial game state
const initialBlocks = [
    {id: 1, x: 0, y: 2, width: 1, height: 1, color: 'red', horizontal: true},
    {id: 2, x: 0, y: 0, width: 2, height: 1, color: 'grey', horizontal: true},
    {id: 3, x: 4, y: 1, width: 1, height: 3, color: 'grey', horizontal: false},
    {id: 4, x: 0, y: 3, width: 1, height: 3, color: 'grey', horizontal: false},
    {id: 5, x: 2, y: 4, width: 3, height: 1, color: 'grey', horizontal: true},
    {id: 6, x: 1, y: 5, width: 3, height: 1, color: 'grey', horizontal: true},
    {id: 7, x: 1, y: 3, width: 1, height: 2, color: 'grey', horizontal: false},
    {id: 8, x: 5, y: 3, width: 1, height: 3, color: 'grey', horizontal: false},
    {id: 9, x: 5, y: 0, width: 1, height: 2, color: 'grey', horizontal: false},
    {id: 10, x: 3, y: 0, width: 1, height: 3, color: 'grey', horizontal: false},
    {id: 11, x: 2, y: 0, width: 1, height: 2, color: 'grey', horizontal: false},
];

let blocks = JSON.parse(JSON.stringify(initialBlocks));
let selectedBlock = null;
let startX, startY, offsetX, offsetY;
let gameWon = false;

// Add touch event listeners to block elements
function addTouchEvents(blockElement, block) {
    blockElement.addEventListener('touchstart', (e) => onTouchStart(e, block));
    blockElement.addEventListener('touchmove', onTouchMove);
    blockElement.addEventListener('touchend', onTouchEnd);
}


function onTouchStart(event, block) {
    event.preventDefault();
    selectedBlock = block;
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    offsetX = selectedBlock.x;
    offsetY = selectedBlock.y;
}

function onTouchMove(event) {
    if (!selectedBlock) return;
    event.preventDefault();
    const touch = event.touches[0];
    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;
    let newX = offsetX;
    let newY = offsetY;

    if (selectedBlock.horizontal) {
        newX += Math.round(dx / blockSize);
    } else {
        newY += Math.round(dy / blockSize);
    }

    if (isValidMove(selectedBlock, newX, newY)) {
        selectedBlock.x = newX;
        selectedBlock.y = newY;
    }

    if (!gameWon && selectedBlock.color === 'red' && selectedBlock.x + selectedBlock.width === boardSize) {
        // Refresh the page
        gameWon = true;
        window.location.href = '/welcome';
    }

    renderBoard();
}

function onTouchEnd() {
    selectedBlock = null;
}

function createBlockElement(block) {
    const blockElement = document.createElement('div');
    blockElement.className = `block ${block.color}`;
    blockElement.style.width = `${block.width * blockSize}px`;
    blockElement.style.height = `${block.height * blockSize}px`;
    blockElement.style.left = `${block.x * blockSize}px`;
    blockElement.style.top = `${block.y * blockSize}px`;
    addTouchEvents(blockElement, block); // Add touch events
    blockElement.addEventListener('mousedown', (e) => onBlockMouseDown(e, block));
    return blockElement;
}

function renderBoard() {
    gameBoard.innerHTML = '';
    blocks.forEach(block => {
        gameBoard.appendChild(createBlockElement(block));
    });
}

function onBlockMouseDown(event, block) {
    selectedBlock = block;
    startX = event.clientX;
    startY = event.clientY;
    offsetX = selectedBlock.x;
    offsetY = selectedBlock.y;
    document.addEventListener('mousemove', onBlockMouseMove);
    document.addEventListener('mouseup', onBlockMouseUp);
}

function onBlockMouseMove(event) {
    if (!selectedBlock) return;

    let dx = event.clientX - startX;
    let dy = event.clientY - startY;
    let newX = offsetX;
    let newY = offsetY;

    if (selectedBlock.horizontal) {
        newX += Math.round(dx / blockSize);
    } else {
        newY += Math.round(dy / blockSize);
    }

    if (isValidMove(selectedBlock, newX, newY)) {
        selectedBlock.x = newX;
        selectedBlock.y = newY;
    }

    if (!gameWon && selectedBlock.color === 'red' && selectedBlock.x + selectedBlock.width === boardSize) {
        // Refresh the page
        gameWon = true;
        window.location.href = '/welcome';
    }

    renderBoard();
}

function onBlockMouseUp() {
    selectedBlock = null;
    document.removeEventListener('mousemove', onBlockMouseMove);
    document.removeEventListener('mouseup', onBlockMouseUp);
}

function isValidMove(block, newX, newY) {

    if (block.horizontal) {
        if (newX < 0 || newX + block.width > boardSize) return false;
    } else {
        if (newY < 0 || newY + block.height > boardSize) return false;
    }

    for (let otherBlock of blocks) {
        if (otherBlock.id !== block.id) {
            if (block.horizontal) {
                if (
                    newY < otherBlock.y + otherBlock.height &&
                    newY + block.height > otherBlock.y &&
                    newX < otherBlock.x + otherBlock.width &&
                    newX + block.width > otherBlock.x
                ) {
                    return false;
                }
            } else {
                if (
                    newX < otherBlock.x + otherBlock.width &&
                    newX + block.width > otherBlock.x &&
                    newY < otherBlock.y + otherBlock.height &&
                    newY + block.height > otherBlock.y
                ) {
                    return false;
                }
            }
        }
    }

    return true;
}

function initGame() {
    renderBoard();
}

initGame();
