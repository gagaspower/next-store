"use client";
import withWebStore from "@/context/withWebStore";
import { numberWithCommas } from "@/utils/func";
import { instance } from "@/utils/httpClient";
import { useParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

function Transaction() {
  const params = useParams<{ code: string }>();
  const { code } = params;

  const [currentOrder, setCurrentOrder] = useState<any>({});

  useEffect(() => {
    const getOrderDetail = async () => {
      try {
        const response = await instance.get(`/order/detail/${code}`);
        setCurrentOrder(response?.data?.data);
      } catch (error) {
        console.log("Error getting current order : ", error);
      }
    };

    getOrderDetail();
  }, [code]);

  console.log(currentOrder);

  return (
    <Suspense fallback={<span>Loading...</span>}>
      <div
        className="t w-full md:max-w-6xl m-auto mt-5 mb-5 bg-white p-5 min-h-screen"
        id="report"
      >
        <div className="w-full overflow-x-auto">
          <div>
            <div className="flex justify-center items-center mb-5">
              <h1 className="font-bold text-lg">INVOICE</h1>
            </div>
            <div className="flex flex-col lg:flex-row justify-between border-b border-gray-300 mb-5 gap-4">
              <div className="">
                <h1 className="text-md font-bold">
                  {currentOrder?.user?.name}
                </h1>
                <h3 className="text-xs">
                  {currentOrder?.user?.address[0]?.address}
                </h3>
                <span className="text-xs italic">
                  {currentOrder?.user?.address[0].provinsi.province_name} -{" "}
                  {currentOrder?.user?.address[0].kota.city_name} -
                  {currentOrder?.user?.address[0]?.user_address_kodepos}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold italic">#{code}</span>
                <span>Status : {currentOrder?.order_status}</span>
              </div>
            </div>
          </div>
          <table
            className="w-full text-left border border-collapse rounded sm:border-separate border-slate-200"
            cellSpacing="0"
          >
            <thead>
              <tr>
                <th className="h-12 px-6 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100">
                  Item
                </th>
                <th className="h-12 px-6 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100">
                  Qty
                </th>
                <th className="h-12 px-6 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100">
                  Harga
                </th>
                <th className="h-12 px-6 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOrder &&
                currentOrder?.orders_detail?.map(
                  (detail: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                          {detail.product.product_name}
                          {detail.product_variant_id ? (
                            <>
                              <br />
                              <span className="text-xs italic">
                                <strong>Variasi : </strong>{" "}
                                {detail?.product_variants?.product_varian_name}
                              </span>
                            </>
                          ) : null}
                        </td>
                        <td className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                          {detail.product_qty}
                        </td>

                        <td className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                          Rp. {numberWithCommas(Number(detail?.product_price))}
                        </td>
                        <td className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                          Rp.
                          {numberWithCommas(
                            parseInt(detail?.product_qty) *
                              parseInt(detail?.product_price)
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
            </tbody>
            <tfoot>
              <tr>
                <td
                  className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700"
                  colSpan={2}
                ></td>
                <td className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700 ">
                  Total Berat
                </td>
                <td className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700 ">
                  {currentOrder?.order_total_weight} gr
                </td>
              </tr>
              <tr>
                <td
                  className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700"
                  colSpan={2}
                ></td>
                <td className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700 ">
                  Biaya pengiriman
                </td>
                <td className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700 ">
                  Rp.
                  {numberWithCommas(
                    parseInt(currentOrder?.expedisi?.expedition_price)
                  )}
                </td>
              </tr>
              <tr>
                <td
                  className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700"
                  colSpan={2}
                ></td>
                <td className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700 ">
                  Total
                </td>
                <td className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700 ">
                  Rp. {numberWithCommas(parseInt(currentOrder?.order_amount))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="mt-5">
          <h3 className="font-bold text-md italic">Catatan</h3>
          <div className="border border-red-500 rounded-sm p-2 bg-red-100 max-w-lg">
            {currentOrder?.order_status === "wait for payment" ? (
              <>
                <p className="text-xs">
                  - Segera lakukan pembayaran ke bank tujuan sesuai dengan
                  jumlah tertera
                </p>
                <p className="text-xs">
                  - Rekening virtual bank tujuan{" "}
                  <strong>
                    VA {currentOrder?.payment_bank?.order_bank.toUpperCase()}
                  </strong>
                </p>
                <p className="text-xs">
                  - Nomor virtual bank :{" "}
                  <strong>
                    {currentOrder?.payment_bank?.payment_va_numbers}
                  </strong>
                </p>
                <p className="text-xs">
                  - Jumlah yang harus di bayar :{" "}
                  <strong>
                    Rp. {numberWithCommas(currentOrder?.order_amount)}
                  </strong>
                </p>
                <p className="text-xs">
                  - Pembayaran akan di cek otomatis oleh sistem.
                </p>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default withWebStore(Transaction);
