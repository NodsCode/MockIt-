import { useEffect, useState } from "react";
import { MODES, transformText } from "./modes";

const HISTORY_KEY = "mockit-history";
const MAX_HISTORY = 8;

function getInitialHistory() {
  try {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getModeLabel(modeValue) {
  return MODES.find((mode) => mode.value === modeValue)?.label ?? "Custom";
}

function BackgroundRibbon({ items }) {
  const content = items.length
    ? items.map((item) => item.result).join("   *   ")
    : "NO REMIXES YET   *   SAVE A RESULT TO SEE IT FLOAT ACROSS THE BACKGROUND";

  return (
    <div className="background-ribbons" aria-hidden="true">
      <div className="ribbon-row ribbon-row-one">
        <div className="ribbon-track">
          <span>{content}</span>
          <span>{content}</span>
        </div>
      </div>
      <div className="ribbon-row ribbon-row-two">
        <div className="ribbon-track">
          <span>{content}</span>
          <span>{content}</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sourceText, setSourceText] = useState("");
  const [mode, setMode] = useState(MODES[0].value);
  const [intensity, setIntensity] = useState(5);
  const [resultText, setResultText] = useState("");
  const [history, setHistory] = useState(getInitialHistory);
  const [copyState, setCopyState] = useState("Copy");

  const preview = (() => {
    if (!sourceText.trim()) return "";
    return transformText(sourceText.trim(), mode, intensity);
  })();

  useEffect(() => {
    setResultText(preview);
  }, [preview]);

  useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  function saveCurrentResult(nextMode = mode) {
    const baseText = sourceText.trim();
    if (!baseText) return;

    const nextResult = transformText(baseText, nextMode, intensity);
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      mode: nextMode,
      modeLabel: getModeLabel(nextMode),
      source: baseText,
      result: nextResult
    };

    setResultText(nextResult);
    setHistory((current) => [entry, ...current].slice(0, MAX_HISTORY));
  }

  function handleShuffleMode() {
    const otherModes = MODES.filter((entry) => entry.value !== mode);
    const nextMode = otherModes[Math.floor(Math.random() * otherModes.length)].value;
    setMode(nextMode);

    if (sourceText.trim()) {
      const nextResult = transformText(sourceText.trim(), nextMode, intensity);
      setResultText(nextResult);
      setHistory((current) => [
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          mode: nextMode,
          modeLabel: getModeLabel(nextMode),
          source: sourceText.trim(),
          result: nextResult
        },
        ...current
      ].slice(0, MAX_HISTORY));
    }
  }

  async function handleCopy() {
    if (!resultText) return;

    try {
      await navigator.clipboard.writeText(resultText);
      setCopyState("Copied");
    } catch {
      setCopyState("Copy Failed");
    }

    window.setTimeout(() => {
      setCopyState("Copy");
    }, 1200);
  }

  return (
    <div className="app-shell">
      <BackgroundRibbon items={history} />

      <header className="topbar">
        <div className="brand-mini">MockIt!</div>
        <nav className="topnav">
          <a href="#studio">Studio</a>
          <a href="#history">History</a>
        </nav>
      </header>

      <main className="layout">
        <section className="hero">
          <p className="eyebrow">Playful text remix lab</p>
          <h1>MOCK IT!</h1>
          <p className="tagline">Let us help mock the moment, not the person.</p>
          <p className="hero-copy">
            Turn plain text into chaotic meme energy for jokes, reactions, and dramatic
            nonsense. Your saved remixes even drift through the background.
          </p>
        </section>

        <section className="studio-card" id="studio">
          <div className="card-header">
            <div>
              <p className="section-label">Main Screen</p>
              <h2>Start Mocking</h2>
            </div>
            <button className="ghost-button" type="button" onClick={handleShuffleMode}>
              Surprise Me
            </button>
          </div>

          <label className="field-label" htmlFor="sourceText">
            Original text
          </label>
          <textarea
            id="sourceText"
            rows="5"
            placeholder="Type something silly here..."
            value={sourceText}
            onChange={(event) => setSourceText(event.target.value)}
          />

          <div className="controls">
            <div className="control-group">
              <label className="field-label" htmlFor="modeSelect">
                Mode
              </label>
              <select
                id="modeSelect"
                value={mode}
                onChange={(event) => setMode(event.target.value)}
              >
                {MODES.map((entry) => (
                  <option key={entry.value} value={entry.value}>
                    {entry.label}
                  </option>
                ))}
              </select>
              <p className="mode-description">
                {MODES.find((entry) => entry.value === mode)?.description ?? "Custom remix mode"}
              </p>
            </div>

            <div className="control-group">
              <label className="field-label" htmlFor="intensityRange">
                Chaos level: {intensity}
              </label>
              <input
                id="intensityRange"
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(event) => setIntensity(Number(event.target.value))}
              />
            </div>
          </div>

          <div className="action-row">
            <button className="primary-button" type="button" onClick={() => saveCurrentResult()}>
              Generate Result
            </button>
            <button className="secondary-button" type="button" onClick={handleCopy}>
              {copyState}
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setSourceText("");
                setResultText("");
              }}
            >
              Clear
            </button>
          </div>

          <label className="field-label" htmlFor="resultText">
            Final result
          </label>
          <textarea
            id="resultText"
            rows="5"
            readOnly
            placeholder="Your remixed text will appear here..."
            value={resultText}
          />

          <div className="history-card" id="history">
            <div className="history-header">
              <div>
                <p className="section-label">History</p>
                <h3>Saved remixes</h3>
              </div>
              <button className="ghost-button" type="button" onClick={() => setHistory([])}>
                Reset
              </button>
            </div>

            <ul className="history-list">
              {!history.length && (
                <li className="history-empty">
                  No remixes yet. Generate one to save it and send it into the background.
                </li>
              )}

              {history.map((item) => (
                <li key={item.id}>
                  <span className="history-mode">{item.modeLabel}</span>
                  <p className="history-source">{item.source}</p>
                  <p className="history-result">{item.result}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
