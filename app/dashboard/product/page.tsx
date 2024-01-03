"use client";
import { deleteProduct, findAllProduct } from "@/app/api/product";
import ContentWrapper from "@/app/component/application-ui/ContentWrapper";
import Modal from "@/app/component/application-ui/Modal";
import SpinLoading from "@/app/component/application-ui/Spinner";
import Tables from "@/app/component/application-ui/Tables";
import { useToastAlert } from "@/app/component/application-ui/Toast";
import { ProductData, TProduct } from "@/app/interface/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { BsFillPencilFill, BsFillTrash3Fill, BsPlus } from "react-icons/bs";

function Product() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToastAlert();
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const { isPending, data } = useQuery<TProduct>({
    queryKey: ["fetch-all-product", page],
    queryFn: async () => await findAllProduct({ page }),
  });

  const columns = useMemo(
    () => [
      {
        label: "SKU",
        key: "productSku",
      },
      {
        label: "Nama Produk",
        key: "productName",
      },
      {
        label: "Aksi",
        key: "aksi",
        formatter: (item: ProductData) => {
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
              {/* <button
                type="button"
                className="border border-gray-300 rounded-md p-2 hover:bg-gray-200"
                onClick={() => console.log(item)}
              ></button> */}
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

  const handleModalConfirm = (row: ProductData) => {
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
    <ContentWrapper>
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
          data={data?.res?.result?.data}
          meta={data?.res?.result?.meta}
          columns={columns}
          page={page}
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
    </ContentWrapper>
  );
}

export default Product;
