"use client";
import { addCategory, getCategoryById } from "@/app/api/category";
import { BtnSubmit } from "@/app/component/application-ui/Button";
import ContentWrapper from "@/app/component/application-ui/ContentWrapper";
import { Jarak } from "@/app/component/application-ui/Spacing";
import SpinLoading from "@/app/component/application-ui/Spinner";
import { useToastAlert } from "@/app/component/application-ui/Toast";
import TextInput from "@/app/component/application-ui/form/TextInput";
import { TCategory } from "@/app/interface/category";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import * as Yup from "yup";

const EditCategory = () => {
  const param = useParams<{ id: string }>();
  const currentId: number = parseInt(param.id) as number;
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
      toastSuccess("Data berhasil disimpan");
    },
    onError: (err: any) => {
      toastError(err);
    },
  });

  const { data: currentCategory, isPending } = useQuery<TCategory>({
    queryKey: ["detail-category", currentId],
    queryFn: () => getCategoryById({ id: currentId }),
  });

  useEffect(() => {
    if (currentCategory) {
      formik.setValues({
        ...formik.values,
        id: currentCategory?.id,
        category_name: currentCategory?.category_name,
      });
    }
  }, [currentCategory]);

  return (
    <ContentWrapper>
      <div className="flex flex-row justify-between mb-3 items-center">
        <h1 className="font-bold">Edit Kategori Produk</h1>
      </div>
      {isPending ? (
        <SpinLoading />
      ) : (
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
      )}
    </ContentWrapper>
  );
};

export default EditCategory;
