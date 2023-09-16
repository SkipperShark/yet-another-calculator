
function fnCalculateResult(arrExpression) {

    debugPrint(`\n\n----- fnCalculateResult start -----`)
    debugPrint(`arrExpression`)
    debugPrint(arrExpression)

    let currentMathOperation = ""
    let fCumulativeResult = 0

    for (let element of arrExpression) {

        debugPrint("\n\n------------------")
        debugPrint(`element value : ${element.value}, expression : ${element.expression}`)
        debugPrint(`cumulative result : ${fCumulativeResult}, cumulativeResult type : ${typeof fCumulativeResult}`)
        debugPrint("currentMathOperation : " + currentMathOperation)

        let blnElementIsExpression = element.expression ? true : false

        element = blnElementIsExpression ? fnConvertExpressionStringToArray(element.value) : element.value

        let blnIsMathOperator = checkIfMathOperator(element)

        debugPrint("element after prioritization")
        debugPrint(element)
        debugPrint(`blnElementIsExpression : ${blnElementIsExpression}`)

        //* check for multiplication and division, which must be evaluated first

        if (!element) {
            console.log("!operand")
            continue
        }

        //* Math operator
        if (blnIsMathOperator) {
            debugPrint("math operator detected")
            currentMathOperation = element
            continue
        }

        //* non math operators (e.g. a number)
        else if (!blnIsMathOperator) {

            debugPrint("non math operator detected")

            if (currentMathOperation === "") {
                debugPrint("currentMathOperation === ''")
                fCumulativeResult = blnElementIsExpression ? fnCalculateResult(element) : parseFloat(element)
            }

            else if (currentMathOperation === ADD) {
                debugPrint("currentMathOperation === ADD")
                fCumulativeResult += blnElementIsExpression ? fnCalculateResult(element) : parseFloat(element)
            }

            else if (currentMathOperation === SUBTRACT) {
                debugPrint("currentMathOperation === SUBTRACT")
                fCumulativeResult -= blnElementIsExpression ? fnCalculateResult(element) : parseFloat(element)
            }

            else if (currentMathOperation === MULTIPLY) {
                debugPrint("currentMathOperation === MULTIPLY")
                fCumulativeResult *= blnElementIsExpression ? fnCalculateResult(element) : parseFloat(element)
            }

            else if (currentMathOperation === DIVIDE) {
                debugPrint("currentMathOperation === DIVIDE")
                fCumulativeResult /= blnElementIsExpression ? fnCalculateResult(element) : parseFloat(element)
            }
        }
    }

    debugPrint(`fCumulativeResult : ${fCumulativeResult}`)
    return fCumulativeResult
}


function fnRepriotizeExpressions(arrUserSelection) {

    // debugPrint("-----fnRepriotizeExpressions start -----")

    let arrValues = [...arrUserSelection]
    let arrReorderedValues = []

    //* algorithm to make sure multiplications and divisions have priority in the calculation

    for (let i = 0; i < arrValues.length; i++) {

        let element = arrValues[i]
        let blnIsMathOperator = checkIfMathOperator(element)

        // debugPrint(`start arrReorderedValues`)
        // debugPrint(arrReorderedValues)
        // debugPrint(`i : ${i}`)
        // debugPrint(`element : ${element}`)

        //* first element of array
        if (i === 0) {
            arrReorderedValues.push({ value: element, expression: false })
            continue
        }

        //* last element of array
        if (i === arrValues.length - 1) {

            if (blnIsMathOperator) {
                continue
            }
            if ((arrValues[i - 1] === MULTIPLY || arrValues[i - 1] === DIVIDE)) {
                arrReorderedValues[arrReorderedValues.length - 1].value += element
                arrReorderedValues[arrReorderedValues.length - 1].expression = true
                continue
            }

            else {
                arrReorderedValues.push({ value: element, expression: false })
            }
        }

        //* if forward is multiple/divide and before is add/subtract
        else if ((arrValues[i + 1] === MULTIPLY || arrValues[i + 1] === DIVIDE) && (arrValues[i - 1] === ADD || arrValues[i - 1] === SUBTRACT)) {
            arrReorderedValues.push({ value: element, expression: true })
            continue
        }

        //* multiply or divide
        else if (element === MULTIPLY || element === DIVIDE) {
            arrReorderedValues[arrReorderedValues.length - 1].value += element
            arrReorderedValues[arrReorderedValues.length - 1].expression = true
            continue
        }

        else if ((arrValues[i - 1] === MULTIPLY || arrValues[i - 1] === DIVIDE) && (arrValues[i + 1] === MULTIPLY || arrValues[i + 1] === DIVIDE)) {
            arrReorderedValues[arrReorderedValues.length - 1].value += element
            arrReorderedValues[arrReorderedValues.length - 1].expression = true
            continue
        }

        else if ((arrValues[i - 1] === MULTIPLY || arrValues[i - 1] === DIVIDE) && (arrValues[i + 1] === ADD || arrValues[i + 1] === SUBTRACT)) {
            arrReorderedValues[arrReorderedValues.length - 1].value += element
            arrReorderedValues[arrReorderedValues.length - 1].expression = true
        }

        else {
            arrReorderedValues.push({ value: element, expression: false })
        }
    }

    // debugPrint("arrReorderedValues")
    debugPrint(arrReorderedValues)
    // debugPrint("-----fnRepriotizeExpressions end -----\n")
    return arrReorderedValues

}

function fnConvertExpressionStringToArray(strExpression) {


    // debugPrint(`----- fnConvertExpressionStringToArray start -----`)
    // debugPrint(`strExpression : ${strExpression}`)
    //* algorithm to process inputs for eventual evaluation/calculation.........

    let arrExpression = []

    for (const strElement of strExpression) {

        // debugPrint("-----")
        // debugPrint("arrExpression")
        // debugPrint(arrExpression)
        // debugPrint("strElement")
        // debugPrint(strElement)

        let blnArrayIsEmpty = arrExpression.length === 0 ? true : false
        let blnInputIsMathOperator = checkIfMathOperator(strElement)
        let blnInputIsNum = !blnInputIsMathOperator

        if (blnArrayIsEmpty && blnInputIsNum) {
            arrExpression = [{ value: strElement, expression: false }]
            continue
        }

        else if (!blnArrayIsEmpty) {

            let lastArrElementIsMathOperator = checkIfMathOperator(arrExpression[arrExpression.length - 1].value)
            let lastArrElementIsNum = !lastArrElementIsMathOperator

            if (lastArrElementIsMathOperator) {

                //* replace last math operator with new math operator
                if (blnInputIsMathOperator) {
                    // debugPrint("arr not empty, mathoperator, replacing last element")
                    arrExpression[arrExpression.length - 1].value = strElement
                    continue
                }

                //* adding new numbe relement
                else if (blnInputIsNum) {
                    // debugPrint("arr not empty, number, adding element")
                    arrExpression = [...arrExpression, { value: strElement, expression: false }]
                    continue
                }
            }

            else if (lastArrElementIsNum) {

                //* adding new math operator element
                if (blnInputIsMathOperator) {
                    // debugPrint("arr not empty, mathoperator, replacing last element")
                    arrExpression = [...arrExpression, { value: strElement, expression: false }]
                    continue
                }

                //* appending new number element
                else if (blnInputIsNum) {
                    // debugPrint("arr not empty, number, adding element")
                    arrExpression[arrExpression.length - 1].value += strElement
                    continue
                }
            }
        }

    }
    // debugPrint(`arrExpression : ${arrExpression}`)
    // debugPrint(`----- fnConvertExpressionStringToArray end -----`)
    return arrExpression

}