export type MascotMood = "idle" | "thinking" | "executing" | "greeting" | "sleeping"

export interface MascotSpriteFrame {
  readonly rows: readonly string[]
  readonly width: number
  readonly height: number
}

export interface MascotAnimationSequence {
  readonly frames: readonly MascotSpriteFrame[]
  readonly intervalMs: number
}
