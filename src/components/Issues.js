import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { epmtyIssuesList, getIssues } from '../actions';

const Issues = () => {
  const selectedLabels = useSelector((state) => state.selectedLabelsStore);
  const reposlist = useSelector((state) => state.reposStore.reposlist);
  const { loading, issuesList, language } = useSelector((state) => state.issuesStore);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(epmtyIssuesList());
    if (reposlist) {
      for (let i = 0; i < reposlist.length; i++) {
        for (let j = 0; j < selectedLabels.length; j++) {
          if (language == 'All')
            dispatch(getIssues(reposlist[i].org, reposlist[i].repo, selectedLabels[j]));
          else if (language.toLowerCase() === reposlist[i].language.trim().toLowerCase())
            dispatch(getIssues(reposlist[i].org, reposlist[i].repo, selectedLabels[j]));
        }
      }
    }
  }, [selectedLabels]);
  const issueListFlat = selectedLabels.length ? issuesList?.flat() : null;
  return (
    <>
      <h1 className="filter-title fixed right-0 left-0  z-[1]">Issues</h1>
      <div className="issue-container h-full">
        <ul className="mt-14 grid xxl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 p-2">
          {loading ? (
            <div className="spinner-border m-5" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : !issuesList?.length && selectedLabels?.length ? (
            <span className="m-2 h2">No Issue Found</span>
          ) : !selectedLabels.length ? (
            <span className="m-2 h2">No Label Selected</span>
          ) : (
            issueListFlat.map((issue, i) => (
              <li key={i}>
                <a
                  href={issue.html_url}
                  target="_blank"
                  className="card-link"
                  rel="noopener noreferrer">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <h5 className="card-title align-middle">{issue?.title}</h5>
                    </div>
                  </div>
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default Issues;
