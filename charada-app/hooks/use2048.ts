import { useState, useCallback, useEffect, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';

export type Tile = {
  id: number;
  value: number;
  row: number;
  col: number;
  merged?: boolean;
  isNew?: boolean;
};

export type Direction = 'up' | 'down' | 'left' | 'right';

const GRID_SIZE = 4;

const getEmptyBoard = (): (number | null)[][] => 
  Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));

export const getTileColor = (value: number): string => {
  const colors: Record<number, string> = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
  };
  return colors[value] || '#3c3a32';
};

export const getTextColor = (value: number): string => {
  return value <= 4 ? '#776e65' : '#f9f6f2';
};

let tileIdCounter = 0;

export const use2048 = () => {
  const [board, setBoard] = useState<(number | null)[][]>(getEmptyBoard());
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasInitializedRef = useRef(false);

  const isAnimatingRef = useRef(false);
  const gameOverRef = useRef(false);
  const wonRef = useRef(false);
  const boardRef = useRef(board);
  const scoreRef = useRef(score);

  // Update refs
  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    wonRef.current = won;
  }, [won]);

  // Cargar mejor score desde storage (en background)
  useEffect(() => {
    const loadBestScore = async () => {
      try {
        const stored = await SecureStore.getItemAsync('2048_best_score');
        if (stored && !isNaN(parseInt(stored, 10))) {
          setBestScore(parseInt(stored, 10));
        }
      } catch (e) {
        console.log('Error loading best score:', e);
      }
    };
    loadBestScore();
  }, []);

  const saveBestScore = useCallback(async (newScore: number) => {
    if (newScore > bestScore) {
      setBestScore(newScore);
      try {
        await SecureStore.setItemAsync('2048_best_score', newScore.toString());
      } catch (e) {
        console.log('Error saving best score:', e);
      }
    }
  }, [bestScore]);

  const addRandomTile = useCallback((currentBoard: (number | null)[][]): { board: (number | null)[][], newTile: Tile | null } => {
    const emptyCells: { row: number; col: number }[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (currentBoard[row][col] === null) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return { board: currentBoard, newTile: null };
    }

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    
    const newBoard = currentBoard.map(row => [...row]);
    newBoard[randomCell.row][randomCell.col] = value;

    const newTile: Tile = {
      id: ++tileIdCounter,
      value,
      row: randomCell.row,
      col: randomCell.col,
      isNew: true,
    };

    return { board: newBoard, newTile };
  }, []);

  const initializeGame = useCallback(() => {
    tileIdCounter = 0;
    let newBoard = getEmptyBoard();
    const result1 = addRandomTile(newBoard);
    newBoard = result1.board;
    const result2 = addRandomTile(newBoard);
    newBoard = result2.board;

    const initialTiles: Tile[] = [];
    if (result1.newTile) {
      initialTiles.push({ ...result1.newTile, isNew: false });
    }
    if (result2.newTile) {
      initialTiles.push({ ...result2.newTile, isNew: false });
    }

    setBoard(newBoard);
    setTiles(initialTiles);
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, [addRandomTile]);

  const move = useCallback((direction: Direction): boolean => {
    if (isAnimatingRef.current || gameOverRef.current) return false;

    setIsAnimating(true);

    let moved = false;
    let newScore = scoreRef.current;
    let currentBoard = boardRef.current;
    let newBoard = currentBoard.map(row => [...row]);
    const mergedPositions: { row: number; col: number }[] = [];

    const processLine = (line: (number | null)[]): (number | null)[] => {
      const filtered = line.filter(val => val !== null) as number[];
      const result: (number | null)[] = [];
      
      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          const mergedValue = filtered[i] * 2;
          result.push(mergedValue);
          newScore += mergedValue;
          mergedPositions.push({ row: 0, col: result.length - 1 });
          if (mergedValue === 2048 && !wonRef.current) {
            setWon(true);
          }
          i++;
        } else {
          result.push(filtered[i]);
        }
      }
      
      while (result.length < GRID_SIZE) {
        result.push(null);
      }
      
      return result;
    };

    for (let i = 0; i < GRID_SIZE; i++) {
      let line: (number | null)[];
      
      switch (direction) {
        case 'left':
          line = [...currentBoard[i]];
          break;
        case 'right':
          line = [...currentBoard[i]].reverse();
          break;
        case 'up':
          line = [currentBoard[0][i], currentBoard[1][i], currentBoard[2][i], currentBoard[3][i]];
          break;
        case 'down':
          line = [currentBoard[3][i], currentBoard[2][i], currentBoard[1][i], currentBoard[0][i]];
          break;
      }

      const originalLineStr = JSON.stringify(line);
      const processed = processLine(line);
      const processedStr = JSON.stringify(processed);

      if (originalLineStr !== processedStr) {
        moved = true;
      }

      switch (direction) {
        case 'left':
          newBoard[i] = processed;
          break;
        case 'right':
          newBoard[i] = processed.reverse();
          break;
        case 'up':
          for (let j = 0; j < GRID_SIZE; j++) {
            newBoard[j][i] = processed[j];
          }
          break;
        case 'down':
          for (let j = 0; j < GRID_SIZE; j++) {
            newBoard[GRID_SIZE - 1 - j][i] = processed[j];
          }
          break;
      }
    }

    if (moved) {
      const { board: finalBoard, newTile } = addRandomTile(newBoard);
      newBoard = finalBoard;

      // Rebuild tiles array
      const newTiles: Tile[] = [];
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const value = finalBoard[row][col];
          if (value !== null) {
            newTiles.push({
              id: ++tileIdCounter,
              value,
              row,
              col,
              merged: mergedPositions.some(p => p.col === col && p.row === row),
            });
          }
        }
      }

      setTiles(newTiles);
      setBoard(newBoard);
      setScore(newScore);
      saveBestScore(newScore);

      // Check game over
      let canMove = false;
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (finalBoard[row][col] === null) {
            canMove = true;
            break;
          }
          if (col < GRID_SIZE - 1 && finalBoard[row][col] === finalBoard[row][col + 1]) {
            canMove = true;
          }
          if (row < GRID_SIZE - 1 && finalBoard[row][col] === finalBoard[row + 1][col]) {
            canMove = true;
          }
        }
        if (canMove) break;
      }

      if (!canMove) {
        setGameOver(true);
      }
    }

    setTimeout(() => setIsAnimating(false), 150);
    return moved;
  }, [addRandomTile, saveBestScore]);

  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  // Initialize on mount
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      initializeGame();
    }
  }, [initializeGame]);

  return {
    tiles,
    board,
    score,
    bestScore,
    gameOver,
    won,
    isAnimating,
    move,
    resetGame,
    getTileColor,
    getTextColor,
    gridSize: GRID_SIZE,
  };
};
