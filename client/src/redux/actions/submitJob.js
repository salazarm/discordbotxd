const TYPE = "SUBMIT_JOB";
const RESPONSE_TYPE = "JOB_CREATION_RESPONSE";

const submitJob = function(jobForm, store) {
  const data = jobForm;
  store.dispatch({type: TYPE});
  let error;
  try {
    fetch('/job', {
      method: 'POST',
      body: JSON.stringify({
        includedGroups: data.includedGroups,
        message: data.message,
        messageDelay: data.messageDelay,
        pathname: data.pathname,
      }),
      headers:{
        'Content-Type': 'application/json'
      },
    }).then(res => {
      try {
        return res.json()
      } catch (e) {
        error = e;
      }
    })
    .then((responseData) => {
      if (!error) {
        store.dispatch({
          type: RESPONSE_TYPE,
          payload: responseData,
        });
      }
    });
  } catch (e) {

  }
}

submitJob.type = TYPE;
submitJob.responseType = RESPONSE_TYPE;
export default submitJob;
