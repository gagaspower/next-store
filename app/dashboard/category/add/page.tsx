"use client";
import { addCategory } from "@/app/api/category";
import { BtnSubmit } from "@/app/component/application-ui/Button";
import ContentWrapper from "@/app/component/application-ui/ContentWrapper";
import { Jarak } from "@/app/component/application-ui/Spacing";
import { useToastAlert } from "@/app/component/application-ui/Toast";
import FileInput from "@/app/component/application-ui/form/FileInput";
import TextInput from "@/app/component/application-ui/form/TextInput";
import { TCategory } from "@/app/interface/category";
import { MAX_FILE_SIZE, isValidFileType } from "@/app/utils/imageValidate";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import * as Yup from "yup";

const AddCategory = () => {
  const { toastSuccess, toastError } = useToastAlert();
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      formik.resetForm();
      handleRemoveImge();
      toastSuccess("Data berhasil disimpan");
    },
    onError: (err: any) => {
      toastError(err);
    },
  });

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
    </ContentWrapper>
  );
};

export default AddCategory;
