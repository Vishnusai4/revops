// ─── 4-question quiz types ────────────────────────────────────

export type QuizARRBand =
  | 'under-1m'
  | '1m-5m'
  | '5m-20m'
  | '20m-50m'
  | '50m-plus'

export type QuizAmbition =
  | 'conservative'
  | 'moderate'
  | 'aggressive'
  | 'very-aggressive'

export type QuizAttainment =
  | 'rarely'
  | 'sometimes'
  | 'often'
  | 'most'
  | 'almost-always'

export type QuizPipelineHealth =
  | 'clearly-short'
  | 'thin'
  | 'probably-enough'
  | 'solid'
  | 'more-than-enough'

export interface QuizInput {
  arrBand?: QuizARRBand
  ambition?: QuizAmbition
  attainment?: QuizAttainment
  pipelineHealth?: QuizPipelineHealth
}
