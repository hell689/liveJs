let pxSize = 320

let cellPxSize = 1
let cellCount = pxSize / cellPxSize
const cellColor = '#000'
const clearColor = '#fff'
let emptyBorder = 0

let birthArr = []
let survArr = []

let intervalId = null

const nextStepBtn = document.querySelector('#nextStepBtn')
const startStopBtn = document.querySelector('#startStopBtn')
const clearFieldBtn = document.querySelector('#clearFieldBtn')
const randBtn = document.querySelector('#randBtn')
const randInput = document.querySelector('#randInput')
const canv = document.querySelector('.canv')
const birthInput = document.querySelector('#birthInp')
const survInput = document.querySelector('#survInp')
const rulesBtn = document.querySelector('#setRulesBtn')
const intervalInput = document.querySelector('#intInp')
const winSizeInput = document.querySelector('#winSizeInp')
const cellSizeInput = document.querySelector('#cellSizeInp')
const emptyBorderInput = document.querySelector('#emptyBorderInp')
const sizeBtn = document.querySelector('#setSizesBtn')

sizeBtnClick()

const ctx = canv.getContext('2d')

let cellsArr = []

clearFieldArr()
rulesBtnClick()

//console.log(cellsArr);

//===================================

//ctx.fillStyle = '#000'
//ctx.fillRect(0, 0, pxSize, pxSize)

//cellsArr[2][5] = 1
renderField(cellsArr)

//=================================

nextStepBtn.addEventListener('click', nextBtnClick)
startStopBtn.addEventListener('click', startStopClick)
clearFieldBtn.addEventListener('click', clearFieldBtnClick)
randBtn.addEventListener('click', randBtnClick)
rulesBtn.addEventListener('click', rulesBtnClick)
sizeBtn.addEventListener('click', sizeBtnClick)

canv.addEventListener('click', canvClick)

//==================================

function nextBtnClick(e) {
  calcNextStep()
  renderField(cellsArr)
}

function startStopClick(e) {
  if (!intervalId) {
    startStopBtn.textContent = 'Stop'
    const intVal = Number(intervalInput.value)
    intervalId = setInterval(nextBtnClick, intVal)
  } else {
    startStopBtn.textContent = 'Start'
    clearInterval(intervalId)
    intervalId = null
  }
}

function randBtnClick() {
  clearFieldArr()
  const percent = Number(randInput.value)
  fillRndFieldArr(percent)
  renderField()
}

function clearFieldBtnClick() {
  clearFieldArr()
  renderField(cellsArr)
}

function rulesBtnClick() {
  birthArr = birthInput.value.split(',').map(v => Number(v))
  survArr = survInput.value.split(',').map(v => Number(v))
}

function sizeBtnClick() {
  pxSize = Number(winSizeInput.value)
  cellPxSize = Number(cellSizeInput.value)
  emptyBorder = Number(emptyBorderInput.value)
  canv.width = pxSize
  canv.height = pxSize
  cellCount = pxSize / cellPxSize
}

function canvClick(e) {
  const ox = e.offsetX
  const oy = e.offsetY
  const x = Math.floor(ox / cellPxSize)
  const y = Math.floor(oy / cellPxSize)
  //console.log(x, y);
  const cellZnach = cellsArr[x][y] ? 0 : 1
  cellsArr[x][y] = cellZnach
  const color = cellZnach ? cellColor : clearColor
  fillCell(x, y, color)

}

//==================================

function clearFieldArr() {
  for(let i = 0; i < cellCount; i++) {
    cellsArr[i] = []
    for(let j = 0; j < cellCount; j++) {
      cellsArr[i][j] = 0
    }
  }
}

function fillRndFieldArr(prc) {
  for(let i = 0; i < cellCount; i++) {
    cellsArr[i] = []
    for(let j = 0; j < cellCount; j++) {
      const val = Math.random() <= prc / 100 ? 1 : 0
      cellsArr[i][j] = val
    }
  }
}

function fillCell(cx, cy, color = cellColor) {
  const x = cx * cellPxSize + emptyBorder
  const y = cy * cellPxSize + emptyBorder
  const size = cellPxSize - emptyBorder
  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)
}

function renderField(fieldArr = cellsArr) {
  clearField()
  for(let i = 0; i < cellCount; i++) {
    for(let j = 0; j < cellCount; j++) {
      if (fieldArr[i][j] == 1) {
        fillCell(i, j)
      }
    }
  }
}

function clearField() {
  ctx.fillStyle = clearColor
  ctx.fillRect(0, 0, pxSize, pxSize)
}

function calcNextStep() {
  const newGenArr = []
  for(let x = 0; x < cellCount; x++) {
    newGenArr[x] = []
    for(let y = 0; y < cellCount; y++) {
      const oldState = cellsArr[x][y]
      const nbCount = calcNbCount(x, y)
      const nextState = calcNextState(nbCount, oldState)
      newGenArr[x][y] = nextState
    }
  }
  cellsArr = newGenArr

}

function calcNbCount(x, y) {
  const ca = cellsArr
  const nbCount = cz(x-1,y) + cz(x-1,y-1) + cz(x,y-1) + cz(x+1,y-1) + cz(x+1,y) + cz(x+1,y+1) + cz(x,y+1) + cz(x-1,y+1)
  return nbCount
}

function cz(x, y) {
  if(!!cellsArr[x]) {
    return !!cellsArr[x][y]
  }
  return 0
}

function calcNextState(nbCount, oldState) {
  let nextState
  if(oldState === 1) {
    const isAlive = survArr.indexOf(nbCount) != -1
    nextState = isAlive ? 1 : 0
  } else {
    const isBirth = birthArr.indexOf(nbCount) != -1
    nextState = isBirth ? 1 : 0
  }
  return nextState
}