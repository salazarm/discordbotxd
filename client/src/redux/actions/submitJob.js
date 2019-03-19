import startCreateJob from './startCreateJob';

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
        excludedGroups: jobForm.excludeGroups ? jobForm.excludedGroups : [],
        message: jobForm.message,
        messageDelay: jobForm.messageDelay,
        pathname: jobForm.pathname,
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
