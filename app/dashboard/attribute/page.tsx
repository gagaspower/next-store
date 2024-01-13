"use client";
import {
  addAttribute,
  deleteAttribute,
  findAllAttribute,
} from "@/app/api/attribute";

import {
  BtnCancel,
  BtnDelete,
  BtnEdit,
  BtnSubmit,
} from "@/app/component/application-ui/Button";
import ContentWrapper from "@/app/component/application-ui/ContentWrapper";
import { Jarak } from "@/app/component/application-ui/Spacing";
import SpinLoading from "@/app/component/application-ui/Spinner";
import { useToastAlert } from "@/app/component/application-ui/Toast";
import TextInput from "@/app/component/application-ui/form/TextInput";
import { TProductAttribute } from "@/app/interface/attribute";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Link from "next/link";
import React, { useState } from "react";
import * as Yup from "yup";

const ProductAttribute = () => {
  const { toastSuccess, toastError } = useToastAlert();
  const [buttonLabel, setButtonLabel] = useState<string>("Simpan");
  const queryClient = useQueryClient();
  const initialValue: Pick<TProductAttribute, "id" | "attribute_name"> = {
    id: 0,
    attribute_name: "",
  };

  const { data, isPending } = useQuery({
    queryKey: ["fetch-attributes"],
    queryFn: async () => await findAllAttribute(),
  });

  const schema = Yup.object({
    attribute_name: Yup.string().required("Attribute name is required"),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: schema,
    onSubmit: () => {
      mutation.mutate();
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const { id, attribute_name } = formik.values;
      await addAttribute({
        id: id,
        data: {
          attribute_name,
        },
      });
    },
    onSuccess: () => {
      formik.resetForm();
      queryClient.invalidateQueries({ queryKey: ["fetch-attributes"] });
      handleResetUpdate();
      toastSuccess("Data berhasil disimpan");
    },
    onError: (err: any) => {
      toastError(err);
    },
  });

  const handleEditAttribute = (item: TProductAttribute) => {
    formik.setValues({
      ...formik.values,
      id: item?.id,
      attribute_name: item?.attribute_name,
    });
    setButtonLabel("Update");
  };

  const handleResetUpdate = () => {
    formik.resetForm();
    setButtonLabel("Simpan");
  };

  const mutationRemove = useMutation({
    mutationFn: async (item: TProductAttribute) => {
      const { id } = item;
      await deleteAttribute(Number(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-attributes"] });
      toastSuccess("Data berhasil dihapus");
    },
    onError: (err: any) => {
      toastError(err?.message);
    },
  });

  return (
    <ContentWrapper>
      <div className="flex mb-3">
        <Link href="/dashboard/product">
          <span className="text-xs text-blue-500 italic underline">
            Kembali ke produk
          </span>
        </Link>
      </div>
      <div className="flex flex-row  mb-3 items-center">
        <h1 className="font-bold">Attribute Produk</h1>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4 ">
        <div className="w-full lg:max-w-md">
          <form onSubmit={formik.handleSubmit}>
            <input
              type="hidden"
              name="id"
              value={formik.values.id}
              onChange={formik.handleChange}
            />
            <TextInput
              label="Value"
              type="text"
              name="attribute_name"
              value={formik.values.attribute_name}
              onChange={formik.handleChange}
              error={formik.errors.attribute_name}
            />
            <Jarak />
            <div className="border border-red-400 rounded-md p-3 bg-red-100 text-xs italic text-red-500">
              <p> - Masukan nama atribut produk</p>
              <p>
                - Tambahkan item pada atribut produk dengan klik link{" "}
                <strong>Configure item</strong>
              </p>
            </div>
            <Jarak />
            <div className="flex flex-row gap-2 items-center">
              <BtnSubmit
                label={buttonLabel}
                loading={mutation.isPending ? true : false}
              />
              {buttonLabel === "Update" && (
                <BtnCancel label="Reset" onClick={handleResetUpdate} />
              )}
            </div>
          </form>
        </div>
        <div className="w-full max-w-xl">
          <div className="overflow-x-auto">
            {isPending ? (
              <SpinLoading />
            ) : (
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>Nama Attribute</th>
                    <th>Slug</th>
                    <th>Term</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.attribute_name}</td>
                        <td>{item.attribute_slug}</td>
                        <td className="flex flex-col gap-2">
                          <div className="flex gap-1">
                            <BtnEdit
                              onClick={() => handleEditAttribute(item)}
                            />
                            <BtnDelete
                              onClick={() => mutationRemove.mutate(item)}
                            />
                          </div>
                          <Link href={`/dashboard/attribute_value/${item.id}`}>
                            <span className="text-xs text-blue-300 italic">
                              + Configure Item
                            </span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default ProductAttribute;
