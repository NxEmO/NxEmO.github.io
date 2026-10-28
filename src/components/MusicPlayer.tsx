"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const [track, setTrack] = useState<{ url: string; name: string } | null>({ url: "/quiet-notes.wav", name: "Quiet Notes · 原创循环旋律" });
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => () => { if (track) URL.revokeObjectURL(track.url); }, [track]);
  return (
    <details className="music-player glass-panel">
      <summary>♫ 音乐</summary>
      <p>{track?.name ?? "选择一首音乐，陪你阅读"}</p>
      <input ref={input} type="file" accept="audio/*" hidden onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) setTrack({ url: URL.createObjectURL(file), name: file.name });
      }} />
      <button type="button" className="button button-quiet" onClick={() => input.current?.click()}>选择本地音乐</button>
      {track && <audio key={track.url} src={track.url} controls loop preload="metadata" />}
      <small>音频仅在你的设备播放，不会上传。</small>
    </details>
  );
}
