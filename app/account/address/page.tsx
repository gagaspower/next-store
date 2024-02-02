"use client";
import { Jarak } from "@/components/application-ui/Spacing";
import { useToastAlert } from "@/components/application-ui/Toast";
import { useSessionContext } from "@/context/sessionProvider";
import { IAddress } from "@/interface/userAddress";
import { getAddress, setDefaultAddress } from "@/lib/user_address";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const AddressPage = () => {
  const { sessionAuth } = useSessionContext();
  const { toastSuccess, toastError } = useToastAlert();

  const { session_id } = sessionAuth;
  const queryClient = useQueryClient();

  const { data: address, isPending: addressLoading } = useQuery({
    queryKey: ["fetch-address"],
    queryFn: () => getAddress(),
  });

  const mutation = useMutation({
    mutationFn: async (addressId: number) => {
      await setDefaultAddress({
        addressId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-address"] });
      toastSuccess("Alamat default berhasil di setel.");
    },
    onError: (err: any) => {
      toastError(err);
    },
  });

  return (
    <div className="p-2">
      <div className="flex justify-between">
        <span>Alamat saya: </span>
        <Link href="#" className="text-sm text-blue-500 italic">
          + Tambah alamat
        </Link>
      </div>
      <Jarak />
      {address?.data?.map((alamat: IAddress, index: number) => {
        return (
          <section key={index}>
            <div className="flex flex-col lg:flex-row justify-between border-b border-gray-300  ">
              <div className="w-full max-w-lg">
                <h3 className="text-sm font-bold">{alamat.address}</h3>
                <span className="text-xs italic">
                  {alamat.provinsi.province_name} - {alamat.kota.city_name} -
                  {alamat.user_address_kodepos}
                </span>
              </div>
              <div className="form-control items-center">
                <span className="label-text text-xs">
                  {alamat.isDefault ? "Default" : "Set default"}
                </span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={alamat.isDefault ? true : false}
                  onChange={() => mutation.mutate(alamat.id)}
                />
              </div>
            </div>
            <Jarak />
          </section>
        );
      })}
    </div>
  );
};

export default AddressPage;
