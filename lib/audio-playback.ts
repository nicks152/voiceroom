/** Ensures only one demo plays site-wide. */
let active: HTMLAudioElement | null = null

export function claimAudioPlayback(audio: HTMLAudioElement) {
  if (active && active !== audio) {
    active.pause()
  }
  active = audio
}

export function releaseAudioPlayback(audio: HTMLAudioElement) {
  if (active === audio) active = null
}
