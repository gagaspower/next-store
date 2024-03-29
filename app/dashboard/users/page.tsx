"use client";
import { deleteUser, findAllUser } from "@/lib/users";
import { useToastAlert } from "@/components/application-ui/Toast";
import { TUser } from "@/interface/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { BsFillPencilFill, BsFillTrash3Fill, BsPlus } from "react-icons/bs";
import dynamic from "next/dynamic";
import withAuth from "@/context/withAuth";

const Modal = dynamic(() => import("@/components/application-ui/Modal"));
const SpinLoading = dynamic(
  () => import("@/components/application-ui/Spinner")
);
const Tables = dynamic(() => import("@/components/application-ui/Tables"));

type TColumns = {
  label: string;
  key: string;
  formatter?: (item: TUser) => void;
};

function UserPage() {
  const router = useRouter();
  const { toastSuccess, toastError } = useToastAlert();
  const queryClient = useQueryClient();
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const [selectedId, setSelectedId] = useState<TUser>({} as TUser);
  const { isPending, data } = useQuery({
    queryKey: ["fetch-all-user", page],
    queryFn: async () => await findAllUser({ page }),
  });

  const columns: TColumns[] = useMemo(
    () => [
      {
        label: "Nama",
        key: "name",
      },
      {
        label: "Email",
        key: "email",
      },
      {
        label: "Role",
        key: "roles",
      },
      {
        label: "Aksi",
        key: "aksi",
        formatter: (item: TUser) => {
          return (
            <div className="flex flex-row gap-1">
              <Link
                href={`/dashboard/users/edit/${item.id}`}
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

  const handleModalConfirm = (row: TUser) => {
    setModalConfirm(!modalConfirm);
    setSelectedId(row);
  };

  const handleCloseModal = () => {
    setModalConfirm(false);
    setSelectedId({} as TUser);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const id: number = Number(selectedId?.id) as number;
      await deleteUser({ id });
    },
    onSuccess: () => {
      toastSuccess("Data berhasil dihapus");
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ["fetch-all-user"] });
    },
    onError: (err: any) => {
      setModalConfirm(!modalConfirm);
      toastError(err);
    },
  });

  return (
    <>
      <div className="flex mb-3">
        <button
          type="button"
          className="bg-gray-200 rounded-md flex p-2 group hover:bg-gray-300"
          onClick={() => router.push("/dashboard/users/add")}
        >
          <span className="flex flex-row text-sm text-gray-500 items-center group-hover:text-gray-600">
            <BsPlus size={22} /> Add User
          </span>
        </button>
      </div>
      {isPending ? (
        <SpinLoading />
      ) : (
        <Tables
          data={data?.data?.data}
          pagination={true}
          current_page={data?.data?.current_page}
          per_page={data?.data?.per_page}
          total_data={data?.data?.total}
          columns={columns}
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
              onClick={handleCloseModal}
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

export default withAuth(UserPage, { roles: ["admin"] });
