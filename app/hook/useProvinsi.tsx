import { IProvinsi } from "@/interface/userAddress";
import { publicApi } from "@/utils/httpClient";
import { useEffect, useState } from "react";

export function useProvinsi() {
  const [isLoadingProv, setIsLoadingProv] = useState<boolean>(false);
  const [data, setData] = useState<IProvinsi[]>([]);

  const getAllProvinsi = async () => {
    setIsLoadingProv(true);
    try {
      const response = await publicApi(`/public/get-provinsi`);
      setData(response.data);
      setIsLoadingProv(false);
    } catch (error) {
      console.log("Error");
      setIsLoadingProv(false);
    }
  };

  useEffect(() => {
    getAllProvinsi();
  }, []);

  return {
    isLoadingProv,
    data,
  };
}
