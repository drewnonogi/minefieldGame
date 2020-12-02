let currentIndex = 0
let width = 16
let minesAmount = 20
let safeRoad = safeRoute()
let bombArr = []
let board = []
let visited = []
let lost = false
let invincible = false

let startButton = document.getElementById("startButton")
startButton.addEventListener("click", () => {
  createBoard()
})

function playSound(element) {
  const audio = document.getElementById(`${element}`);
  audio.currentTime = 0;
  audio.play();
}

function checkMines() {
  let detectedCounter = 0
  let searchArr = []

  if (currentIndex % width != 0) {
    searchArr.push(currentIndex - width - 1)
    searchArr.push(currentIndex - 1)
    searchArr.push(currentIndex + width - 1)
  }
  if (currentIndex % width < width - 1) {
    searchArr.push(currentIndex - width + 1)
    searchArr.push(currentIndex + 1)
    searchArr.push(currentIndex + width + 1)
  }
  searchArr.push(currentIndex - width)
  searchArr.push(currentIndex + width)

  for (let i = 0; i < searchArr.length; i++) {
    if (bombArr.includes(searchArr[i])) {
      detectedCounter++
    }
  }
  document.getElementById(`c${currentIndex}`).innerText = detectedCounter
}

function safeRoute() {
  let safeRoad = [0]
  let routeEnd = 0
  while (routeEnd != 255 || safeRoad.length < 150) {
    let direction = Math.floor(Math.random() * 8)
    switch (direction) {
      case 1:
        if (routeEnd % width != 0) {
          routeEnd -= 1
        }
        safeRoad.push(routeEnd)
        break;

      case 2:
        if (routeEnd - width >= 0) {
          routeEnd -= width
        }
        safeRoad.push(routeEnd)
        break;

      case 3:
      case 4:
      case 5:
        if (routeEnd % width < width - 1) {
          routeEnd += 1
        }
        safeRoad.push(routeEnd)
        break;

      case 6:
      case 7:
      case 8:

        if (routeEnd + width < width * width) {
          routeEnd += width
        }
        safeRoad.push(routeEnd)
        break;
    }
  }
  return safeRoad
}

function setMines(minesAmount) {
  let bombArr = []
  let i = 0
  while (i < minesAmount) {
    let bomb = Math.floor(Math.random() * 254)
    if (bombArr.indexOf(bomb) == -1 && !(safeRoad.includes(bomb))) {
      bombArr.push(bomb)
      i++
    }
  }
  return bombArr
}

function movePlayer(e) {
  let lastIndex = currentIndex
  if ([37, 38, 39, 40, 65, 68, 83, 87].includes(e.keyCode)) {
    playSound("steps")
  }
  switch (e.keyCode) {
    case (37):
    case (65):
      if (currentIndex % width !== 0) currentIndex -= 1
      break
    case (38):
    case (87):
      if (currentIndex - width >= 0) currentIndex -= width
      break
    case (39):
    case (68):
      if (currentIndex % width < width - 1) currentIndex += 1
      break
    case (40):
    case (83):
      if (currentIndex + width < width * width) currentIndex += width
      break
  }
  if (!visited.includes(currentIndex)) {
    visited.push(currentIndex)
  }
  let nextIndex = currentIndex
  checkGameOver()
  checkMines()
  displayVisited()
  displayPlayer(lastIndex, nextIndex)
}

function checkGameOver() {
  if (currentIndex == 255) {
    alert(
      `You Won!
    Try something harder now!`
    )
    revealMines()
    if (minesAmount <= 40) {
      minesAmount += 3
    }
    window.setTimeout(createBoard, 3000)

  } else if (bombArr.includes(currentIndex) && !invincible) {
    playSound("boom")

    alert(`You Lost
    Try again`)
    revealMines()
    window.setTimeout(createBoard, 3000)
  }
}

function displayVisited() {
  let field = document.getElementById(`c${currentIndex}`)
  field.classList.add("Visited")
}

function displayPlayer(lastIndex, nextIndex) {
  let last = document.getElementById(`c${lastIndex}`)
  let next = document.getElementById(`c${nextIndex}`)
  last.classList.remove("Player")
  next.classList.add("Player")
}

function createBoard() {
  currentIndex = 0
  bombArr = setMines(minesAmount)
  document.addEventListener('keyup', movePlayer)
  board = new Array(width ** 2).fill("E")
  lost = false
  for (let i = 0; i < board.length; i++) {
    if (bombArr.includes(board[i])) {
      board[i] = "B"
    }
  }
  renderBoard(board)
};

function renderBoard(boardPlan) {
  let container = document.getElementById("container")
  container.innerHTML = ""
  let board = document.createElement("div")
  board.id = "board"

  for (let i = 0; i < boardPlan.length; i++) {
    let field = document.createElement("div")
    field.classList.add("BoardField")
    field.id = `c${i}`
    board.appendChild(field)
  }
  container.appendChild(board)
  let start = document.getElementById(`c${0}`)
  start.classList.add("Player", "Visited")
  checkMines()
}

function revealMines() {
  document.removeEventListener('keyup', movePlayer)
  bombArr.forEach(bomb => {
    let field = document.getElementById(`c${bomb}`)
    field.classList.add("Bomb")
  });
}
const pressed = [];
const secretCode = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';

// konami code
window.addEventListener('keyup', (e) => {
  pressed.push(e.key);
  pressed.splice(-10, pressed.length - 10);
  if (pressed.join('').includes(secretCode)) {
    console.log('DING!');
    alert("You're invincible")
    invincible = true
  }
});