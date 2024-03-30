//размер поля
const GAMEFIELD_SIZE = {x: 10, y: 10} //константа кол-ва квадратов по X и Y 
let snakeMoveInterval //здесь будет храниться интервал
let gameFieldSquares //здесь будут храниться все квадраты игрового поля

let currentAxis = [1, 0] //активный вектор смещения

//все возможные вектора смещения
const ARROW_AXIS = {
  ArrowUp : [0, -1],
  ArrowRight: [1, 0],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0]
}

//Тело змеи
let snake = [[0, 0]] 

//создание ячейки
const createSquare = () => {
  const square = document.createElement('div')
  square.classList.add('square')
  return square
}

//создание игрового поля
const createGameField = () => {
  const {x, y} = GAMEFIELD_SIZE
  const root = document.getElementById('squareField');
  root.style.gridTemplateColumns = `repeat(${x}, 1fr)`;
  
  const gameField = new Array(x * y)
    .fill(0)
    .reduce((acc, cell)=>{
      const square = createSquare()
      acc.appendChild(square)
      return acc
    }, root)
  return gameField
}

const getSquareIndexFromPosition = ([x, y]) => {
  return y*GAMEFIELD_SIZE.y + x
}

//получение нужной клетки по координатам
const getSquareFromPosition  = (position) => {
  return gameFieldSquares[getSquareIndexFromPosition(position)]
}

const toggleSquare = (position) => {
    const squareIndex = getSquareIndexFromPosition(position)
    const square = gameFieldSquares[squareIndex]
    square.classList.toggle('snake')
}

//создание еды в рандомной пустой клетке.
const createFood = () => {
  const emptySquares = gameFieldSquares.filter((square)=>!square.classList.contains('snake'))
  const randomIndex = Math.floor(Math.random() * emptySquares.length)
  emptySquares[randomIndex].classList.toggle('food')
}

//движение


const moveSnake = () => {
  const [axisX, axisY] = currentAxis 
  const [headPosition] = snake 
    
  const nextHeadPosition = [headPosition[0] + axisX, headPosition[1] + axisY] 
  

  const xAxisIsValid = nextHeadPosition[0] >= 0 && nextHeadPosition[0] < GAMEFIELD_SIZE.x
  const yAxisIsValid = nextHeadPosition[1] >= 0 && nextHeadPosition[1] < GAMEFIELD_SIZE.y
  const isValidPosition = xAxisIsValid && yAxisIsValid

  if(!isValidPosition) 
    return gameOver()
  
 
  const nextHeadSquare = getSquareFromPosition(nextHeadPosition) 
  nextHeadSquare.classList.toggle('snake')
  
  //добавляем в тело змеи новую ячейку
  snake.unshift(nextHeadPosition)
   
  // Проверяем есть ли еда в новой позиции
  if(nextHeadSquare.classList.contains('food')) {
    //если есть еда в новой позиции, то отключаем текущую еду
    nextHeadSquare.classList.toggle('food')
    //создаем новую
    createFood()
    //выходим
    return 
  }
  
  const tailPosition = snake.pop() //удаляем хвост и извлекаем его позицию
  const tailSquare = getSquareFromPosition(tailPosition) 
  tailSquare.classList.toggle('snake')
}

const startGame = () => {
  gameFieldSquares = Array.from(createGameField().childNodes)


  document.onkeydown = ({key}) => {
    if (key in ARROW_AXIS) {
      currentAxis = ARROW_AXIS[key]
    }
  }
  snake.forEach(toggleSquare)
  createFood()
  
  snakeMoveInterval = setInterval(()=>{
    moveSnake()
  }, 500)
}

const gameOver = () => {
  console.log('gameOver')
  clearInterval(snakeMoveInterval)
}

startGame()