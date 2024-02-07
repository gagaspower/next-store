import { IKota } from "@/interface/userAddress";
import { publicApi } from "@/utils/httpClient";
import { useEffect, useState } from "react";

export function useKota() {
  const [isLoadingKota, setIsLoadingKota] = useState<boolean>(false);
  const [provinsiId, setProvinsiId] = useState<number>(0);
  const [data, setData] = useState<IKota[]>([]);

  const getAllKota = async () => {
    setIsLoadingKota(true);
    try {
      const response = await publicApi(`/public/get-kota/${provinsiId}`);
      setData(response.data);
      setIsLoadingKota(false);
    } catch (error) {
      console.log("Error");
      setIsLoadingKota(false);
    }
  };

  useEffect(() => {
    getAllKota();
  }, [provinsiId]);

  return {
    setProvinsiId,
    isLoadingKota,
    data,
  };
}
