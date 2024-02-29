import {fetcher} from "@/lib/api";
import useSWR from "swr";

const API_ENDPOINT = process.env.API_ENDPOINT || ""

export function useFacilities() {
  const { data, error, isLoading } = useSWR(`${API_ENDPOINT}/api/facility/all`, fetcher)

  return {
    facilities: data,
    isLoading,
    isError: error,
  }
}