export interface ILeagueInfo {
  get: string
  parameters: Parameters
  errors: ApiError[]
  results: number
  response: Response[]
}

interface Parameters {
  id: string
}

interface ApiError {
  message: string;
  code: number;
}

interface Response {
  id: number
  name: string
  type: string
  logo: string
  country: Country
  seasons: Season[]
}

interface Country {
  id: number
  name: string
  code: string
  flag: string
}

interface Season {
  season: number
  current: boolean
  start: string
  end: string
}
