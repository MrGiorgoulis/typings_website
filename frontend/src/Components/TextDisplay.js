import React, { useEffect, useContext } from 'react'
import { RandomWordsContext, SetRandomWordsContext } from './MainContainer';
import { IsWordValidContext, SetIstWordValidContext } from '../App';
import { RedoStateContext } from './CommandCenter'

function TextDisplay({ wc, wordList }) {

  const randomWords = useContext(RandomWordsContext)
  const setRandomWords = useContext(SetRandomWordsContext)
  const isWordValid = useContext(IsWordValidContext)
  const setIsWordValid = useContext(SetIstWordValidContext)

  const shouldReRender = useContext(RedoStateContext)

  useEffect(() => {
    setRandomWords([])
    if (wordList) {
      let wordListLen = wordList.english.length
      for (let i = 0; i < wc; i++) {
        const newWord = wordList.english[parseInt(Math.random() * wordListLen)]
        setRandomWords(prevArray => [...prevArray, newWord])
      }
    }
    setIsWordValid([])
  }, [wc, wordList, shouldReRender, setIsWordValid, setRandomWords]);


  return (
    <div className='text-container'>
      {randomWords.map((word, index) =>
        <span key={index}
          style={{
            color: isWordValid[index] === undefined ? '' : isWordValid[index] ? 'green' : 'red'
          }}
        >{word} </span>
      )}
    </div>
  )
}

export default TextDisplay