"use client";

import { createUser } from "@/app/api/users";
import { BtnSubmit } from "@/app/component/application-ui/Button";
import ContentWrapper from "@/app/component/application-ui/ContentWrapper";

import { Jarak } from "@/app/component/application-ui/Spacing";

import { useToastAlert } from "@/app/component/application-ui/Toast";

import SelectInput from "@/app/component/application-ui/form/SelectInput";
import TextInput from "@/app/component/application-ui/form/TextInput";

import { roles } from "@/app/hook/useRole";
import { TUser } from "@/app/interface/user";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

const AddUser = () => {
  const { toastSuccess, toastError } = useToastAlert();

  /** initialstate for formik */
  const initialValues: Pick<TUser, "name" | "email" | "roles" | "password"> = {
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
    password: Yup.string().test({
      name: "is-password",
      test(value, ctx) {
        if (!value) {
          return ctx.createError({ message: "Password wajib diisi" });
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
      const { name, email, roles, password } = formik.values;
      await createUser({ name, email, roles, password });
    },
    onSuccess: () => {
      toastSuccess("Data berhasil disimpan");
      formik.resetForm();
      formik.setErrors({});
    },
    onError: (err: any) => {
      toastError(err);
    },
  });

  return (
    <ContentWrapper>
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
          maxWidth="lg"
          error={formik.errors.name}
        />
        <Jarak />
        <TextInput
          label="Email"
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          maxWidth="lg"
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
          maxWidth="lg"
          error={formik.errors.password}
        />
      </form>
    </ContentWrapper>
  );
};

export default AddUser;
