const socket = io()
const messages = document.querySelector('.messages');
const form = document.querySelector('.form')
const input = document.querySelector('.input')
const nameBlock = document.querySelector('.name')

// const userName = prompt('Ваше имя:')
// nameBlock.innerHTML = userName

// form.addEventListener('submit', e => {
//     e.preventDefault()
//     if (!input.value) return

//     socket.emit('chatMessage', {
//         message: input.value, 
//         name: userName
//     })

    
// })

socket.on('newMessage', newMessage => {
    const item = document.createElement('li')
    item.innerHTML = `<span>${newMessage.name}</span>: ${newMessage.message}`
    messages.appendChild(item)
})


const myFunction = () => {
    const input =   document.getElementById('myInput')
    const filter =  input.value.toUpperCase()  
    const divs =    document.getElementsByName('left-msg')

    for (let i = 0; i < divs.length; i++) {
      const a = divs[i].getElementsByTagName('a')[0];
      (a.textContent || a.innerText).toUpperCase().indexOf(filter) > -1 ? divs[i].style.display = "" :  divs[i].style.display = "none"
    }
  }

// socket.on('newMessage', tokenHandler) 


function dragElement(element, direction, first, second) {
  var md

  element.onmousedown = e => {
    md = {
      e,
      offsetLeft:   element.offsetLeft,
      offsetTop:    element.offsetTop,
      firstWidth:   first.offsetWidth,
      secondWidth:  second.offsetWidth
    }

    document.onmousemove =  e => {
      var delta = {
        x: e.clientX - md.e.clientX,
        y: e.clientY - md.e.clientY
      }
  
      if (direction === "H") {
        delta.x = Math.min(Math.max(delta.x, -md.firstWidth), md.secondWidth)
        element.style.left  =  md.offsetLeft + delta.x + "px"
        first.style.width   = (md.firstWidth + delta.x) + "px"
        second.style.width  = (md.secondWidth - delta.x) + "px"
      }
    }

    document.onmouseup = () => {
      document.onmousemove  = null
      document.onmouseup    = null
    }
  }
  

  
}
dragElement(
    document.getElementById("separator"), 
    "H",
    document.getElementById("leftBox"),
    document.getElementById("rightBox")
)