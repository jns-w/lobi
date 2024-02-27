import {fetcher} from "@/lib/api";
import useSWR from "swr";

export function useFacilities() {
  const { data, error, isLoading } = useSWR('/api/facility/all', fetcher)

  return {
    facilities: data,
    isLoading,
    isError: error,
  }
}