import React, { useState, useEffect, useContext } from 'react'
import TextDisplay from './TextDisplay'
import { RedoStateContext } from './CommandCenter'
import { WordCountContext } from './CommandCenter'

function FetchData() {

    const wordCount = useContext(WordCountContext)
    const [data, setData] = useState(null)

    const shouldReRender = useContext(RedoStateContext)

    useEffect(() => {
        if (shouldReRender) {
            const sample = require('../jsons/random.json')
            setData(sample)
        }
    }, [shouldReRender])

    return (
        <div>
            <TextDisplay wc={wordCount} wordList={data} />
        </div>
    )
}

export default FetchData