"use client";
import { addCategory, getCategoryById } from "@/lib/category";
import { BtnSubmit } from "@/components/application-ui/Button";

import { Jarak } from "@/components/application-ui/Spacing";

import { useToastAlert } from "@/components/application-ui/Toast";
import { TCategory } from "@/interface/category";
import { MAX_FILE_SIZE, isValidFileType } from "@/utils/imageValidate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import withAuth from "@/context/withAuth";

const SpinLoading = dynamic(
  () => import("@/components/application-ui/Spinner")
);
const FileInput = dynamic(
  () => import("@/components/application-ui/form/FileInput")
);
const TextInput = dynamic(
  () => import("@/components/application-ui/form/TextInput")
);

const EditCategory = () => {
  const param = useParams<{ id: string }>();
  const currentId: number = parseInt(param.id) as number;
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toastSuccess, toastError } = useToastAlert();
  const initialValue: Pick<
    TCategory,
    "id" | "category_name" | "category_image"
  > = {
    id: 0,
    category_name: "",
    category_image: null,
  };

  const schema = Yup.object({
    category_name: Yup.string().required("Category is required"),
    category_image: Yup.mixed()
      .nullable()
      .test(
        "is-valid-type",
        "Jenis file harus berupa .jpg .png atau .jpeg",
        (value: any) => {
          if (!value) {
            return true;
          }
          return (
            value &&
            isValidFileType(
              value && (value as File)?.name.toLowerCase(),
              "image"
            )
          );
        }
      )
      .test("is-valid-size", "Maksimal ukuran file 2MB", (value: any) => {
        if (!value) {
          return true;
        }
        return value && (value as File)?.size <= MAX_FILE_SIZE;
      }),
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
      const { id, category_name, category_image } = formik.values;
      await addCategory({
        id: id,
        data: {
          category_name,
          category_image,
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

  const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? event.target.files[0] : null;
    formik.setFieldValue("category_image", selectedFiles);
    if (selectedFiles) {
      // Read the selected file and set the image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFiles);
    } else {
      // No file selected, reset the image preview
      setImgPreview(null);
    }
  };

  const handleRemoveImge = () => {
    setImgPreview(null);
    formik.setFieldValue("category_image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
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
          <FileInput
            label="Ikon"
            name="category_image"
            onChange={(e) => selectImage(e)}
            maxWidth="lg"
            inputRef={fileInputRef}
            error={formik.errors.category_image}
          />
          <Jarak />
          {imgPreview && (
            <div className="flex flex-col max-w-[100px]">
              <Image
                src={imgPreview}
                alt="categoryImage"
                width={100}
                height={100}
                className="bg-slate-300 p-2 rounded-md mb-1"
              />
              <button
                type="button"
                className="bg-slate-300 p-2 rounded-md"
                onClick={handleRemoveImge}
              >
                <span className="text-sm flex flex-row items-center justify-center">
                  <BsFillTrash3Fill /> Hapus
                </span>
              </button>
            </div>
          )}
          <Jarak />
          <div className="flex flex-row gap-2 items-center">
            <BtnSubmit
              label="Simpan"
              loading={mutation.isPending ? true : false}
            />
          </div>
        </form>
      )}
    </>
  );
};

export default withAuth(EditCategory, { roles: ["admin"] });
