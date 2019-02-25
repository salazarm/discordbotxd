import startCreateJob from './startCreateJob';

const TYPE = "SUBMIT_JOB";
const RESPONSE_TYPE = "JOB_CREATION_RESPONSE";

const submitJob = function(jobForm, store) {
  const data = jobForm;
  store.dispatch({type: TYPE});
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
  }).then(res => res.json())
  .then((responseData) => {
    store.dispatch({
      type: RESPONSE_TYPE,
      payload: responseData,
    });
  });
}

submitJob.type = TYPE;
submitJob.responseType = RESPONSE_TYPE;
export default submitJob;
