import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Issues from './Issues';
import { getRepos } from '../actions';
import { SearchEngine } from './SearchEngine';
import { Select, Option } from '@material-tailwind/react';
import { Line } from 'rc-progress';
import Button from 'react-bootstrap/Button';
import { VscGithub } from 'react-icons/vsc';
import {
  addToSelectedLabels,
  epmtySelectedLabel,
  epmtyIssuesList,
  toggleLabelList,
  setLanguage
} from '../actions';

const Home = () => {
  const [label, setLabel] = useState('Good First Issue');
  const [lang, setLang] = useState('All');

  const dispatch = useDispatch();
  useEffect(
    () => {
      dispatch(getRepos());
    },
    // eslint-disable-next-line
    []
  );
  const { loading, loadingPercentage, menu } = useSelector((state) => state.labelsStore);
  const { issuesList } = useSelector((state) => state.issuesStore);
  function findIssues() {
    if (label === 'All') {
      dispatch(epmtyIssuesList());
      dispatch(epmtySelectedLabel());
      dispatch(toggleLabelList(1));
    } else {
      dispatch(toggleLabelList(2));
      dispatch(epmtyIssuesList());
      dispatch(epmtySelectedLabel());
      dispatch(addToSelectedLabels(label));
    }
    dispatch(setLanguage(lang));
  }

  return (
    <div className="App">
      <header
        className="App-header sticky top-0 left-0 right-0 z-[2]"
        style={{ minHeight: issuesList || menu === 2 ? '30vh' : '100vh' }}>
        <p className="">Welcome to </p>
        <div className="flex flex-row justify-between">
          <code className="space-x-2 font-bold">
            Issue
            <a
              className=""
              href="https://github.com/voscarmv/issue-finder"
              target="_blank"
              aria-label="Github"
              rel="noopener noreferrer">
              <VscGithub className="git-icon" />
            </a>
            Finder
          </code>
        </div>
        <em className="my-4 mt-3 text-sm text-white rounded-1 w-80">
          Best Open Source issue locator for busy Devs!
        </em>
        {menu === 2 ? (
          <>
            <SearchEngine />
            <Line
              percent={loading ? loadingPercentage : 100}
              strokeWidth={1.5}
              trailWidth={1.5}
              className="mx-4 my-4"
              strokeColor="#FF10F0"
            />
            {loading ? <code className="my-4">Loading...</code> : null}
          </>
        ) : null}
        <div className="flex flex-col gap-10 my-4 space-y-1 md:gap-4 md:items-end md:flex-row">
          <Select
            variant="static"
            label="Label"
            title="Issue label"
            className="text-white"
            selected={(ele) => (ele ? ele.props.children : label)}
            disabled={loading}
            onChange={(label) => setLabel(label)}>
            <Option value="Good First Issue">Good First Issue</Option>
            <Option value="chore">Chore</Option>
            <Option value="Documentation">Documentation</Option>
            <Option value="Bug">Bug</Option>
            <Option value="Help Wanted">Help Wanted</Option>
            <Option value="Question">Question</Option>
            <Option value="All">All</Option>
          </Select>
          <Button
            variant="dark button button-green w-full h-15"
            disabled={loading || (menu === 2 && label === 'All')}
            onClick={() => findIssues()}>
            {label === 'All' ? 'Load Labels' : 'Find Issues'}
          </Button>
          <Select
            variant="static"
            label="Language"
            title="Language"
            className="text-white"
            selected={(ele) => (ele ? ele.props.children : lang)}
            onChange={(language) => setLang(language)}>
            <Option value="ruby">Ruby</Option>
            <Option value="javascript">JavaScript</Option>
            <Option value="All">All</Option>
          </Select>
        </div>
      </header>
      {issuesList && menu === 1 ? <Issues /> : menu === 2 ? <Issues /> : null}
    </div>
  );
};

export default Home;
