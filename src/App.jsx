import './App.css';
import { useState } from 'react';
import CalculatorButton from './components/CalculatorButton';
import ButtonTexts from './data/ButtonTexts';

const ADD = "+"
const SUBTRACT = "-"
const MULTIPLY = "x"
const DIVIDE = "\u00f7"
const NEGATOR = "+/-"
const CLEAR_ALL = "AC"
const BACKSPACE = "\u232b"
const EQUAL = "="
const DOT = "."
// const intNumDecimalPoints = 3

function debugPrint(input) {
  console.log(input)
  return
}

function checkIfMathOperator(input) {
  let lstMathOperators = [ADD, SUBTRACT, MULTIPLY, DIVIDE]
  let blnIsMathOperator = false
  lstMathOperators.forEach((mathOperator) => {
    if (input === mathOperator) {
      blnIsMathOperator = true
    }
  })
  return blnIsMathOperator
}

function App() {

  const [arrUserSelection, setArrUserSelection] = useState([])
  const [arrPastCalculations, setArrPastCalculations] = useState([])
  const [fCumulativeResult, setFCumulativeResult] = useState(0)
  const [strUserDisplay, setStrUserDisplay] = useState("")

  const [enableDebug, setEnableDebug] = useState(false)

  function fnHandleNegation(arrExpression) {

    debugPrint("entered fnHandleNegation")

    let lastArrElementIsMathOperator = checkIfMathOperator(arrExpression[arrExpression.length - 1])

    debugPrint(`last element : ${arrExpression[arrExpression.length - 1]}`)

    if (arrExpression.length <= 0) {
      // setArrUserSelection([...arrUserSelection, "-"])
      debugPrint("array is empty")
      // return [...arrExpression, "-"]
      return arrExpression
    }

    if (lastArrElementIsMathOperator) {
      debugPrint("last element is math operator")
      // return [...arrExpression, "-"]
      return arrExpression
    }

    else {

      debugPrint("last element is not math operator")

      let newArray = [...arrUserSelection]
      let strLastElement = newArray.pop()
      let strNewLastElement = strLastElement

      if (strLastElement.includes("-")) {
        strNewLastElement = strLastElement.replace("-", "")
      }
      else {
        strNewLastElement = `-${strLastElement}`
      }
      newArray.push(strNewLastElement)

      return newArray
      // setArrUserSelection(newArray)
    }
  }

  function fnHandleDot(arrExpression) {

    debugPrint("entered fnHandleDot")

    let strLastElementOfArray = arrExpression[arrExpression.length - 1]

    if (arrExpression.length <= 0) {
      // setArrUserSelection([...arrUserSelection, "-"])
      debugPrint("array is empty")
      return [...arrExpression, "."]
    }
    let blnLastElementIsMathOperator = checkIfMathOperator(strLastElementOfArray)

    if (blnLastElementIsMathOperator) {
      debugPrint("last element is math operator")
      return [...arrExpression, "."]
    }

    let blnLastElementAlreadyHasDot = strLastElementOfArray.includes(".")

    if (!blnLastElementIsMathOperator && !blnLastElementAlreadyHasDot) {
      debugPrint("not math operator, dot not present")
      let newArray = [...arrExpression]
      newArray[newArray.length - 1] += "."
      return newArray

    }

    return arrExpression
  }

  function fnCalculateResult(arrExpression) {

    debugPrint(`\n\n----- fnCalculateResult start -----`)
    debugPrint(`arrExpression`)
    debugPrint(arrExpression)

    let currentMathOperation = ""
    let fCumulativeResult = 0

    for (let element of arrExpression) {

      // debugPrint("\n\n------------------")
      // debugPrint(`element : ${element}`)
      // debugPrint(`cumulative result : ${fCumulativeResult}, cumulativeResult type : ${typeof fCumulativeResult}`)
      // debugPrint("currentMathOperation : " + currentMathOperation)

      let blnIsMathOperator = checkIfMathOperator(element)

      if (!element) {
        // console.log("!operand")
        continue
      }

      //* Math operator
      if (blnIsMathOperator) {
        // debugPrint("math operator detected")
        currentMathOperation = element
        continue
      }

      //* non math operators (e.g. a number)
      else if (!blnIsMathOperator) {

        // debugPrint("non math operator detected")

        if (currentMathOperation === "") {
          // debugPrint("currentMathOperation === ''")
          fCumulativeResult = parseFloat(element)
        }

        else if (currentMathOperation === ADD) {
          // debugPrint("currentMathOperation === ADD")
          fCumulativeResult += parseFloat(element)
        }

        else if (currentMathOperation === SUBTRACT) {
          // debugPrint("currentMathOperation === SUBTRACT")
          fCumulativeResult -= parseFloat(element)
        }

        else if (currentMathOperation === MULTIPLY) {
          // debugPrint("currentMathOperation === MULTIPLY")
          fCumulativeResult *= parseFloat(element)
        }

        else if (currentMathOperation === DIVIDE) {
          // debugPrint("currentMathOperation === DIVIDE")
          fCumulativeResult /= parseFloat(element)
        }
      }
    }

    debugPrint(`fCumulativeResult : ${fCumulativeResult}`)
    debugPrint(`\n\n----- fnCalculateResult end -----`)
    return fCumulativeResult
  }

  function fnEvaluateExpression(arrExpression) {

    debugPrint("entered fnEvaluateExpression")

    let intIndexStart = null
    let intIndexEnd = null

    debugPrint("determining indexes to evaluate first")

    let arrValues = [...arrExpression]

    for (let i = 0; i < arrValues.length; i++) {

      debugPrint(`i : ${i}, value : ${arrValues[i]}`)

      if (arrValues.length === 1) { continue }

      //* start of the array
      if (i === 0) {

        if ((arrValues[i + 1] === MULTIPLY || arrValues[i + 1] === DIVIDE) && intIndexStart === null) {
          intIndexStart = i
        }
      }

      // //* end of the array
      else if ((i === arrValues.length - 1)) {

        if ((arrValues[i - 1] === MULTIPLY || arrValues[i - 1] === DIVIDE) && intIndexEnd === null) {
          intIndexEnd = i
        }
      }

      else {

        if ((arrValues[i + 1] === MULTIPLY || arrValues[i + 1] === DIVIDE) && intIndexStart === null) {
          intIndexStart = i
        }

        else if ((arrValues[i + 1] === ADD || arrValues[i + 1] === SUBTRACT) && intIndexEnd === null && intIndexStart !== null) {
          intIndexEnd = i
        }
      }

      debugPrint(`intIndexStart : ${intIndexStart}, intIndexEnd : ${intIndexEnd}`)

      if (intIndexStart !== null && intIndexEnd !== null) {

        let intNumberOfElementsToRemove = intIndexEnd - intIndexStart + 1

        debugPrint(`intNumberOfElementsToRemove : ${intNumberOfElementsToRemove}`)

        // let arrExpressionToEvalFirst = arrExpression.slice(intIndexStart, intIndexEnd + 1)
        let arrExpressionToEvalFirst = arrValues.splice(intIndexStart, intNumberOfElementsToRemove)

        debugPrint(`arrExpressionToEvalFirst`)
        debugPrint(arrExpressionToEvalFirst)

        let strResult = String(fnCalculateResult(arrExpressionToEvalFirst))

        debugPrint(`intNumberOfElementsToRemove : ${intNumberOfElementsToRemove}`)

        arrValues.splice(intIndexStart, 0, strResult)

        i -= intNumberOfElementsToRemove

        intIndexEnd = null
        intIndexStart = null
      }
    }
    return fnCalculateResult(arrValues)
  }

  function fnProcessTextDataInput(textData, arrCurrentUserSelection) {

    //* algorithm to process inputs for eventual evaluation/calculation.........

    let arrayIsEmpty = arrCurrentUserSelection.length === 0 ? true : false
    let inputIsMathOperator = textData.mathOperator ? true : false
    let inputIsNum = !inputIsMathOperator
    // let arrNewUserSelection = []

    //* number
    if (inputIsNum) {

      // debugPrint("not math operator")

      //* array empty
      if (arrayIsEmpty) {
        // console.log("array empty")
        // setArrUserSelection([textData.text])
        return [textData.text]
      }

      //* array not empthy
      let lastArrElementIsMathOperator = checkIfMathOperator(arrCurrentUserSelection[arrCurrentUserSelection.length - 1])

      if (arrCurrentUserSelection.length > 1 && lastArrElementIsMathOperator) {
        // console.log("last element is math operator")
        // setArrUserSelection([...arrCurrentUserSelection, textData.text])
        return [...arrCurrentUserSelection, textData.text]
      }

      //* last element is number
      else {
        // console.log("last element is a number")
        let newArray = [...arrCurrentUserSelection]
        newArray[arrCurrentUserSelection.length - 1] += textData.text
        // setArrUserSelection(newArray)
        return newArray
      }
    }

    //* math operator
    else if (inputIsMathOperator) {

      // debugPrint("math operator")

      if (arrayIsEmpty) {
        // console.log("array empty")
        return []
      }

      // console.log("array not empty")

      let lastArrElementIsMathOperator = checkIfMathOperator(arrCurrentUserSelection[arrCurrentUserSelection.length - 1])

      if (lastArrElementIsMathOperator) {

        //* replace last element math operator with new math operator
        // console.log("last elemetn is math operator")
        let newArray = [...arrCurrentUserSelection]
        newArray[arrCurrentUserSelection.length - 1] = textData.text
        // setArrUserSelection(newArray)
        return newArray
      }

      //* add new math operator
      // console.log("last element is not math operator")
      // setArrUserSelection([...arrCurrentUserSelection, textData.text])
      return [...arrCurrentUserSelection, textData.text]
    }
  }

  function handleButtonClick(textData) {

    // debugPrint(`entered key : ${textData.text}`)

    if (!textData.text) {
      // debugPrint("text is falsy")
      return
    }

    else if (textData.text === CLEAR_ALL) {
      // debugPrint("entered conditional for AC")
      setStrUserDisplay("")
      setArrUserSelection([])
      setFCumulativeResult(0)
      return
    }

    else if (textData.text === BACKSPACE) {
      // debugPrint("entered conditional for X")
      setArrUserSelection(arrUserSelection.slice(0, arrUserSelection.length - 1))
      return
    }

    //* Negator
    else if (textData.text === NEGATOR) {
      debugPrint("entered conditional for negation")

      if (arrUserSelection.length <= 0) {
        return
      }

      let arrNewUserSelection = fnHandleNegation(arrUserSelection)
      setArrUserSelection(arrNewUserSelection)

      let isNumber = !checkIfMathOperator(textData.text)

      if (isNumber) {
        let fCalculatedValue = fnEvaluateExpression(arrNewUserSelection)
        setStrUserDisplay(fCalculatedValue)
      }
      else {
        setStrUserDisplay("")
      }
      return
    }

    //* Dot
    else if (textData.text === DOT) {
      debugPrint("entered conditional for dot")
      setArrUserSelection(fnHandleDot(arrUserSelection))
      return
    }

    else if (textData.text === EQUAL) {

      if (arrUserSelection.length <= 0) {
        return
      }


      // let arrReprioritzedExpressions = fnRepriotizeExpressions(arrUserSelection)
      // let fCalculatedValue = fnCalculateResult(arrReprioritzedExpressions)
      // let arrReprioritzedExpressions = fnRepriotizeExpressions(arrUserSelection)
      let fCalculatedValue = fnEvaluateExpression(arrUserSelection)
      let strCalculatedValue = String(fCalculatedValue)

      debugPrint("fCalculatedValue : " + fCalculatedValue)
      debugPrint("type of fCalculatedValue : " + typeof fCalculatedValue)

      //* setting state and stuff
      setFCumulativeResult(fCalculatedValue)
      setArrUserSelection([strCalculatedValue])

      setArrPastCalculations([...arrPastCalculations, {
        arrUserSelection: arrUserSelection,
        result: strCalculatedValue
      }])
      // let strCalculatedValue = String(fCalculatedValue)
      // let indexOfDecimalPoint = strCalculatedValue.indexOf(".", 0)
      // let blnValueIsInteger = indexOfDecimalPoint === -1 ? true : false

      // if (!blnValueIsInteger) {
      //   strCalculatedValue = strCalculatedValue.slice(0, strCalculatedValue.indexOf(".", 0) + intNumDecimalPoints + 1)
      // }
      return
    }

    // //* just to help in readability
    let arrCurrentUserSelection = arrUserSelection

    let arrNewUserSelection = fnProcessTextDataInput(textData, arrCurrentUserSelection)
    setArrUserSelection(arrNewUserSelection)

    let isNumber = !checkIfMathOperator(textData.text)

    if (isNumber) {
      let fCalculatedValue = fnEvaluateExpression(arrNewUserSelection)
      setStrUserDisplay(fCalculatedValue)
    }
    else {
      setStrUserDisplay("")
    }
  }

  function handleRecalculate(arrExpression) {

    let fCalculatedValue = fnEvaluateExpression(arrExpression)
    let strCalculatedValue = String(fCalculatedValue)

    //* setting state and stuff
    setFCumulativeResult(fCalculatedValue)
    setArrUserSelection([strCalculatedValue])
    setStrUserDisplay(fCalculatedValue)
    return
  }

  function handleCopyExpression(arrExpression) {

    let fCalculatedValue = fnEvaluateExpression(arrExpression)
    let strCalculatedValue = String(fCalculatedValue)

    //* setting state and stuff
    setFCumulativeResult(strCalculatedValue)
    setArrUserSelection(arrExpression)
    setStrUserDisplay(strCalculatedValue)
    return
  }

  function handleClearPastCalculation() {
    setArrPastCalculations([])
    return
  }

  return (
    <div className="app">

      <h1>Scrappy Calculator</h1>

      <div className='display'>
        <span className='main-display'>{`${arrUserSelection.map((textData) => textData).join('')}`}</span>
        <span className='sub-display'>{`${strUserDisplay}`}</span>
        {/* <li>arrUserSelection.join : {`${arrUserSelection.map((textData) => textData).join('')}`}</li>
        <li>strUserDisplay : {`${strUserDisplay}`}</li> */}
      </div>

      <header className="app-header">

        <div className="calculator-container">

          {ButtonTexts.map((textData) => {
            return <CalculatorButton
              textData={textData}
              buttonClickHandler={handleButtonClick}
            />
          })}

        </div>

        <button onClick={() => {
          setEnableDebug(!enableDebug)
        }}
        >
          {enableDebug ? "disable" : "enable"} debug
        </button>

        {enableDebug &&
          <div>
            <h3>Debug</h3>
            <span>arrUserSelection : {`${arrUserSelection.map((textData) => textData)}`}</span><br />
            <span>cumulative result : {`${fCumulativeResult}`}</span>
          </div>
        }

      </header>
      <h3>Past Calculations</h3>
      <table>
        <tr>
          <th>Expression</th>
          <th>Result</th>
          <th>Action</th>
        </tr>
        {arrPastCalculations.map((objPastCalculation) => {
          return (
            <tr>
              <td>
                {`${objPastCalculation.arrUserSelection.join('')}`}
              </td>
              <td>
                {`${objPastCalculation.result}`}
              </td>
              <td>
                <button
                  className='past-calculation-button'
                  onClick={() => {
                    handleRecalculate(objPastCalculation.arrUserSelection)
                  }}
                >Recalculate</button>

                <button
                  className='past-calculation-button'
                  onClick={() => {
                    handleCopyExpression(objPastCalculation.arrUserSelection)
                  }}
                >Copy Expression</button>
              </td>
            </tr>
          )
        })}
      </table>
      {arrPastCalculations.length > 0 &&
        <button
          className='clear-past-calculations-button'
          onClick={handleClearPastCalculation}
        >Clear Past Calculations</button>
      }

      <footer className='footer'>
        <p>Made by SkipperShark</p>
      </footer>
      {/* {arrPastCalculations.map((objPastCalculation) => {
          return (
            <li><span>{`${objPastCalculation.arrUserSelection}`}</span> | <span>{`${objPastCalculation.result}`}</span> | <button>Recalculate</button></li>
          )
        })} */}
      {/* <button onClick={() => {
        let myArray = [1, 2, 3, 4, 5];
        for (let i = 0; i < myArray.length; i++) {
          console.log(`i : {i}, myArray[i] : ${myArray[i]}`)
          // console.log(myArray[i])
          if (myArray[i] === 3) {
            myArray.splice(0, 2)
            i -= 2
          }
        }
        console.log(myArray)
      }}>splicing test</button> */}
    </div >
  )
}
export default App;

