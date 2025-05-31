import {
  getAllDistricts,
  getAllProvince,
  getAllWards,
} from "@/lib/api/province"
import { IDistrict, IProvince, IWard } from "@/types/province-type"
import { useQuery } from "@tanstack/react-query"

export const useProvinces = () => {
  return useQuery<IProvince[], Error>({
    queryKey: ["provinces"],
    queryFn: getAllProvince,
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút (thay cho cacheTime)
    retry: 2,
  })
}

export const useDistricts = (provinceId: number | null) => {
  return useQuery<IDistrict[], Error>({
    queryKey: ["districts", provinceId],
    queryFn: () => getAllDistricts(provinceId!.toString()),
    enabled: !!provinceId && provinceId > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  })
}

export const useWards = (districtId: number | null) => {
  return useQuery<IWard[], Error>({
    queryKey: ["wards", districtId],
    queryFn: () => getAllWards(districtId!.toString()),
    enabled: !!districtId && districtId > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  })
}
