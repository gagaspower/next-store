"use client";
import {
  addCategory,
  deleteCategory,
  findAllCategory,
  getCategoryById,
} from "@/app/api/category";
import {
  BtnAdd,
  BtnCancel,
  BtnConfirm,
  BtnDelete,
  BtnEdit,
  BtnSubmit,
} from "@/app/component/application-ui/Button";
import ContentWrapper from "@/app/component/application-ui/ContentWrapper";
import Modal from "@/app/component/application-ui/Modal";
import { Jarak } from "@/app/component/application-ui/Spacing";
import SpinLoading from "@/app/component/application-ui/Spinner";
import Tables from "@/app/component/application-ui/Tables";
import { useToastAlert } from "@/app/component/application-ui/Toast";
import TextInput from "@/app/component/application-ui/form/TextInput";
import { TCategory, TCategoryData } from "@/app/interface/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

const Category = () => {
  const { toastSuccess, toastError } = useToastAlert();
  const [modalType, setModalType] = useState<string>("Tambah");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);
  const [getId, setGetId] = useState<number>(0);

  const queryClient = useQueryClient();

  const { data: categories, isPending } = useQuery<TCategoryData>({
    queryKey: ["fetch-category"],
    queryFn: async () => await findAllCategory(),
  });

  const { data: detailCategory, isPending: isLoadingDetail } = useQuery({
    queryKey: ["detail-Category", getId],
    queryFn: async () => await getCategoryById({ id: getId }),
  });

  const columns = useMemo(
    () => [
      {
        label: "Kategori",
        key: "categoryName",
      },
      {
        label: "Slug",
        key: "categorySlug",
      },
      {
        label: "Aksi",
        key: "aksi",
        formatter: (item: TCategory) => {
          return (
            <div className="flex flex-row gap-1">
              <BtnEdit onClick={() => handleModalEdit(Number(item?.id))} />
              <BtnDelete onClick={() => handleModalConfirm(Number(item?.id))} />
            </div>
          );
        },
      },
    ],
    []
  );

  const initialValue: Pick<TCategory, "id" | "categoryName"> = {
    id: 0,
    categoryName: "",
  };

  const schema = Yup.object({
    categoryName: Yup.string().required("Category is required"),
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
      const { id, categoryName } = formik.values;
      await addCategory({
        id: id,
        data: {
          categoryName,
        },
      });
    },
    onSuccess: () => {
      formik.resetForm();
      queryClient.invalidateQueries({ queryKey: ["fetch-category"] });
      setShowModal(!showModal);
      toastSuccess("Data berhasil disimpan");
    },
    onError: (err: any) => {
      toastError(err);
    },
  });

  const remove = useMutation({
    mutationFn: async () => {
      await deleteCategory({
        id: getId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-category"] });
      closeModalConfirm();
      toastSuccess("Data berhasil dihapus");
    },
    onError: (err: any) => {
      toastError(err);
    },
  });

  const handleModalAdd = () => {
    formik.setErrors({});
    setShowModal(!showModal);
  };

  const handleModalEdit = (id: number) => {
    setGetId(id);
    setModalType("Edit");
    setShowModal(true);
  };

  const handleModalHide = () => {
    formik.resetForm();
    formik.setErrors({});
    setShowModal(false);
    setGetId(0);
  };

  const handleModalConfirm = (id: number) => {
    setGetId(id);
    setModalConfirm(true);
  };

  const closeModalConfirm = () => {
    setGetId(0);
    setModalConfirm(false);
  };

  useEffect(() => {
    if (detailCategory) {
      formik.setValues({
        ...formik.values,
        id: detailCategory?.id,
        categoryName: detailCategory?.categoryName,
      });
    }
  }, [detailCategory]);

  return (
    <ContentWrapper>
      <div className="flex flex-row justify-between mb-3 items-center">
        <h1 className="font-bold">Kategori Produk</h1>
        <BtnAdd label="Tambah Kategori" onClick={handleModalAdd} />
      </div>

      {isPending ? (
        <SpinLoading />
      ) : (
        <Tables data={categories?.res} columns={columns} />
      )}

      {/* modal */}
      <Modal
        isOpen={showModal}
        title={`${modalType} Category`}
        handleClose={handleModalHide}
      >
        {isLoadingDetail ? (
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
              name="categoryName"
              value={formik.values.categoryName}
              onChange={formik.handleChange}
              error={formik.errors.categoryName}
            />
            <Jarak />
            <div className="flex flex-row gap-2 items-center">
              <BtnSubmit
                label="Simpan"
                loading={mutation.isPending ? true : false}
              />
              <BtnCancel label="Batal" onClick={handleModalHide} />
            </div>
          </form>
        )}
      </Modal>
      {/* end: modal */}

      {/* modal confirm delete */}
      {/* modal konfirm */}
      <Modal
        isOpen={modalConfirm}
        title="Hapus data?"
        handleClose={closeModalConfirm}
      >
        <>
          <p>Data tidak bisa dikembalikan.</p>

          <div className="flex flex-row justify-end gap-3 my-3">
            <BtnConfirm label="Ya, Hapus" onClick={() => remove.mutate()} />

            <BtnCancel label="Batal" onClick={closeModalConfirm} />
          </div>
        </>
      </Modal>

      {/* end: modal konfirm */}

      {/* end: modal confirm delete */}
    </ContentWrapper>
  );
};

export default Category;
