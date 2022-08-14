import * as api from "../api";
import * as issue from "../constants/issueConstants"
import * as label from "../constants/labelConstants"
import * as repo from "../constants/reposConstants"
import {ADD_TO_SELECT_ISSUES, REMOVE_FROM_SELECT_ISSUES} from '../constants/selectIssuesConstants'

export const getIssues = (org, repo, label) => async (dispatch) => {
  dispatch({
    type: issue.GET_ISSUES_REQUEST
  });
  try {
    const { data } = await api.fetchIssues(org, repo, label);
    console.log(data);
    dispatch({
      type: issue.GET_ISSUES_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: issue.GET_ISSUES_FAIL,
      error: e.message,
    });
  }
};

export const getLabels = (repos) => async (dispatch, getState) => {
  if(repos === undefined) return;
  console.log("Hello world");
  console.log(`inside getLabels ${JSON.stringify(repos)}`);
  dispatch({
    type: label.GET_LABELS_REQUEST,
  });
  try {

    // get list of labels, saved in browser's local strorage
    const localDataDate = localStorage.getItem('date');
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    today = (mm+dd+yyyy).toString();
    // if date when data was saved is more than a day, clear it.
    if(localDataDate !== today){
      localStorage.removeItem('labelslist');
      localStorage.removeItem('date');
    }

    // get label list from local storage
    const localData = localStorage.getItem('labelslist');
    let data = '';
    if(localData) data = JSON.parse(localData);
    else data = await api.rawLabels(repos); // if label list is not present in local stprage than get fresh lists of labels.
    console.log(`inside getLabels 2 ${data}`);
    dispatch({
      type: label.GET_LABELS_SUCCESS,
      payload: data,
    });
    localStorage.setItem('labelslist', JSON.stringify(getState().labelsStore.labelslist))
    localStorage.setItem('date',today)
  } catch (e) {
    console.log(`getlabels error ${e.message}`);
    dispatch({
      type: label.GET_LABELS_FAIL,
      error: e.message,
    });
  }
};

export const getRepos = () => async (dispatch) => {
  dispatch({
    type: repo.GET_REPOS_REQUEST
  });
  try {
    const { data } = await api.fetchRepos();
    dispatch({
      type: repo.GET_REPOS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: repo.GET_REPOS_FAIL,
      error: e.message,
    });
  }
};

export const addToSelectIssues = (labels) => (dispatch) => {
  dispatch({
    type: ADD_TO_SELECT_ISSUES,
    payload:labels
  })
}

export const removeFromSelectIssues = (labels) => (dispatch) => {
  dispatch({
    type: REMOVE_FROM_SELECT_ISSUES,
    payload:labels
  })
}
