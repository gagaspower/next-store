"use client";
import { findAllCategory } from "@/app/api/category";
import { createProduct } from "@/app/api/product";
import {
  BtnAdd,
  BtnDelete,
  BtnEdit,
  BtnSubmit,
} from "@/app/component/application-ui/Button";
import ContentWrapper from "@/app/component/application-ui/ContentWrapper";
import Modal from "@/app/component/application-ui/Modal";
import { Jarak } from "@/app/component/application-ui/Spacing";
import TableBasic from "@/app/component/application-ui/TableBasic";
import { useToastAlert } from "@/app/component/application-ui/Toast";
import FileInput from "@/app/component/application-ui/form/FileInput";
import SelectInput from "@/app/component/application-ui/form/SelectInput";
import TextInput from "@/app/component/application-ui/form/TextInput";
import TinyMce from "@/app/component/application-ui/form/TinyMce";
import { TCategoryData } from "@/app/interface/category";
import { ProductData } from "@/app/interface/product";
import { MAX_FILE_SIZE, isValidFileType } from "@/app/utils/imageValidate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import * as Yup from "yup";

type TVariants = {
  variant: string;
  variantStock: number;
  variantPrice: number;
};

const AddProduct = () => {
  const { toastSuccess, toastError } = useToastAlert();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [variants, setVariants] = useState<TVariants[]>([]);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [varianForm, setFarianForm] = useState<TVariants>({
    variant: "",
    variantStock: 0,
    variantPrice: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories } = useQuery<TCategoryData>({
    queryKey: ["fetch-category"],
    queryFn: async () => await findAllCategory(),
  });

  const variantColumns = useMemo(
    () => [
      {
        label: "Varian",
        key: "variant",
      },
      {
        label: "Stok",
        key: "variantStock",
      },
      {
        label: "Harga",
        key: "variantPrice",
      },
      {
        label: "Tindakan",
        key: "action",
        formatter: (row: any) => {
          return (
            <div className="flex fle-row gap-2">
              <BtnEdit onClick={() => editVariant(row)} />
              <BtnDelete onClick={() => handleDeleteVarian(row)} />
            </div>
          );
        },
      },
    ],
    []
  );

  const editVariant = (row: any) => {
    setFarianForm({
      ...varianForm,
      variant: row.variant,
      variantStock: row.variantStock,
      variantPrice: row.variantPrice,
    });
    setModalOpen(!modalOpen);
  };

  /** initialstate for formik */
  const initialValues: Pick<
    ProductData,
    | "productSku"
    | "productName"
    | "productDesc"
    | "productCategoryId"
    | "productStock"
    | "productPrice"
    | "productImage"
  > = {
    productSku: "",
    productName: "",
    productDesc: "",
    productCategoryId: 0,
    productStock: 0,
    productPrice: 0,
    productImage: null,
  };

  const schema = Yup.object({
    productSku: Yup.string().required("SKU is required"),
    productName: Yup.string().required("Product Name is required"),
    productDesc: Yup.string(),
    productCategoryId: Yup.number().test({
      name: "category-is-not-0",
      test: function (value) {
        if (!value) {
          return this.createError({
            message: "Category is required",
          });
        }
        if (value && value === 0) {
          return this.createError({
            message: "Category is required",
          });
        }
        return true;
      },
    }),
    productStock: Yup.number()
      .min(0, "Product stock cannot be 0 or minus")
      .test({
        name: "required-if-no-variants",
        test: function (value) {
          if ((!variants || variants.length === 0) && !value) {
            return this.createError({
              message: "Product Stock is required when Variants is empty",
            });
          }
          return true;
        },
      }),
    productPrice: Yup.number()
      .min(0, "Product price cannot be 0 or minus")
      .test({
        name: "required-if-no-variants",
        test: function (value) {
          if ((!variants || variants.length === 0) && !value) {
            return this.createError({
              message: "Product Price is required when Variants is empty",
            });
          }
          return true;
        },
      }),
    productImage: Yup.mixed()
      .required("Image is required")
      .test("is-valid-type", "Not a valid image type", (value) =>
        isValidFileType(value && (value as File)?.name.toLowerCase(), "image")
      )
      .test(
        "is-valid-size",
        "Max allowed size is 2MB",
        (value) => value && (value as File)?.size <= MAX_FILE_SIZE
      ),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: () => {
      mutation.mutate();
    },
  });

  const handleAddVarian = () => {
    const existingItemIndex = variants.findIndex(
      (item) => item.variant === varianForm.variant
    );

    if (existingItemIndex !== -1) {
      // Jika nama sudah ada, lakukan update pada data alamat
      const updatedArray = [...variants];
      updatedArray[existingItemIndex].variantStock = varianForm.variantStock;
      updatedArray[existingItemIndex].variantPrice = varianForm.variantPrice;
      setVariants(updatedArray);
    } else {
      // Jika nama belum ada, buat entri baru dalam array
      setVariants((prevVariants: any) => [
        ...prevVariants,
        {
          variant: varianForm.variant,
          variantStock: varianForm.variantStock,
          variantPrice: varianForm.variantPrice,
        },
      ]);

      // Reset form setelah menambahkan varian
      setFarianForm({
        variant: "",
        variantStock: 0,
        variantPrice: 0,
      });
      setModalOpen(false);
    }
  };

  const handleDeleteVarian = (val: any) => {
    setVariants((prevVariants) =>
      prevVariants.filter((item) => item.variant !== val.variant)
    );
  };

  const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? event.target.files[0] : null;
    formik.setFieldValue("productImage", selectedFiles);
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
    formik.setFieldValue("productImage", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      await createProduct({
        data: formik.values,
        variants,
      });
    },
    onSuccess: () => {
      toastSuccess("Data berhasil disimpan");

      handleResetError();
      handleResetForm();
      handleRemoveImge();
      setVariants([]);
    },
    onError: (err: any) => {
      toastError(err?.message);
    },
  });

  const handleResetForm = () => {
    formik.setValues({
      ...formik.values,
      productDesc: "",
      productSku: "",
      productName: "",
      productCategoryId: 0,
      productStock: 0,
      productPrice: 0,
      productImage: null,
    });
  };

  const handleResetError = () => {
    formik.setFieldError("productDesc", "");
    formik.setFieldError("productSku", "");
    formik.setFieldError("productName", "");
    formik.setFieldError("productCategoryId", "");
    formik.setFieldError("productStock", "");
    formik.setFieldError("productPrice", "");
    formik.setFieldError("productImage", "");

    formik.setFieldTouched("productImage", false);
    formik.setFieldTouched("productDesc", false);
    formik.setFieldTouched("productSku", false);
    formik.setFieldTouched("productName", false);
    formik.setFieldTouched("productCategoryId", false);
    formik.setFieldTouched("productStock", false);
    formik.setFieldTouched("productPrice", false);
  };
  return (
    <ContentWrapper>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex mb-3 border-b p-2 justify-between items-center">
          <h3 className="font-poppins font-bold">Tambah Produk</h3>
          <BtnSubmit
            label="Simpan"
            loading={mutation.isPending ? true : false}
          />
        </div>
        <TextInput
          label="SKU"
          type="text"
          name="productSku"
          value={formik.values.productSku}
          onChange={formik.handleChange}
          maxWidth="md"
          error={formik.errors.productSku}
        />
        <Jarak />
        <TextInput
          label="Nama Produk"
          type="text"
          name="productName"
          value={formik.values.productName}
          onChange={formik.handleChange}
          maxWidth="md"
          error={formik.errors.productName}
        />

        <Jarak />
        <SelectInput
          label="Kategori"
          value={formik.values.productCategoryId}
          name="productCategoryId"
          onChangeInput={formik.handleChange}
          error={formik.errors.productCategoryId}
        >
          {categories?.res?.map((category, index) => {
            return (
              <option value={category.id} key={index}>
                {category.categoryName}
              </option>
            );
          })}
        </SelectInput>
        <Jarak />
        <TinyMce
          label="Deskripsi produk"
          classes="lg:max-w-3xl"
          value={formik.values.productDesc}
          onChange={(e) => formik.setFieldValue("productDesc", e)}
        />
        <Jarak />
        <FileInput
          label="Gambar Produk"
          name="productImage"
          onChange={(e) => selectImage(e)}
          maxWidth="md"
          inputRef={fileInputRef}
          error={formik.errors.productImage}
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
      {variants.length < 1 ? (
        <>
          <Jarak />
          <TextInput
            label="Stok Produk"
            type="number"
            name="productStock"
            value={Number(formik.values.productStock)}
            onChange={formik.handleChange}
            maxWidth="md"
            error={formik.errors.productStock}
          />
          <Jarak />
          <TextInput
            label="Harga Produk"
            type="number"
            name="productPrice"
            value={Number(formik.values.productPrice)}
            onChange={formik.handleChange}
            maxWidth="md"
            error={formik.errors.productPrice}
          />
        </>
      ) : null}

      <Jarak />
      <div className="label">
        <span className="label-text font-poppins text-sm">
          Aktifkan Varian :
        </span>
      </div>

      <div className="mb-2 mt-2">
        <BtnAdd label="Tambah Varian" onClick={() => setModalOpen(true)} />
      </div>

      <Jarak />
      <TableBasic columns={variantColumns} data={variants || []} />
      <Jarak />
      <hr />
      <Jarak />
      <Jarak />
      {/* modal varian */}
      <Modal
        title="Varian Produk"
        handleClose={() => setModalOpen(false)}
        isOpen={modalOpen}
      >
        <TextInput
          label="Varian Produk"
          placeholder="contoh: Hitam - L, atau Hitam, atau L"
          type="text"
          name="variant"
          value={varianForm.variant}
          onChange={(e) =>
            setFarianForm({ ...varianForm, variant: e.target.value })
          }
          maxWidth="md"
        />
        <Jarak />
        <TextInput
          label="Stok Varian"
          type="number"
          name="variantStock"
          value={varianForm.variantStock}
          onChange={(e) =>
            setFarianForm({ ...varianForm, variantStock: +e.target.value })
          }
        />
        <Jarak />
        <TextInput
          label="Harga Varian"
          type="number"
          name="variantPrice"
          value={varianForm.variantPrice}
          onChange={(e) =>
            setFarianForm({ ...varianForm, variantPrice: +e.target.value })
          }
        />
        <Jarak />
        <div>
          <button
            className="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide transition duration-300 rounded focus-visible:outline-none justify-self-center whitespace-nowrap bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none"
            onClick={handleAddVarian}
            type="button"
          >
            <span>Simpan</span>
          </button>
        </div>
      </Modal>
      {/* modal varian */}
    </ContentWrapper>
  );
};

export default AddProduct;
