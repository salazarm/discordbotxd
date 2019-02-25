import setDashboardPane from './setDashboardPane';
import setJobForm from './setJobForm';

const TYPE = "CREATE_JOB";

const startCreateJob = function(store, job) {
  store.dispatch(setDashboardPane({pane: "CREATE_JOB", id: null}));
  store.dispatch(setJobForm(job));
}

startCreateJob.type = TYPE;
export default startCreateJob;
