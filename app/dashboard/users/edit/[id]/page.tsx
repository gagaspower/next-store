"use client";

import { getUserById, updateUser } from "@/lib/users";
import { BtnSubmit } from "@/components/application-ui/Button";

import { Jarak } from "@/components/application-ui/Spacing";
import SpinLoading from "@/components/application-ui/Spinner";

import { useToastAlert } from "@/components/application-ui/Toast";

import { roles } from "@/hook/useRole";
import { TUser } from "@/interface/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import withAuth from "@/context/withAuth";
const SelectInput = dynamic(
  () => import("@/components/application-ui/form/SelectInput")
);

const TextInput = dynamic(
  () => import("@/components/application-ui/form/TextInput")
);

const EditUser = () => {
  const param = useParams<{ id: string }>();
  const currentId: number = parseInt(param.id) as number;

  const { toastSuccess, toastError } = useToastAlert();

  /** initialstate for formik */
  const initialValues: Pick<
    TUser,
    "id" | "name" | "email" | "roles" | "password"
  > = {
    id: 0,
    name: "",
    email: "",
    roles: "",
    password: "",
  };

  const schema = Yup.object({
    name: Yup.string().required("Nama User wajib diisi"),
    email: Yup.string()
      .email("Email tidak benar")
      .required("Email wajib diisi"),
    roles: Yup.mixed()
      .defined("Role wajib dipilih")
      .oneOf(["user", "admin"] as const, "Role wajib dipilih"),
    password: Yup.string()
      .nullable()
      .test({
        name: "is-password",
        test(value, ctx) {
          if (!value) {
            return true;
          }
          if (value.length < 6) {
            return ctx.createError({
              message: "Minimal panjang password 6 karakter",
            });
          }
          if (value.length > 8) {
            return ctx.createError({
              message: "Maksimal panjang password 8 karakter",
            });
          }
          if (value && !value.match(/^[a-zA-Z0-9]+$/)) {
            return ctx.createError({
              message:
                "Password hanya diizinkan dengan kombinasi huruf dan atau angka ( tanpa spasi )",
            });
          }
          return true;
        },
      }),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: () => {
      mutation.mutate();
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      // proses save
      const { id, name, email, roles, password } = formik.values;
      await updateUser({ id, name, email, roles, password });
    },
    onSuccess: () => {
      toastSuccess("Data berhasil disimpan");
      formik.setErrors({});
    },
    onError: (err: any) => {
      toastError(err);
    },
  });

  const { data: currentUser, isPending } = useQuery({
    queryKey: ["getUserById", currentId],
    queryFn: () => getUserById({ id: currentId }),
  });

  useEffect(() => {
    if (currentUser) {
      formik.setValues({
        ...formik.values,
        id: currentUser?.id,
        name: currentUser.name,
        email: currentUser.email,
        roles: currentUser.roles,
      });
    }
  }, [currentUser]);

  return (
    <>
      {isPending ? (
        <SpinLoading />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div className="flex mb-3 border-b p-2 justify-between items-center">
            <h3 className="font-poppins font-bold">Tambah User</h3>
            <BtnSubmit
              label="Simpan"
              loading={mutation.isPending ? true : false}
            />
          </div>
          <TextInput
            label="Nama"
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.errors.name}
          />
          <Jarak />
          <TextInput
            label="Email"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.errors.email}
          />

          <Jarak />
          <SelectInput
            label="Roles"
            value={formik.values.roles}
            name="roles"
            onChangeInput={formik.handleChange}
            error={formik.errors.roles}
          >
            {roles?.map((role) => {
              return (
                <option value={role} key={role}>
                  {role}
                </option>
              );
            })}
          </SelectInput>
          <Jarak />
          <TextInput
            label="Password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.errors.password}
          />
        </form>
      )}
    </>
  );
};

export default withAuth(EditUser, { roles: ["admin"] });
