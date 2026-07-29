// province.types.ts — Province lookup type, scoped to a parent Country

export interface Province {
  provinceId:number
  code:      string
  name:      string
  countryId: number
}
