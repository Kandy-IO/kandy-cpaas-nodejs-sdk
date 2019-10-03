/*
Idea behind the use of composeResponse -
------------------------------------------
The return data from a mocked request always contains the request body. This is
to test the request body structure.
The mocked request return data can also contain a custom object.
As the response from the REST API request is modified and returned in a different structure in the method,
the __FOR_TEST__ data is lost as it doesn't pass through. So for as to preserve this, the actual response from the
mocked request and the modified data from the request is converted into the following object
{
  actualResponse: <The actual response received from the request without any alteration>
  formattedResponse: <The modified response or a pretty format with relevant information only returned by any module method>
}

Note - always to be used if the response from the API is modified and returned a different response object.
*/

function composeResponse (actualResponse, formattedResponse) {
  return {
    actualResponse,
    formattedResponse
  }
}

/*
Use of parseResponse -
------------------------------------------
Scenario 1 (Test case) -
For a test case, the return value is always a test data i.e the request data (body/query/url, check mocker) and
we are only concerned with the test data, not the response that the actual REST API could have returned.
So for this case we would only look into the actualResponse, if present (check composeResponse method for details) because
we are not concerned about the formatted or restructured data. Now to know for sure the actual response container
test data, we look for the key __FOR_TEST__. If it is present we return the actualResponse which in turn has the test data.

Scenario 2 (Actual case) -
Here the actual end user ran the method an there is not test data, only the REST API response. In this case we would
only look into the formattedResponse only if it is present. If the actualResponse is not test i.e __FOR_TEST__ is not
present and formattedResponse is present we assume the request response was formatted in the module method and it needs
to be returned.

Scenario 3 (Actual/Test case 0 composeResponse not used) -
If composeResponse method is not used in the module method then it directly returns whatever is returned from the REST API,
mocked or actual request. If composeResponse is not used, formattedResponse/actualResponse keys are not present and res object
is the object that is to be returned. So the outermost key is removed for formatting purpose and returned
*/

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


function idFrom (url) {
  const chunks = url.split('/')

  return chunks[chunks.length - 1]
}

module.exports = {
  composeResponse,
  parseResponse,
  idFrom
}
