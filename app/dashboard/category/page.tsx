"use client";
import { deleteCategory, findAllCategory } from "@/lib/category";
import { DefaultImageStore } from "@/asset/img";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToastAlert } from "@/components/application-ui/Toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TCategory, TCategoryData } from "@/interface/category";
import { CATEGORY_IMAGE_URL } from "@/utils/const";

import {
  BtnAdd,
  BtnCancel,
  BtnConfirm,
  BtnDelete,
  BtnEdit,
} from "@/components/application-ui/Button";
import withAuth from "@/context/withAuth";

const Modal = dynamic(() => import("@/components/application-ui/Modal"));
const SpinLoading = dynamic(
  () => import("@/components/application-ui/Spinner")
);
const Tables = dynamic(() => import("@/components/application-ui/Tables"));
const Category = () => {
  const { toastSuccess, toastError } = useToastAlert();
  const router = useRouter();
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);
  const [getId, setGetId] = useState<number>(0);

  const queryClient = useQueryClient();

  const { data: categories, isPending } = useQuery<TCategoryData>({
    queryKey: ["fetch-category"],
    queryFn: async () => await findAllCategory(),
  });

  const columns = useMemo(
    () => [
      {
        label: "Kategori",
        key: "category_name",
      },
      {
        label: "Slug",
        key: "category_slug",
      },
      {
        label: "Logo",
        key: "category_image",
        formatter: (item: TCategory) => {
          let ImageForCategory: any = DefaultImageStore;
          if (item.category_image) {
            ImageForCategory = CATEGORY_IMAGE_URL + "/" + item.category_image;
          }
          return (
            <Image
              src={ImageForCategory}
              width={75}
              height={75}
              alt={item.category_name}
            />
          );
        },
      },
      {
        label: "Aksi",
        key: "aksi",
        formatter: (item: TCategory) => {
          return (
            <div className="flex flex-row gap-1">
              <BtnEdit
                onClick={() =>
                  router.push(`/dashboard/category/edit/${item.id}`)
                }
              />
              <BtnDelete onClick={() => handleModalConfirm(Number(item?.id))} />
            </div>
          );
        },
      },
    ],
    []
  );

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

  const handleModalConfirm = (id: number) => {
    setGetId(id);
    setModalConfirm(true);
  };

  const closeModalConfirm = () => {
    setGetId(0);
    setModalConfirm(false);
  };

  return (
    <>
      <div className="flex flex-row justify-between mb-3 items-center">
        <h1 className="font-bold">Kategori Produk</h1>
        <BtnAdd
          label="Tambah Kategori"
          onClick={() => router.push(`/dashboard/category/add`)}
        />
      </div>

      {/* {isPending ? (
        <SpinLoading />
      ) : ( */}
      <Tables data={categories?.data} columns={columns} pagination={false} />
      {/* )} */}

      {/* modal confirm delete */}
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
    </>
  );
};

export default withAuth(Category, { roles: ["admin"] });
