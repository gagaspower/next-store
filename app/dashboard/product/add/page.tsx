"use client";
import { findAllCategory } from "@/app/api/category";
import { createProduct } from "@/app/api/product";
import { BtnSubmit } from "@/app/component/application-ui/Button";
import ContentWrapper from "@/app/component/application-ui/ContentWrapper";

import { Jarak } from "@/app/component/application-ui/Spacing";
import { useToastAlert } from "@/app/component/application-ui/Toast";
import FileInput from "@/app/component/application-ui/form/FileInput";
import SelectInput from "@/app/component/application-ui/form/SelectInput";
import TextInput from "@/app/component/application-ui/form/TextInput";
import TinyMce from "@/app/component/application-ui/form/TinyMce";
import withAuth from "@/app/hook/withAuth";
import { TCategoryData } from "@/app/interface/category";
import { TProduct } from "@/app/interface/product";

import { MAX_FILE_SIZE, isValidFileType } from "@/app/utils/imageValidate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import * as Yup from "yup";

type ProductAttr = {
  varian_group: string;
  varian_item: string;
};

type VariantStock = {
  product_varian_name: string;
  product_varian_stock: number;
  product_varian_price: number;
  product_varian_sku?: string;
};

const AddProduct = () => {
  const { toastSuccess, toastError } = useToastAlert();
  const [isVariants, setIsVariants] = useState<boolean>(false);
  const [labelAttributeForm, setLabelAttributeForm] =
    useState<string>("Tambah Varian");
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [isVariantStock, setIsVariantStock] = useState<boolean>(false);
  const [variantStock, setVariantStock] = useState<VariantStock[]>([
    {
      product_varian_name: "",
      product_varian_stock: 0,
      product_varian_price: 0,
      product_varian_sku: "",
    },
  ]);
  const [productAttribute, setProductAttribute] = useState<ProductAttr[]>([
    {
      varian_group: "",
      varian_item: "",
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories } = useQuery<TCategoryData>({
    queryKey: ["fetch-category"],
    queryFn: async () => await findAllCategory(),
  });

  /** initialstate for formik */
  const initialValues: Pick<
    TProduct,
    | "product_name"
    | "product_sku"
    | "product_desc"
    | "product_category_id"
    | "product_stock"
    | "product_price"
    | "product_weight"
    | "product_image"
  > = {
    product_name: "",
    product_sku: "",
    product_desc: "",
    product_category_id: 0,
    product_stock: 0,
    product_price: 0,
    product_weight: 0,
    product_image: null,
  };

  const schema = Yup.object({
    product_sku: Yup.string().required("SKU Wajib diisi"),
    product_name: Yup.string().required("Nama produk wajib diisi"),
    product_desc: Yup.string(),
    product_category_id: Yup.number().test({
      name: "category-is-not-0",
      test: function (value) {
        if (!value) {
          return this.createError({
            message: "Kategori wajib dipilih",
          });
        }
        if (value && value === 0) {
          return this.createError({
            message: "Kategori wajib dipilih",
          });
        }
        return true;
      },
    }),
    product_stock: Yup.number()
      .min(0, "Stok tidak boleh minus")
      .test({
        name: "required-if-no-variants",
        test: function (value) {
          if ((!variantStock || variantStock.length === 0) && !value) {
            return this.createError({
              message: "Stok wajib diisi jika tidak ada varian produk",
            });
          }
          return true;
        },
      }),
    product_price: Yup.number()
      .min(0, "Harga produk tidak boleh minus")
      .test({
        name: "required-if-no-variants",
        test: function (value) {
          if ((!variantStock || variantStock.length === 0) && !value) {
            return this.createError({
              message: "Harga wajib diisi jika tidak ada varian produk",
            });
          }
          return true;
        },
      }),
    product_weight: Yup.number()
      .min(0, "Berat item tidak boleh minus")
      .test({
        name: "weight-is-not-0",
        test: function (value) {
          if (!value) {
            return this.createError({
              message: "Berat item wajib diisi, contoh jika 1Kg maka isi 1000",
            });
          }
          if (value && value === 0) {
            return this.createError({
              message: "Berat item wajib diisi, contoh jika 1Kg maka isi 1000",
            });
          }
          return true;
        },
      }),
    product_image: Yup.mixed()
      .required("Gambar produk wajib diisi")
      .test(
        "is-valid-type",
        "Jenis file harus berupa .jpg .png atau .jpeg",
        (value) =>
          isValidFileType(value && (value as File)?.name.toLowerCase(), "image")
      )
      .test(
        "is-valid-size",
        "Maksimal ukuran file 2MB",
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

  const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? event.target.files[0] : null;
    formik.setFieldValue("product_image", selectedFiles);
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
    formik.setFieldValue("product_image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      await createProduct({
        data: formik.values,
        product_varian: productAttribute,
        product_varian_stock: variantStock,
        isVariants: isVariants,
      });
    },
    onSuccess: () => {
      toastSuccess("Data berhasil disimpan");
      handleDeleteAttribute();
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
      product_name: "",
      product_sku: "",
      product_desc: "",
      product_category_id: 0,
      product_stock: 0,
      product_price: 0,
      product_weight: 0,
      product_image: null,
    });
  };

  const handleResetError = () => {
    formik.setFieldError("product_desc", "");
    formik.setFieldError("product_sku", "");
    formik.setFieldError("product_name", "");
    formik.setFieldError("product_category_id", "");
    formik.setFieldError("product_stock", "");
    formik.setFieldError("product_price", "");
    formik.setFieldError("product_image", "");
    formik.setFieldError("product_weight", "");
    formik.setFieldTouched("product_image", false);
    formik.setFieldTouched("product_desc", false);
    formik.setFieldTouched("product_sku", false);
    formik.setFieldTouched("product_name", false);
    formik.setFieldTouched("product_category_id", false);
    formik.setFieldTouched("product_stock", false);
    formik.setFieldTouched("product_price", false);
    formik.setFieldTouched("product_weight", false);
  };

  const transformData = (data: ProductAttr[]) => {
    const result: VariantStock[] = [];

    if (data.length === 1 && data[0]?.varian_item?.length > 0) {
      data[0].varian_item.split("|").forEach((one: any) => {
        result.push({
          product_varian_name: one,
          product_varian_stock: 0,
          product_varian_price: 0,
          product_varian_sku: "",
        });
      });
    }

    if (data.length === 2) {
      if (data[1].varian_group !== "" && data[1].varian_item.length > 0) {
        data[1].varian_item.split("|").forEach((one: any) => {
          data[0].varian_item.split("|").forEach((two: any) => {
            result.push({
              product_varian_name: `${two} | ${one}`,
              product_varian_stock: 0,
              product_varian_price: 0,
              product_varian_sku: "",
            });
          });
        });
      } else if (data[0].varian_item?.length > 0) {
        data[0].varian_item.split("|").forEach((one: any) => {
          result.push({
            product_varian_name: one,
            product_varian_stock: 0,
            product_varian_price: 0,
            product_varian_sku: "",
          });
        });
      }
    }

    setVariantStock(result);
  };

  const handleAddAttribute = () => {
    setIsVariants(true);
    setLabelAttributeForm("Reset");
    setIsVariantStock(false);
    setProductAttribute([{ varian_group: "", varian_item: "" }]);
  };

  const handleDeleteAttribute = () => {
    setIsVariants(false);
    setIsVariantStock(false);
    setLabelAttributeForm("Tambah Varian");
    setProductAttribute([{ varian_group: "", varian_item: "" }]);
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...productAttribute];
    if (event.target.name === "varian_group") {
      values[index].varian_group = event.target.value;
    } else {
      values[index].varian_item = event.target.value;
    }

    setProductAttribute(values);
  };

  const handleAddVariants = () => {
    const values = [...productAttribute];
    values.push({ varian_group: "", varian_item: "" });
    setProductAttribute(values);
  };

  const handleRemoveVariants = (index: number) => {
    const values = [...productAttribute];
    values.splice(index, 1);
    setProductAttribute(values);
  };

  useEffect(() => {
    transformData(productAttribute);
  }, [productAttribute]);

  const handleIsVariantStock = () => {
    setIsVariantStock(!isVariantStock);
  };

  // handle input for stok variant
  const handleInputStokVarian = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...variantStock];
    if (event.target.name === "product_varian_stock") {
      values[index].product_varian_stock = Number(event.target.value);
    }
    if (event.target.name === "product_varian_price") {
      values[index].product_varian_price = Number(event.target.value);
    }
    if (event.target.name === "product_varian_sku") {
      values[index].product_varian_sku = event.target.value;
    }

    setVariantStock(values);
  };

  return (
    <>
      <ContentWrapper>
        <form>
          <div className="flex mb-3 border-b p-2 justify-between items-center">
            <h3 className="font-poppins font-bold">Tambah Produk</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <TextInput
              label="SKU"
              type="text"
              name="product_sku"
              value={formik.values.product_sku}
              onChange={formik.handleChange}
              maxWidth="lg"
              error={formik.errors.product_sku}
            />
            {/* <Jarak /> */}
            <TextInput
              label="Nama Produk"
              type="text"
              name="product_name"
              value={formik.values.product_name}
              onChange={formik.handleChange}
              maxWidth="lg"
              error={formik.errors.product_name}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <TextInput
              label="Stok"
              type="text"
              name="product_stock"
              value={formik.values.product_stock}
              onChange={formik.handleChange}
              maxWidth="lg"
              error={formik.errors.product_stock}
            />
            {/* <Jarak /> */}
            <TextInput
              label="Harga"
              type="text"
              name="product_price"
              value={formik.values.product_price}
              onChange={formik.handleChange}
              maxWidth="lg"
              error={formik.errors.product_price}
            />
          </div>

          <Jarak />
          <div className="flex flex-col md:flex-row gap-2">
            <SelectInput
              label="Kategori"
              value={formik.values.product_category_id}
              name="product_category_id"
              onChangeInput={formik.handleChange}
              error={formik.errors.product_category_id}
            >
              {categories?.data?.map((category, index) => {
                return (
                  <option value={category.id} key={index}>
                    {category.category_name}
                  </option>
                );
              })}
            </SelectInput>

            <TextInput
              label="Berat ( gr )"
              type="number"
              name="product_weight"
              value={Number(formik.values.product_weight)}
              onChange={formik.handleChange}
              maxWidth="lg"
              error={formik.errors.product_weight}
            />
          </div>

          <Jarak />

          <TinyMce
            label="Deskripsi produk"
            classes="lg:max-w-6xl"
            value={formik.values.product_desc}
            onChange={(e) => formik.setFieldValue("product_desc", e)}
          />
          <Jarak />
          <FileInput
            label="Gambar Produk"
            name="product_image"
            onChange={(e) => selectImage(e)}
            maxWidth="lg"
            inputRef={fileInputRef}
            error={formik.errors.product_image}
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
        <Jarak />
        <div className="bg-white shadow-md rounded-md w-full lg:max-w-6xl p-5">
          <div className="flex flex-col lg:flex-row justify-between gap-3">
            <div className="w-full lg:max-w-md">
              <p>Tambahkan varian produk seperti warna dan atau ukuran.</p>
            </div>
            <div className="flex gap-3 items-center">
              {productAttribute[0].varian_group !== "" ? (
                <>
                  <button onClick={handleIsVariantStock}>
                    <span className="text-sm font-poppins text-blue-600 font-normal">
                      Atur stok varian
                    </span>
                  </button>
                  <span>|</span>
                </>
              ) : null}

              <button
                onClick={
                  labelAttributeForm === "Tambah Varian"
                    ? handleAddAttribute
                    : handleDeleteAttribute
                }
              >
                <span className="text-sm font-poppins text-blue-600 font-normal">
                  {labelAttributeForm}
                </span>
              </button>
            </div>
          </div>
          <Jarak />

          {isVariants ? (
            <>
              {productAttribute.map((atribute: any, index: number) => {
                return (
                  <div
                    className="bg-gray-50 p-2 flex flex-col gap-3 rounded-md border border-gray-200 shadow mb-2"
                    key={index}
                  >
                    <div className="flex flex-row items-center gap-3">
                      <TextInput
                        label={
                          productAttribute[index].varian_group !== ""
                            ? productAttribute[index].varian_group
                            : "Group varian 1"
                        }
                        type="text"
                        name="varian_group"
                        value={atribute.varian_group}
                        onChange={(event) => handleInputChange(index, event)}
                        maxWidth="md"
                        placeholder="contoh: Warna"
                      />

                      <TextInput
                        label="Varian Item"
                        type="text"
                        name="varian_item"
                        value={atribute.varian_item}
                        onChange={(event) => handleInputChange(index, event)}
                        maxWidth="lg"
                        placeholder="contoh: Hitam|Putih"
                      />
                      {index !== 0 ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariants(index)}
                        >
                          <span className="text-xs font-poppins italic">
                            Hapus
                          </span>
                        </button>
                      ) : (
                        <>
                          {productAttribute.length === 1 && (
                            <button onClick={handleAddVariants}>
                              <span className="text-xs font-poppins italic">
                                Tambah
                              </span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="bg-red-100 border border-red-500 rounded-md p-2">
                <span className="text-sm italic font-poppins">
                  untuk varian item jika lebih dari satu (1) pisahkan dengan
                  tanda vertical bar (|)
                </span>
              </div>
            </>
          ) : null}

          <Jarak />
          {isVariantStock ? (
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200 shadow mb-2">
              <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                  <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="font-poppins font-bold">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-900">
                          Nama varian
                        </th>
                        <th className="px-4 py-2 text-left text-gray-900">
                          Stok
                        </th>
                        <th className="px-4 py-2 text-left text-gray-900">
                          Harga
                        </th>
                        <th className="px-4 py-2 text-left text-gray-900">
                          Sku
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-poppins">
                      {variantStock.map((v: VariantStock, index: number) => {
                        return (
                          <tr key={index}>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                              {v.product_varian_name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                              <TextInput
                                type="number"
                                name="product_varian_stock"
                                value={v.product_varian_stock}
                                onChange={(event) =>
                                  handleInputStokVarian(index, event)
                                }
                                maxWidth="md"
                              />
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                              <TextInput
                                type="number"
                                name="product_varian_price"
                                value={v.product_varian_price}
                                onChange={(event) =>
                                  handleInputStokVarian(index, event)
                                }
                                maxWidth="md"
                              />
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                              <TextInput
                                type="text"
                                name="product_varian_sku"
                                value={v.product_varian_sku}
                                onChange={(event) =>
                                  handleInputStokVarian(index, event)
                                }
                                maxWidth="md"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <Jarak />
      </ContentWrapper>
      <div className="sticky bottom-0 w-full bg-slate-50 shadow-lg p-5 z-20">
        <div className="flex justify-end">
          <BtnSubmit
            type="submit"
            label="Simpan produk"
            onClick={formik.handleSubmit}
            loading={mutation.isPending ? true : false}
          />
        </div>
      </div>
    </>
  );
};

export default withAuth(AddProduct);
