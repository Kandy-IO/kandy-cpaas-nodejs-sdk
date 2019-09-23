function parseResponse (res) {
  if (res && res.actualResponse && res.actualResponse.response && res.actualResponse.response.__FOR_TEST__) {
    return { ...res.actualResponse.response }
  }

  if (res && (res.formattedResponse !== undefined || res.formattedResponse != null)) {
    return { ...res.formattedResponse }
  }

  const topLevelKey = Object.keys(res)[0]

  return {
    ...res[topLevelKey]
  }
}

function composeResponse (actualResponse, formattedResponse) {
  return {
    actualResponse,
    formattedResponse
  }
}

function idFrom (url) {
  const chunks = url.split('/')

  return chunks[chunks.length - 1]
}

module.exports = {
  composeResponse,
  parseResponse,
  idFrom
}
