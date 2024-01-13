"use client";
import { addCategory } from "@/app/api/category";
import { BtnSubmit } from "@/app/component/application-ui/Button";
import ContentWrapper from "@/app/component/application-ui/ContentWrapper";
import { Jarak } from "@/app/component/application-ui/Spacing";
import { useToastAlert } from "@/app/component/application-ui/Toast";
import TextInput from "@/app/component/application-ui/form/TextInput";
import { TCategory } from "@/app/interface/category";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

const AddCategory = () => {
  const { toastSuccess, toastError } = useToastAlert();
  const initialValue: Pick<TCategory, "id" | "category_name"> = {
    id: 0,
    category_name: "",
  };

  const schema = Yup.object({
    category_name: Yup.string().required("Category is required"),
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
      const { id, category_name } = formik.values;
      await addCategory({
        id: id,
        data: {
          category_name,
        },
      });
    },
    onSuccess: () => {
      formik.resetForm();
      toastSuccess("Data berhasil disimpan");
    },
    onError: (err: any) => {
      toastError(err);
    },
  });

  return (
    <ContentWrapper>
      <div className="flex flex-row justify-between mb-3 items-center">
        <h1 className="font-bold">Tambah Kategori Produk</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="hidden"
          name="id"
          value={formik.values.id}
          onChange={formik.handleChange}
        />
        <TextInput
          label="Kategori"
          type="text"
          name="category_name"
          value={formik.values.category_name}
          onChange={formik.handleChange}
          error={formik.errors.category_name}
        />
        <Jarak />
        <div className="flex flex-row gap-2 items-center">
          <BtnSubmit
            label="Simpan"
            loading={mutation.isPending ? true : false}
          />
        </div>
      </form>
    </ContentWrapper>
  );
};

export default AddCategory;
