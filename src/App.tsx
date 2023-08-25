import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { homeDir } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { invoke } from '@tauri-apps/api';
import "./App.css";

type Entry = {
  type: 'dir' | 'file';
  name: string;
  path: string;
};

type Entries = Array<Entry>;

const App = () => {
  const [src, setSrc] = useState<string | null>(null);
  const [dir, setDir] = useState<string | null>(null);
  const [player, setPlayer] = useState<JSX.Element | null>(null);
  const [entries, setEntries] = useState<Entries | null>(null);

  useEffect(() => {
    (async () => {
      const home = await homeDir();
      setDir(home);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!src) {
        return;
      }

      const url = convertFileSrc(src);
      const player = <ReactPlayer url={url} controls={true} />;
      setPlayer(player);
    })();
  }, [src]);

  useEffect(() => {
    (async () => {
      const entries = await invoke<Entries>("get_entries", { path: dir })
        .catch(err => {
          console.error(err);
          return null;
        });

      setEntries(entries);
    })();
  }, [dir]);

  const entry_list = entries ? <ul>
    {entries.map(entry => {
      if (entry.type === "dir") {
        return <li key={entry.path} onClick={() => setDir(entry.path)}>{entry.name}</li>;
      } else {
        return <li key={entry.path} onClick={() => setSrc(entry.path)}>{entry.name}</li>;
      }
    })}
  </ul> : null;

  return (
    <div className='player-dis'>
      <h1>React Tauri Player</h1>
      <div className='video'>
        {player}
      </div>
      <div className='src-path'>
        src: {src ?? '(not selected)'}
      </div>
      <br />
      <button>
        <span className='btn-txt'>back</span>
      </button>
      <ul>
        {entry_list}
      </ul>
    </div>
  );
}

export default App;
