"use client";
import SpinLoading from "@/components/application-ui/Spinner";
import Tables from "@/components/application-ui/Tables";
import { ICurrentOrder, useOrder } from "@/hook/useOrders";
import { numberWithCommas } from "@/utils/func";
import Link from "next/link";
import React, { useMemo } from "react";
import { BsEye } from "react-icons/bs";

type TColumns = {
  label: string;
  key: string;
  formatter?: (item: ICurrentOrder) => any;
};

function OrderHistory() {
  const { page, setPage, search, setSearch, isLoadingOrder, data } = useOrder();

  const columns: TColumns[] = useMemo(
    () => [
      {
        label: "No. Invoice",
        key: "order_code",
      },
      {
        label: "Tgl. Order",
        key: "order_date",
      },
      {
        label: "Nilai order",
        key: "order_amount",
        formatter: (item: ICurrentOrder) => {
          return "Rp. " + numberWithCommas(item.order_amount);
        },
      },
      {
        label: "Status Order",
        key: "order_status",
      },
      {
        label: "Action",
        key: "action",
        formatter: (item: ICurrentOrder) => {
          return (
            <div>
              <Link href={`/invoice/${item.order_code}`}>
                <span className="flex items-center gap-1 text-sm text-emerald-500">
                  <BsEye size={15} /> Detail
                </span>
              </Link>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      {isLoadingOrder ? (
        <SpinLoading />
      ) : (
        <Tables data={data.data} pagination={false} columns={columns} />
      )}
    </>
  );
}

export default OrderHistory;
