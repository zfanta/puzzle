if (window.location.hostname === 'logichome.org') {
  function getAnswer () {
    const script = document.querySelector('#thema_wrapper > div.at-body > div > div > div.col-md-9.at-col.at-main > div.view-wrap > section > article > div:nth-child(3) > script:nth-child(4)')
    if (script === null) {
      throw new Error('script is null')
    }
    const { textContent } = script
    if (textContent === null) {
      throw new Error('textContent is null')
    }

    const l = textContent.indexOf(`'`)
    const r = textContent.indexOf(`'`, l + 1)

    const base64 = textContent.slice(l + 1, r)

    const urlEncoded = atob(base64)

    const answer = JSON.parse(decodeURIComponent(urlEncoded))

    let answerArray: number[][] = []
    for (let i = 0; true; i++) {
      if (answer[i] === undefined) break
      if (answerArray[i] === undefined) answerArray[i] = []
      for (let j = 0; true; j++) {
        if (answer[i][j] === undefined) {
          break
        }

        answerArray[i].push(answer[i][j] as number)
      }
    }
    return answerArray
  }

  function fillAnswer (answer: number[][]) {
    const table = document.querySelector('#nonogram > tbody')
    if (table === null) {
      throw new Error('table is null')
    }
    const [_, ...trs] = [...table.querySelectorAll('tr')]

    for (let i = 0; i < answer.length; i++) {
      const [_, ...tds] = [...trs[i].querySelectorAll('td')]
      for (let j = 0; j < answer[i].length; j++) {
        const td = tds[j]
        if (td === undefined) {
          throw new Error('td is undefined')
        }

        if (answer[i][j] === 0) {
          continue
        }
        td.classList.add('checked')
      }
    }
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'solve') {
      const answer = getAnswer()
      console.log(answer.map(line => line.map(cell => cell === 0 ? '□' : '■').join('')).join('\n'))
      fillAnswer(answer)
    }
  })
}
