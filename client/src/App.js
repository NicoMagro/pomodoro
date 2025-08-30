
import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  // Refs para los sonidos
  const workAudioRef = useRef(null);
  const breakAudioRef = useRef(null);
  // Configuración personalizable
  const [workMinutes, setWorkMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [pomodorosBeforeLongBreak, setPomodorosBeforeLongBreak] = useState(4);
  const [showConfig, setShowConfig] = useState(false);

  // Estado del temporizador
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const intervalRef = useRef(null);

  // Actualiza segundos cuando cambian los minutos configurados
  React.useEffect(() => {
    if (mode === 'work') setSecondsLeft(workMinutes * 60);
    if (mode === 'shortBreak') setSecondsLeft(shortBreakMinutes * 60);
    if (mode === 'longBreak') setSecondsLeft(longBreakMinutes * 60);
    // eslint-disable-next-line
  }, [workMinutes, shortBreakMinutes, longBreakMinutes, mode]);

  // Formatea mm:ss
  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // Lógica del temporizador
  React.useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft === 0) {
      if (mode === 'work') {
        const nextCount = pomodoroCount + 1;
        setPomodoroCount(nextCount);
        if (nextCount % pomodorosBeforeLongBreak === 0) {
          setMode('longBreak');
          setSecondsLeft(longBreakMinutes * 60);
        } else {
          setMode('shortBreak');
          setSecondsLeft(shortBreakMinutes * 60);
        }
        // Sonido de descanso (más suave)
        setTimeout(() => breakAudioRef.current && breakAudioRef.current.play(), 100);
      } else {
        setMode('work');
        setSecondsLeft(workMinutes * 60);
        // Sonido de trabajo
        setTimeout(() => workAudioRef.current && workAudioRef.current.play(), 100);
      }
      // Continuar automáticamente
      return;
    }
    intervalRef.current = setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearTimeout(intervalRef.current);
  }, [isRunning, secondsLeft, mode, pomodoroCount, pomodorosBeforeLongBreak, workMinutes, shortBreakMinutes, longBreakMinutes]);

  // Handlers
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'work') setSecondsLeft(workMinutes * 60);
    if (mode === 'shortBreak') setSecondsLeft(shortBreakMinutes * 60);
    if (mode === 'longBreak') setSecondsLeft(longBreakMinutes * 60);
  };

  // Cambiar configuración
  const handleConfigChange = (setter, min = 0) => (e) => {
    let value = e.target.value.replace(/^0+/, ''); // Elimina ceros a la izquierda
    if (value === '' || isNaN(value)) {
      setter(min);
    } else {
      value = Math.max(Number(value), min);
      setter(value);
    }
  };

  // Colores de fondo según el modo
  let bgColor = '#1e213f';
  if (mode === 'work') bgColor = '#f87070'; // rojo suave
  if (mode === 'shortBreak') bgColor = '#70f3f8'; // celeste
  if (mode === 'longBreak') bgColor = '#70f3a0'; // verde menta

  return (
    <div className="App" style={{ background: bgColor, transition: 'background 0.5s' }}>
      {/* Audios para notificaciones */}
      <audio ref={workAudioRef} src="/work.mp3" preload="auto" />
      <audio ref={breakAudioRef} src="/break.mp3" preload="auto" />
      <h1>Pomodoro</h1>
      <button className="config-btn" onClick={() => setShowConfig(true)} title="Configuración">⚙️</button>

      {/* Modal de configuración */}
      {showConfig && (
        <div className="modal-bg">
          <div className="modal">
            <h2>Configuración Pomodoro</h2>
            <label>
              Trabajo (min):
              <input type="number" min="1" value={workMinutes} onChange={handleConfigChange(setWorkMinutes)} disabled={isRunning} />
            </label>
            <label>
              Descanso corto (min):
              <input type="number" min="1" value={shortBreakMinutes} onChange={handleConfigChange(setShortBreakMinutes)} disabled={isRunning} />
            </label>
            <label>
              Descanso largo (min):
              <input type="number" min="1" value={longBreakMinutes} onChange={handleConfigChange(setLongBreakMinutes)} disabled={isRunning} />
            </label>
            <label>
              Pomodoros antes de largo:
              <input type="number" min="1" value={pomodorosBeforeLongBreak} onChange={handleConfigChange(setPomodorosBeforeLongBreak)} disabled={isRunning} />
            </label>
            <button onClick={() => setShowConfig(false)}>Cerrar</button>
          </div>
        </div>
      )}

      <h2>{mode === 'work' ? 'Trabajo' : mode === 'shortBreak' ? 'Descanso corto' : 'Descanso largo'}</h2>
      <div className="timer">{formatTime(secondsLeft)}</div>
      <div>
        {!isRunning ? (
          <button onClick={startTimer}>Iniciar</button>
        ) : (
          <button onClick={pauseTimer}>Pausar</button>
        )}
        <button onClick={resetTimer}>Reiniciar</button>
      </div>
      <div className="pomodoros">
        <strong>Pomodoros completados:</strong> {pomodoroCount}
      </div>
    </div>
  );
}

export default App;
