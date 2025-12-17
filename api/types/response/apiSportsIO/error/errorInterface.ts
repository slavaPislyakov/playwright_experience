export interface IError {
  get: string
  parameters: Record<string, unknown>[]
  errors: Errors
  results: number
  paging: Paging
  response: Record<string, unknown>[];
}

interface Errors {
  token: string
  error: string
}

interface Paging {
  current: number
  total: number
}
