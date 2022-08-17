import './App.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
  const [repo, setRepo] = useState([]);
  const [user, setUser] = useState([]);
  const [prevRatio, setPrevRatio] = useState(0);

  const options = {
    root: document.querySelector('#App'),
    threshold: Array(100)
      .fill()
      .map((v, i) => i * 0.01),
  };

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      const { intersectionRatio, target } = entry;
      if (intersectionRatio > prevRatio) {
        target.style.opacity = `${intersectionRatio}`;
      } else {
        target.style.opacity = `${intersectionRatio}`;
      }
      setPrevRatio(intersectionRatio);
    });
  };
  const observer = new IntersectionObserver(callback, options);

  const targets = document.querySelectorAll('.card');

  for (const target of targets) {
    observer.observe(target);
  }

  useEffect(() => {
    let getRepo = async () => {
      try {
        let repoResponse = await axios.get(
          `https://api.github.com/users/kiyo415411/repos`
        );
        let userResponse = await axios.get(
          `https://api.github.com/users/kiyo415411`
        );
        setRepo(repoResponse.data);
        setUser(userResponse.data);
      } catch (e) {
        console.error(e);
      }
    };
    getRepo();
  }, []);

  const repoList = [];

  repo.map((v, i) => {
    return repoList.push(
      <div key={i} className="card">
        {repo[i].homepage !== '' ? (
          <a
            className="title"
            href={repo[i].homepage}
            target="_blank"
            rel="noreferrer"
          >
            {repo[i].name}
          </a>
        ) : (
          <h2 className="title">{repo[i].name}</h2>
        )}
        <p className="description">{repo[i].description}</p>
        <a
          className="url"
          href={repo[i].html_url}
          target="_blank"
          rel="noreferrer"
        >
          {repo[i].html_url}
        </a>
        <p className="topic-list">
          {repo[i].topics.map((v, i) => {
            return (
              <span key={i} className="topic">
                {v}
              </span>
            );
          })}
        </p>
      </div>
    );
  });

  return (
    <div id="App">
      <div className="card user">
        <div className="avatar">
          <img src={user.avatar_url} alt="Avatar" />
        </div>
        <strong>{user.name}'s RepoList</strong>
        <div>{user.bio}</div>
      </div>
      {repoList}
    </div>
  );
}

export default App;
