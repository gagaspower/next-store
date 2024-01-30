"use client";
import {
  addAttributeValue,
  deleteAttributeValue,
  findAttributeWithParent,
} from "@/app/lib/attribute";

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
import { instance } from "@/app/config/const";
import { IAttributeValues, TProductAttribute } from "@/app/interface/attribute";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const ProductAttributeValue = () => {
  const { toastSuccess, toastError } = useToastAlert();
  const param = useParams<{ id: string }>();
  const currentIdAttribute: number = parseInt(param.id) as number;
  const [buttonLabel, setButtonLabel] = useState<string>("Simpan");
  const [currentAttribute, setCurrentAttribute] = useState<TProductAttribute>();
  const queryClient = useQueryClient();

  const initialValue: Pick<IAttributeValues, "id" | "value" | "attribute_id"> =
    {
      id: 0,
      attribute_id: 0,
      value: "",
    };

  const { data, isPending } = useQuery({
    queryKey: ["fetch-attributes-value", currentIdAttribute],
    queryFn: async () =>
      await findAttributeWithParent({ id: currentIdAttribute }),
  });

  const schema = Yup.object({
    value: Yup.string().required("value is required"),
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
      const { id, attribute_id, value } = formik.values;
      await addAttributeValue({
        id: id,
        data: {
          attribute_id,
          value,
        },
      });
    },
    onSuccess: () => {
      formik.setValues({
        ...formik.values,
        id: 0,
        value: "",
        attribute_id: currentIdAttribute,
      });
      queryClient.invalidateQueries({ queryKey: ["fetch-attributes-value"] });
      setButtonLabel("Simpan");
      toastSuccess("Data berhasil disimpan");
    },
    onError: (err: any) => {
      toastError(err);
    },
  });

  const handleEditAttribute = (item: IAttributeValues) => {
    formik.setValues({
      ...formik.values,
      id: item?.id,
      attribute_id: item?.attribute_id,
      value: item?.value,
    });
    setButtonLabel("Update");
  };

  const handleResetUpdate = () => {
    formik.resetForm();
    setButtonLabel("Simpan");
  };

  const mutationRemove = useMutation({
    mutationFn: async (item: any) => {
      const { id } = item;
      await deleteAttributeValue(Number(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-attributes-value"] });
      toastSuccess("Data berhasil dihapus");
    },
    onError: (err: any) => {
      toastError(err?.message);
    },
  });

  useEffect(() => {
    const getParent = async () => {
      try {
        const result = await instance.get(`/attribute/${currentIdAttribute}`);
        setCurrentAttribute(result.data);
      } catch (error) {
        console.log("Error get current Attribute");
      }
    };
    formik.setValues({
      ...formik.values,
      attribute_id: Number(param.id),
    });
    formik.setErrors({});

    getParent();
  }, [currentIdAttribute]);

  return (
    <ContentWrapper>
      <div className="flex mb-3">
        <Link href="/dashboard/attribute">
          <span className="text-xs text-blue-500 italic underline">
            Kembali ke attribute
          </span>
        </Link>
      </div>
      <div className="flex flex-row  mb-3 items-center">
        <h1 className="font-bold">
          Attribute Item {currentAttribute?.attribute_name}
        </h1>
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
            <input
              type="hidden"
              name="attribute_id"
              value={formik.values.attribute_id}
              onChange={formik.handleChange}
            />
            <TextInput
              label="Value"
              type="text"
              name="value"
              value={formik.values.value}
              onChange={formik.handleChange}
              error={formik.errors.value}
            />
            <Jarak />
            <div className="border border-red-400 rounded-md p-3 bg-red-100 text-xs italic text-red-500">
              <p>Masukan nama item atribut produk</p>
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
                    <th>Value</th>
                    <th>Term</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td>{item.value}</td>
                        <td className="flex flex-col gap-2">
                          <div className="flex gap-1">
                            <BtnEdit
                              onClick={() => handleEditAttribute(item)}
                            />
                            <BtnDelete
                              onClick={() => mutationRemove.mutate(item)}
                            />
                          </div>
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

export default ProductAttributeValue;
