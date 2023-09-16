import { useState } from 'react'

function CalculatorButton({ textData, buttonClickHandler }) {

    let buttonText = textData.text
    let strClass = "calculator-button"

    if (textData.text === '0') {
        strClass += " calculator-button-enlarged"
    }

    if (textData.highlighted === true) {
        strClass += " calculator-button-highlighted"
    }

    return <>
        <div
            className={strClass}
            onClick={() => {
                buttonClickHandler(textData)
            }}
        >
            {buttonText}
        </div>
    </>
}


export default CalculatorButton