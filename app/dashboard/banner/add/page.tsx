"use client";
import { addBanner } from "@/lib/banner";
import { BtnSubmit } from "@/components/application-ui/Button";

import { Jarak } from "@/components/application-ui/Spacing";
import { useToastAlert } from "@/components/application-ui/Toast";
import withAuth from "@/context/withAuth";
import { TBanner } from "@/interface/banner";

import { BANNER_MAX_FILE_SIZE, isValidFileType } from "@/utils/imageValidate";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import * as Yup from "yup";
import dynamic from "next/dynamic";

const AreaInput = dynamic(
  () => import("@/components/application-ui/form/AreaInput")
);
const FileInput = dynamic(
  () => import("@/components/application-ui/form/FileInput")
);
const TextInput = dynamic(
  () => import("@/components/application-ui/form/TextInput")
);

const AddBanner = () => {
  const { toastSuccess, toastError } = useToastAlert();
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** initialstate for formik */
  const initialValues: Pick<
    TBanner,
    "banner_title" | "banner_desc" | "banner_url" | "banner_image"
  > = {
    banner_title: "",
    banner_desc: "",
    banner_url: "",
    banner_image: null,
  };

  const schema = Yup.object({
    banner_title: Yup.string().required("Judul Wajib diisi"),
    banner_desc: Yup.string().nullable(),
    banner_url: Yup.string()
      .url(
        "Url tidak valid, contoh : http://google.com atau https://google.com"
      )
      .nullable(),
    banner_image: Yup.mixed()
      .required("Gambar banner wajib diisi")
      .test(
        "is-valid-type",
        "Jenis file harus berupa .jpg .png atau .jpeg",
        (value) =>
          isValidFileType(value && (value as File)?.name.toLowerCase(), "image")
      )
      .test(
        "is-valid-size",
        "Maksimal ukuran file 5MB",
        (value) => value && (value as File)?.size <= BANNER_MAX_FILE_SIZE
      ),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: () => {
      mutation.mutate();
    },
  });

  const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? event.target.files[0] : null;
    formik.setFieldValue("banner_image", selectedFiles);
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
    formik.setFieldValue("banner_image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      await addBanner({ data: formik.values });
    },
    onSuccess: () => {
      toastSuccess("Data berhasil disimpan");
      handleResetError();
      handleResetForm();
      handleRemoveImge();
    },
    onError: (err: any) => {
      toastError(err?.message);
    },
  });

  const handleResetForm = () => {
    formik.setValues({
      ...formik.values,
      banner_title: "",
      banner_desc: "",
      banner_url: "",
      banner_image: null,
    });
  };

  const handleResetError = () => {
    formik.setFieldError("banner_title", "");
    formik.setFieldError("banner_desc", "");
    formik.setFieldError("banner_url", "");
    formik.setFieldError("banner_image", "");
    formik.setFieldTouched("banner_image", false);
    formik.setFieldTouched("banner_title", false);
    formik.setFieldTouched("banner_desc", false);
    formik.setFieldTouched("banner_url", false);
  };

  return (
    <>
      <form>
        <div className="flex mb-3 border-b p-2 justify-between items-center">
          <h3 className="font-poppins font-bold">Tambah Banner</h3>
        </div>

        <TextInput
          label="Judul"
          type="text"
          name="banner_title"
          value={formik.values.banner_title}
          onChange={formik.handleChange}
          maxWidth="lg"
          error={formik.errors.banner_title}
        />
        <Jarak />
        <TextInput
          label="Url"
          type="text"
          name="banner_url"
          value={formik.values.banner_url}
          onChange={formik.handleChange}
          maxWidth="lg"
          error={formik.errors.banner_url}
        />
        <Jarak />
        <AreaInput
          label="Deskripsi"
          name="banner_desc"
          value={formik.values.banner_desc}
          onChange={formik.handleChange}
          error={formik.errors.banner_desc}
        />
        <Jarak />

        <Jarak />
        <FileInput
          label="Gambar Banner"
          name="banner_image"
          onChange={(e) => selectImage(e)}
          maxWidth="lg"
          inputRef={fileInputRef}
          error={formik.errors.banner_image}
        />
      </form>
      <Jarak />

      {imgPreview && (
        <div className="flex flex-col max-w-[100px]">
          <Image
            src={imgPreview}
            alt="product-image"
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

      <hr />

      <div className="sticky bottom-0 w-full bg-slate-50 shadow-lg p-5 z-20">
        <div className="flex justify-end">
          <BtnSubmit
            type="submit"
            label="Simpan Banner"
            onClick={formik.handleSubmit}
            loading={mutation.isPending ? true : false}
          />
        </div>
      </div>
    </>
  );
};

export default withAuth(AddBanner, { roles: ["admin"] });
