// country.types.ts — Country lookup type used by address forms (Profile, future Customer forms)

export interface Country {
  countryId: number
  code:      string
  name:      string
  isoCode:   string
  phoneCode: string
}
