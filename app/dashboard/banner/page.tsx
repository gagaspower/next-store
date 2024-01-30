"use client";
import { deleteBanner, getAllBanner } from "@/lib/banner";
import { useToastAlert } from "@/components/application-ui/Toast";
import withAuth from "@/context/withAuth";
import { IBannerData, TBanner } from "@/interface/banner";

import { BANNER_IMAGE_URL } from "@/utils/const";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { BsFillPencilFill, BsFillTrash3Fill, BsPlus } from "react-icons/bs";
import dynamic from "next/dynamic";

const Modal = dynamic(() => import("@/components/application-ui/Modal"));
const SpinLoading = dynamic(
  () => import("@/components/application-ui/Spinner")
);
const Tables = dynamic(() => import("@/components/application-ui/Tables"));

function Banner() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToastAlert();
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const { isPending, data } = useQuery<IBannerData>({
    queryKey: ["banner"],
    queryFn: async () => await getAllBanner(),
  });

  const columns = useMemo(
    () => [
      {
        label: "Judul",
        key: "banner_title",
      },
      {
        label: "Banner URL",
        key: "banner_url",
      },
      {
        label: "Banner",
        key: "banner_image",
        formatter: (item: TBanner) => {
          return (
            <>
              <Image
                src={`${BANNER_IMAGE_URL}/${item.banner_image}`}
                alt={item.banner_title}
                width={100}
                height={100}
                className="w-28 h-24"
              />
            </>
          );
        },
      },
      {
        label: "Aksi",
        key: "aksi",
        formatter: (item: TBanner) => {
          return (
            <div className="flex flex-row gap-1">
              <Link
                href={`/dashboard/banner/edit/${item.id}`}
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

  const handleModalConfirm = (row: TBanner) => {
    const id: number = row.id as number;
    setModalConfirm(!modalConfirm);
    setSelectedId(id);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const id: number = selectedId as number;
      await deleteBanner({ id });
    },
    onSuccess: () => {
      toastSuccess("Data berhasil dihapus");
      setModalConfirm(!modalConfirm);
      queryClient.invalidateQueries({ queryKey: ["banner"] });
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
          onClick={() => router.push("/dashboard/banner/add")}
        >
          <span className="flex flex-row text-sm text-gray-500 items-center group-hover:text-gray-600">
            <BsPlus size={22} /> Add Banner
          </span>
        </button>
      </div>
      {isPending ? (
        <SpinLoading />
      ) : (
        <Tables data={data?.data} pagination={false} columns={columns} />
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

export default withAuth(Banner, { roles: ["admin"] });
