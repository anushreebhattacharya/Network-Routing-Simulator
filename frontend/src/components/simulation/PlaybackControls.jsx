import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';

export default function PlaybackControls({ enabled, playing, onPlay, onPause, onStep, onReset }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" className="btn-primary" disabled={!enabled} onClick={playing ? onPause : onPlay}>
        {playing ? <Pause size={14} /> : <Play size={14} />}
        {playing ? 'Pause' : 'Play'}
      </button>
      <button type="button" className="btn-secondary" disabled={!enabled} onClick={onStep}>
        <SkipForward size={14} /> Step
      </button>
      <button type="button" className="btn-ghost" disabled={!enabled} onClick={onReset}>
        <RotateCcw size={14} /> Reset packet
      </button>
    </div>
  );
}
