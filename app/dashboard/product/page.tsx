"use client";
import { deleteProduct, findAllProduct } from "@/lib/product";

import { useToastAlert } from "@/components/application-ui/Toast";
import withAuth from "@/context/withAuth";
import { TProduct, TProductData } from "@/interface/product";
import { numberWithCommas } from "@/utils/func";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { BsFillPencilFill, BsFillTrash3Fill, BsPlus } from "react-icons/bs";
import dynamic from "next/dynamic";

const Tables = dynamic(() => import("@/components/application-ui/Tables"));
const Modal = dynamic(() => import("@/components/application-ui/Modal"));
const SpinLoading = dynamic(
  () => import("@/components/application-ui/Spinner")
);
function Product() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToastAlert();
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const { isPending, data } = useQuery<TProductData>({
    queryKey: ["fetch-all-product", page],
    queryFn: async () => await findAllProduct({ page }),
  });

  const columns = useMemo(
    () => [
      {
        label: "Sku",
        key: "product_sku",
      },
      {
        label: "Nama Produk",
        key: "product_name",
      },
      {
        label: "Stok",
        key: "product_stock",
      },
      {
        label: "Harga",
        key: "product_price",
        formatter: (item: TProduct) => {
          return numberWithCommas(item?.product_price);
        },
      },
      {
        label: "Varian Produk",
        key: "varian",
        formatter: (item: TProduct) => {
          return (
            <>
              {item?.variants?.length > 0 ? (
                <div className="inline-flex items-center justify-center gap-1 rounded bg-emerald-500 px-1.5 text-xs text-white">
                  Available
                </div>
              ) : (
                <div className="inline-flex items-center justify-center gap-1 rounded bg-pink-400 px-1.5 text-xs text-white">
                  Unavailable
                </div>
              )}
            </>
          );
        },
      },
      {
        label: "Aksi",
        key: "aksi",
        formatter: (item: TProduct) => {
          return (
            <div className="flex flex-row gap-1">
              <Link
                href={`/dashboard/product/edit/${item.id}`}
                className="border border-gray-300 rounded-md p-2 hover:bg-gray-200"
              >
                <span className="text-gray-500">
                  <BsFillPencilFill />
                </span>
              </Link>

              <button
                type="button"
                className="border border-gray-300 rounded-md p-2 hover:bg-gray-200"
                onClick={() => handleModalConfirm(item)}
              >
                <span className="text-gray-500">
                  <BsFillTrash3Fill />
                </span>
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrev = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleModalConfirm = (row: TProduct) => {
    const id: number = row.id as number;
    setModalConfirm(!modalConfirm);
    setSelectedId(id);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const id: number = selectedId as number;
      await deleteProduct({ id });
    },
    onSuccess: () => {
      toastSuccess("Data berhasil dihapus");
      setModalConfirm(!modalConfirm);
      queryClient.invalidateQueries({ queryKey: ["fetch-all-product"] });
    },
    onError: (err: any) => {
      setModalConfirm(!modalConfirm);
      toastError(err?.message);
    },
  });

  return (
    <>
      <div className="flex mb-3">
        <button
          type="button"
          className="bg-gray-200 rounded-md flex p-2 group hover:bg-gray-300"
          onClick={() => router.push("/dashboard/product/add")}
        >
          <span className="flex flex-row text-sm text-gray-500 items-center group-hover:text-gray-600">
            <BsPlus size={22} /> Add Product
          </span>
        </button>
      </div>
      {isPending ? (
        <SpinLoading />
      ) : (
        <Tables
          data={data?.data?.data}
          pagination={true}
          columns={columns}
          current_page={data?.data?.current_page}
          per_page={data?.data?.per_page}
          total_data={data?.data?.total}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      )}

      {/* modal konfirm */}
      <Modal
        isOpen={modalConfirm}
        title="Hapus data?"
        handleClose={() => setModalConfirm(false)}
      >
        <div>
          <p>Data tidak bisa dikembalikan.</p>
          <hr />
          <div className="flex flex-row justify-end gap-3 my-3">
            <button
              type="button"
              className="btn flex bg-blue-500 rounded-md hover:bg-blue-400"
              onClick={() => mutation.mutate()}
            >
              <span className="text-white text-sm items-center font-normal">
                Ya, Hapus
              </span>
            </button>

            <button
              type="button"
              className="btn bg-gray-300 rounded-md"
              onClick={() => setModalConfirm(false)}
            >
              <span className="text-sm font-normal">Batal</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* end: modal konfirm */}
    </>
  );
}

export default withAuth(Product, { roles: ["admin"] });
