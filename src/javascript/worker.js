import axios from 'axios'
import hljs from 'highlight.js/lib/highlight'
import json from 'highlight.js/lib/languages/json'
       hljs.registerLanguage('json', json)

onmessage = (e) => {
  axios.get(e.data).then((response) => {
    const text = JSON.stringify(response.data, null, '\t')
    const result = hljs.highlightAuto(text)
    postMessage({ content: result.value })
  })
  .catch((error) => {
    console.log(error)
  })
}
