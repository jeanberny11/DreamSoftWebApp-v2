// municipality.types.ts — Municipality lookup type, scoped to a parent Province

export interface Municipality {
  municipalityId: number
  code:       string
  name:       string
  provinceId: number
}
