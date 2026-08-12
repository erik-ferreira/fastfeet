import { PaginationParams } from "./pagination-params"

export interface NearbyParams extends PaginationParams {
  latitude: number
  longitude: number
}
