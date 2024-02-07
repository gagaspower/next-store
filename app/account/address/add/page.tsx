"use client";
import React, { useState } from "react";
import { Jarak } from "@/components/application-ui/Spacing";
import AreaInput from "@/components/application-ui/form/AreaInput";
import TextInput from "@/components/application-ui/form/TextInput";
import * as Yup from "yup";
import { IAddress, IKota, IProvinsi } from "@/interface/userAddress";
import { containsOnlyNumbers } from "@/utils/func";
import { useFormik } from "formik";
import { useProvinsi } from "@/hook/useProvinsi";
import SelectInput from "@/components/application-ui/form/SelectInput";
import { useKota } from "@/hook/useKota";
import { BtnSubmit } from "@/components/application-ui/Button";
import { instance } from "@/utils/httpClient";
import { useToastAlert } from "@/components/application-ui/Toast";

function AddAddress() {
  const { isLoadingProv, data } = useProvinsi();
  const { isLoadingKota, data: dataKota, setProvinsiId } = useKota();
  const { toastSuccess, toastError } = useToastAlert();
  const [loading, setLoading] = useState<boolean>(false);

  /** initialstate for formik */
  const initialValues: Pick<
    IAddress,
    | "address"
    | "user_address_prov_id"
    | "user_address_kab_id"
    | "user_address_kodepos"
  > = {
    address: "",
    user_address_prov_id: 0,
    user_address_kab_id: 0,
    user_address_kodepos: "",
  };

  const schema = Yup.object({
    address: Yup.string().required("Detail alamat wajib diisi"),
    user_address_prov_id: Yup.number().test({
      name: "prov-is-not-0",
      test: function (value) {
        if (!value) {
          return this.createError({
            message: "Provinsi wajib diisi",
          });
        }
        if (value && value === 0) {
          return this.createError({
            message: "Provinsi wajib diisi",
          });
        }
        return true;
      },
    }),
    user_address_kab_id: Yup.number().test({
      name: "kab-is-not-0",
      test: function (value) {
        if (!value) {
          return this.createError({
            message: "Kabupaten wajib diisi",
          });
        }
        if (value && value === 0) {
          return this.createError({
            message: "Kabupaten wajib diisi",
          });
        }
        return true;
      },
    }),
    user_address_kodepos: Yup.string().test({
      name: "isKodepos",
      test: function (value) {
        if (!value) {
          return this.createError({
            message: "Kode pos wajib diisi",
          });
        }
        if (value && !containsOnlyNumbers(value)) {
          return this.createError({
            message: "Kode pos hanya berupa angka",
          });
        }

        return true;
      },
    }),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: async () => {
      await handleSave();
    },
  });

  const handleChangeProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvinsiId(Number(e.target.value));
    formik.setFieldValue("user_address_prov_id", e.target.value);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await instance.post(`/address/create`, formik.values);
      formik.resetForm();
      toastSuccess("Data berhasil disimpan");
    } catch (error) {
      toastError("Gagal menyimpan data");
    }
  };

  return (
    <>
      <form>
        <div className="flex mb-3 border-b p-2 justify-between items-center">
          <h3 className="font-poppins font-bold">Tambah Alamat</h3>
        </div>

        <AreaInput
          label="Detail Alamat"
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.errors.address}
        />
        <Jarak />
        <SelectInput
          label="Provinsi"
          value={formik.values.user_address_prov_id.toString()}
          name="user_address_prov_id"
          onChangeInput={handleChangeProvince}
          error={formik.errors.user_address_prov_id}
          loading={isLoadingProv}
        >
          {data?.map((prov: IProvinsi, index: number) => {
            return (
              <option value={prov.province_id} key={index}>
                {prov.province_name}
              </option>
            );
          })}
        </SelectInput>
        <Jarak />
        <SelectInput
          label="Kota"
          value={formik.values.user_address_kab_id.toString()}
          name="user_address_kab_id"
          onChangeInput={formik.handleChange}
          error={formik.errors.user_address_kab_id}
          loading={isLoadingKota}
        >
          {dataKota?.map((kota: IKota, index: number) => {
            return (
              <option value={kota.city_id} key={index}>
                {kota.city_name}
              </option>
            );
          })}
        </SelectInput>
        <Jarak />
        <TextInput
          label="Kode pos"
          type="text"
          name="user_address_kodepos"
          value={formik.values.user_address_kodepos}
          onChange={formik.handleChange}
          maxWidth="lg"
          error={formik.errors.user_address_kodepos}
        />
      </form>
      <Jarak />
      <div className="sticky bottom-0 w-full bg-slate-50 shadow-lg p-5 z-20">
        <div className="flex justify-end">
          <BtnSubmit
            type="submit"
            label="Simpan Alamat"
            onClick={formik.handleSubmit}
            loading={loading ? true : false}
          />
        </div>
      </div>
    </>
  );
}

export default AddAddress;
