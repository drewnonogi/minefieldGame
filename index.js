let currentIndex = 0
let width = 16
let bombArr = []
let route = safeRoute()
let minesAmount = 20

let startButton = document.getElementById("startButton")
startButton.addEventListener("click", ()=>{
  createBoard(width)
} )

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
  let route = [0]
  let routeEnd = 0
  while (routeEnd != 255 || route.length < 150) {
    let direction = Math.floor(Math.random() * 8)
    switch (direction) {
      case 1:
        if (routeEnd % width != 0) {
          routeEnd -= 1
        }
        route.push(routeEnd)
        break;

      case 2:
        if (routeEnd - width >= 0) {
          routeEnd -= width
        }
        route.push(routeEnd)
        break;

      case 3:
      case 4:
      case 5:
        if (routeEnd % width < width - 1) {
          routeEnd += 1
        }
        route.push(routeEnd)
        break;

      case 6:
      case 7:
      case 8:

        if (routeEnd + width < width * width) {
          routeEnd += width
        }
        route.push(routeEnd)
        break;
    }
  }
  return route
}

function setMines(minesAmount) {
  bombArr = []
  let i = 0
  while (i < minesAmount) {
    let bomb = Math.floor(Math.random() * 254)
    if (bombArr.indexOf(bomb) == -1 && !(route.includes(bomb))) {
      bombArr.push(bomb)
      i++
    }
  }
}

function createBoard(boardWidth) {
  let container = document.getElementById("container")
  container.innerHTML = ""
  currentIndex = 0
  document.addEventListener('keyup', movePlayer)
  hideMines()
  setMines(minesAmount)
  let board = document.createElement("div")
  board.setAttribute("id", "board")
  for (let i = 0; i < boardWidth ** 2; i++) {
    let newDiv = document.createElement("div")
    newDiv.setAttribute("id", `c${i}`)
    newDiv.setAttribute("class", "BoardField")
    if (bombArr.includes(i)) {
      newDiv.classList.add("Bomb")
    }
    board.appendChild(newDiv)
  }
  container.appendChild(board)

  let start = document.getElementById("c0")
  start.classList.add("Player")
  start.classList.add("Visited")

  checkMines()
}

function movePlayer(e) {
  document.getElementById(`c${currentIndex}`).classList.remove('Player')
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
  let currentCell = document.getElementById(`c${currentIndex}`)
  currentCell.classList.add('Player')
  currentCell.classList.add('Visited')
  checkGameOver()
  checkMines()

}
function checkGameOver() {
  let field = document.getElementById(`c${currentIndex}`)

  if (field.id == "c255") {
    alert(
      `You Won!
    Try something harder now!`
    )
    revealMines()
    if (minesAmount <= 40) {
      minesAmount += 3
    }
    window.setTimeout(createBoard, 3000, width)

  } else if (field.classList.contains("Bomb")) {
    let destroyed = document.getElementById(`c${currentIndex}`)
    destroyed.classList.add("Destroyed")
    alert("You Lost")
    revealMines()
    window.setTimeout(createBoard, 3000, width)
  }
}
function revealMines() {
  let style = document.createElement("style");
  document.removeEventListener('keyup', movePlayer)
  style.innerHTML = `
  .Bomb {
  background-color: black
  }
  .Destroyed {
    background-color: orange
  }
  `;
  document.head.appendChild(style);
}
function hideMines() {
  let style = document.createElement("style");
  style.innerHTML = `
  .Bomb {
    background-color: green
    }
    .Destroyed {
    background-color: green

    }
  `;
  document.head.appendChild(style);
}




