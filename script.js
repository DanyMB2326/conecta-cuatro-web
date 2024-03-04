document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const resetButton = document.getElementById("reset");
    const restartButton = document.getElementById("restart");

    let currentPlayer = "rojo";
    let gameBoard = Array.from({ length: 6 }, () => Array(7).fill(null));
    let gameOver = false;

    // Crear celdas del tablero
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            board.appendChild(cell);
        }
    }

    // Manejar efecto hover sobre las celdas
    board.addEventListener("mouseover", (e) => {
        if (!gameOver) {
            const cell = e.target;
            if (cell.classList.contains("cell")) {
                const col = cell.dataset.col;
                const row = getEmptyRow(parseInt(col));
                if (row !== null) {
                    cell.style.backgroundColor = currentPlayer === "rojo" ? "#e74c3c80" : "#f1c40f80";
                }
            }
        }
    });

    board.addEventListener("mouseout", (e) => {
        const cell = e.target;
        if (cell.classList.contains("cell")) {
            cell.style.backgroundColor = "#ecf0f1";
        }
    });

    // Manejar clic en las celdas
    board.addEventListener("click", (e) => {
        if (!gameOver) {
            const cell = e.target;
            if (cell.classList.contains("cell")) {
                const col = cell.dataset.col;
                const row = getEmptyRow(parseInt(col));
                if (row !== null) {
                    placeChip(row, parseInt(col));
                    if (checkWin(row, parseInt(col))) {
                        gameOver = true;
                        setTimeout(() => {
                            alert(`${currentPlayer.toUpperCase()} gana!`);
                        }, 100);
                    } else if (checkDraw()) {
                        gameOver = true;
                        setTimeout(() => {
                            alert("¡Es un empate!");
                        }, 100);
                    } else {
                        currentPlayer = currentPlayer === "rojo" ? "amarillo" : "rojo";
                    }
                }
            }
        }
    });

    // Reiniciar juego
    resetButton.addEventListener("click", () => {
        gameBoard = Array.from({ length: 6 }, () => Array(7).fill(null));
        currentPlayer = "rojo";
        gameOver = false;
        updateBoard();
    });

    // Reiniciar juego
    restartButton.addEventListener("click", () => {
        gameBoard = Array.from({ length: 6 }, () => Array(7).fill(null));
        currentPlayer = "rojo";
        gameOver = false;
        updateBoard();
    });

    // Actualizar vista del tablero
    function updateBoard() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const chip = gameBoard[row][col];
            if (chip === "rojo") {
                cell.innerHTML = "●";
                cell.style.color = "#e74c3c";
            } else if (chip === "amarillo") {
                cell.innerHTML = "●";
                cell.style.color = "#f1c40f";
            } else {
                cell.innerHTML = "";
                cell.style.color = "#ecf0f1";
            }
        });
    }

    // Colocar ficha en el tablero
    function placeChip(row, col) {
        gameBoard[row][col] = currentPlayer;
        updateBoard();
    }

    // Obtener la fila vacía para una columna
    function getEmptyRow(col) {
        for (let row = 5; row >= 0; row--) {
            if (gameBoard[row][col] === null) {
                return row;
            }
        }
        return null;
    }

    // Comprobar si hay una victoria
    function checkWin(row, col) {
        const directions = [
            [0, 1], // horizontal
            [1, 0], // vertical
            [1, 1], // diagonal /
            [1, -1] // diagonal \
        ];

        for (const [dx, dy] of directions) {
            let count = 1; // contador de fichas consecutivas
            for (let dir = -1; dir <= 1; dir += 2) {
                for (let i = 1; i < 4; i++) {
                    const newRow = row + dir * i * dx;
                    const newCol = col + dir * i * dy;
                    if (
                        newRow < 0 ||
                        newRow >= 6 ||
                        newCol < 0 ||
                        newCol >= 7 ||
                        gameBoard[newRow][newCol] !== currentPlayer
                    ) {
                        break;
                    }
                    count++;
                }
            }
            if (count >= 4) {
                return true;
            }
        }

        return false;
    }

    // Comprobar si hay un empate
    function checkDraw() {
        return gameBoard.every((row) => row.every((cell) => cell !== null));
    }
});
