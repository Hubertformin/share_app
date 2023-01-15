function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child)
    }
  },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
@keyframes pulse {
   0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(77, 786, 220, 0.7);
   }

   70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(77, 786, 220, 0);
   }

   100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(77, 786, 220, 0);
   }
}
.${className} > div {
  animation-fill-mode: both;
  width: 200px;
  height: 200px;
  border-radius: 100%;
  background: #fff;
  box-shadow: 0 0 0 0 rgba(77, 786, 220, 1);
   transform: scale(1);
   animation: pulse 2s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.${className} > div img {
  width: 100%;
  height: 100%;
  border-radius: 100%;
}
.${className} > h2 {
  color: white;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin: 44px 0;
  font-size: 24px;
  font-weight: 600;
}
.app-loading-wrap {
  background: linear-gradient(to bottom, #002e31, #001b2c);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9;
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div><img src="/icon.png" /></div><h2>ShareRoom</h2></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)
