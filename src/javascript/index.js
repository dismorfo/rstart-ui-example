import _ from 'lodash'
import json from 'highlight.js/lib/languages/json'
import Worker from 'worker-loader!./Worker.js'
import hljs from 'highlight.js/lib/highlight'
       hljs.registerLanguage('json', json)

addEventListener('load', () => {
  const tab = document.querySelector('#partner-array')
        tab.parentNode.classList.add('is-active')
  const request = tab.getAttribute('data-request')
  const code = document.querySelector('#code')        
  const worker = new Worker('worker.js')

  worker.onmessage = (event) => {    
    const elem = document.querySelector('.is-active a')    
    const contentUrl = document.querySelector('.content-url')
    code.innerHTML = event.data.content
    contentUrl.innerHTML = elem.getAttribute('data-api')
  }

  document.addEventListener('click', (e) => {
    if (e.target.tagName == 'A') {
      e.preventDefault()
      if (e.target.parentNode.classList.contains('is-active')) return
      else {
        const isActive = document.querySelector('.is-active')
        if (isActive) {
          isActive.classList.remove('is-active')
        }
        e.target.parentNode.classList.add('is-active')
      }
      worker.postMessage(e.target.getAttribute('data-request'))
    }
  }, false)

  worker.postMessage(request)

})
