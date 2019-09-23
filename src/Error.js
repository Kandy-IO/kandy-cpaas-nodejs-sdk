// TODO: Improve logic and modularize
class RequestError extends Error {
  constructor(exception, ...params) {
    super(...params)
    const { error, name, message } = exception

    const errorObj = find(error, 'messageId')

    this.name = name
    this.exceptionId = 'Unknown'
    this.message = message
    this.stack = null

    if (errorObj) {
      const { messageId, text, variables } = errorObj
      const message = variables.reduce((newText, variable, index) => {
        return newText.replace(`%${index + 1}`, variable)
      }, text)

      this.exceptionId = messageId
      this.message = message
    }
  }
}

// drills down object to find child object with certain key
function find(parentObj, keyToFind) {
  if (!parentObj || typeof(parentObj) !== 'object') {
    return null
  }

  const topLevelKey = Object.keys(parentObj)[0]
  const childObj = parentObj[topLevelKey]

  if (childObj && childObj[keyToFind]) {
    return childObj
  } else {
    return find(childObj, keyToFind)
  }
}

module.exports = RequestError