document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('chessboard');
    const game = new Chess(); // Initialize the chess.js instance
    const rows = '87654321';
    const cols = 'abcdefgh';
    const pieceUnicode = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
    };

    function initBoard() {
        board.innerHTML = '';
        const currentBoard = game.board(); // Get current board state from chess.js

        currentBoard.forEach((row, i) => {
            row.forEach((piece, j) => {
                const square = document.createElement('div');
                square.className = 'square ' + ((i + j) % 2 ? 'dark' : 'light');
                square.id = cols[j] + rows[i];
                if (piece) {
                    const pieceElement = document.createElement('span');
                    pieceElement.classList.add('piece');
                    pieceElement.innerHTML = pieceUnicode[piece.type];
                    pieceElement.classList.add(piece.color === 'w' ? 'white' : 'black');
                    square.appendChild(pieceElement);
                }
                board.appendChild(square);
            });
        });
        setupDragAndDrop(); // Setup the piece drag and drop listeners
    }

    function makeMove(from, to) {
        const move = game.move({ from, to });
        if (move === null) return false; // Invalid move
        updateStatus(); // Update the game status
        return true;
    }

    function setupDragAndDrop() {
        let draggedPiece = null;
        let fromSquare = null;

        board.querySelectorAll('.piece').forEach(pieceElement => {
            pieceElement.setAttribute('draggable', true);

            pieceElement.addEventListener('dragstart', function (e) {
                draggedPiece = this;
                fromSquare = this.parentElement.id;
                e.dataTransfer.setData('text/plain', null); // Required for Firefox
            });

            pieceElement.addEventListener('dragend', function () {
                draggedPiece = null;
                fromSquare = null;
            });
        });

        board.querySelectorAll('.square').forEach(square => {
            square.addEventListener('dragover', function (e) {
                e.preventDefault(); // Allow the drop
            });

            square.addEventListener('drop', function () {
                const toSquare = this.id;
                if (makeMove(fromSquare, toSquare)) {
                    initBoard(); // Re-render the board
                }
            });
        });
    }

    function updateStatus() {
        if (game.in_checkmate()) {
            alert('Checkmate!');
        } else if (game.in_draw()) {
            alert('Draw!');
        } else {
            const turn = game.turn() === 'w' ? 'White' : 'Black';
            alert(turn + '\'s turn');
        }
    }

    initBoard(); // Initialize the board
});

// test