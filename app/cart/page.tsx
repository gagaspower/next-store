"use client";

import { BankLogo, Cart, Courier } from "@/asset/img";
import Modal from "@/components/application-ui/Modal";
import { Jarak } from "@/components/application-ui/Spacing";

import SelectInput from "@/components/application-ui/form/SelectInput";
import { useCartContext } from "@/context/cart";
import withWebStore from "@/context/withWebStore";
import { banks, expeditions } from "@/hook/useExpedition";
import { VariantStock } from "@/interface/product";
import { IAddress } from "@/interface/userAddress";
import { numberWithCommas } from "@/utils/func";
import { instance } from "@/utils/httpClient";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

import { BsTrash } from "react-icons/bs";
import { HiPlus, HiMinus } from "react-icons/hi2";

function CartPage() {
  const { cart, setCart } = useCartContext();
  const router = useRouter();
  const [defaultAddress, setDefaultAddress] = useState<any>({});
  const [loadingFetchAddress, setLoadingFetchAddress] =
    useState<boolean>(false);
  const [loadingExp, setLoadingExp] = useState<boolean>(false);
  const [expeditionSelect, setExpeditionSelect] = useState<string>("");
  const [expeditionResult, setExpeditionResult] = useState<any[]>([]);
  const [currentExp, setCurrentExp] = useState<any>(null);
  const [modalCheckExp, setModalCheckExp] = useState<boolean>(false);
  const [modalCheckBank, setModalCheckBank] = useState<boolean>(false);
  const [orderLoading, setOrderLoading] = useState<boolean>(false);
  const [bank, setBank] = useState<string>("");

  const totalWeight: number = cart.reduce((total, item) => {
    return total + item.product.product_weight * item.cart_product_qty;
  }, 0);

  useEffect(() => {
    const getDefaultAddress = async () => {
      setLoadingFetchAddress(true);
      try {
        const response = await instance.get(`/user-address`);

        const data = response?.data?.data.find(
          (a: IAddress) => a.isDefault !== false
        );

        if (Object.keys(data).length !== 0) {
          setDefaultAddress(data);
        }
        setLoadingFetchAddress(false);
      } catch (error) {
        setLoadingFetchAddress(false);
        console.log("Error get Default address : ", error);
      }
    };
    getDefaultAddress();
  }, []);

  const calculateTotal = () => {
    return cart?.reduce((total: number, c: any) => {
      let subtotal: number = 0;

      if (c.cart_product_variant_id) {
        const priceVariants = c.product.variants_stock.find(
          (v: VariantStock) => v.id === +c.cart_product_variant_id
        );
        subtotal = c.cart_product_qty * priceVariants.product_varian_price;
      } else {
        subtotal = c.cart_product_qty * c.product.product_price;
      }

      return total + subtotal;
    }, 0);
  };

  const total = calculateTotal();

  const handleRemoveCart = useCallback((index: number) => {
    const values = [...cart];
    values.splice(index, 1);
    setCart(values);
  }, []);

  const handleCartQTy = useCallback((index: number, type: string) => {
    const values = [...cart];
    if (type === "plus") {
      values[index].cart_product_qty += 1;
    } else {
      if (values[index].cart_product_qty > 1) {
        values[index].cart_product_qty -= 1;
      }
    }

    setCart(values);
  }, []);

  const handleGetExpedition = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setExpeditionSelect(e.target.value);
    setLoadingExp(true);
    setCurrentExp(null);
    try {
      const response = await instance.post(`/nusantara/cost`, {
        destination: defaultAddress.kota.city_id,
        weight: totalWeight,
        courier: e.target.value,
      });
      const result = response?.data?.rajaongkir?.results[0].costs;
      setExpeditionResult(result);
      setLoadingExp(false);
    } catch (error) {
      console.log("Error get cost expedition: ", error);
      setLoadingExp(false);
    }
  };

  const handleCheckOut = async () => {
    if (!currentExp) {
      setModalCheckExp(true);
    } else if (!bank) {
      setModalCheckBank(true);
    } else {
      setOrderLoading(true);
      try {
        const postData = {
          carts: cart,
          expedition_name: expeditionSelect,
          expedition_service: currentExp?.service,
          expedition_price: currentExp?.cost[0].value,
          expedition_estimated: currentExp?.cost[0].etd,
          total_weight: totalWeight,
          total_price: total + currentExp?.cost[0].value,
          bank: bank,
        };

        const response = await instance.post(`/order/create`, postData);
        setCart([]);
        setCurrentExp(null);
        setExpeditionSelect("");
        setOrderLoading(false);
        const result = response?.data?.data;
        router.push(`/transaction_success/${result?.orders?.order_code}`);
      } catch (error) {
        setOrderLoading(false);
        console.log("error order : ", error);
      }
    }
  };

  return (
    <div className="t w-full md:max-w-6xl m-auto mt-5 mb-5 bg-white p-5 min-h-screen">
      {cart?.length > 0 ? (
        <>
          <div className="flex justify-center mb-5">
            <h3 className="font-poppins font-bold text-sm">
              Keranjang Belanja
            </h3>
          </div>
          <div className="w-full overflow-x-auto">
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
                    Hapus
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
                {cart.map((c: any, index: number) => {
                  let subtotal: number = 0;
                  let variantName: string = "";
                  let price: number = 0;

                  if (c.cart_product_variant_id) {
                    const priceVariants = c.product.variants_stock.find(
                      (v: VariantStock) => v.id === +c.cart_product_variant_id
                    );
                    variantName = priceVariants.product_varian_name;
                    subtotal =
                      c.cart_product_qty * priceVariants.product_varian_price;
                    price = priceVariants.product_varian_price;
                  } else {
                    subtotal = c.cart_product_qty * c.product.product_price;
                    price = c.product.product_price;
                  }

                  return (
                    <tr key={index}>
                      <td className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                        <Link
                          href={`/product/detail/${c.product.product_slug}`}
                          className="underline text-blue-500"
                        >
                          {c?.product?.product_name}
                        </Link>
                        <br />
                        <span className="text-xs italic">
                          <strong>Variasi : </strong>
                          {variantName}
                        </span>
                      </td>
                      <td className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                        <div className="flex flex-row items-center gap-4">
                          <button
                            type="button"
                            onClick={() => handleCartQTy(index, "minus")}
                          >
                            <HiMinus />
                          </button>
                          {c?.cart_product_qty}
                          <button
                            type="button"
                            onClick={() => handleCartQTy(index, "plus")}
                          >
                            <HiPlus />
                          </button>
                        </div>
                      </td>
                      <td className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                        <button
                          type="button"
                          onClick={() => handleRemoveCart(index)}
                        >
                          <BsTrash />
                        </button>
                      </td>
                      <td className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                        Rp. {numberWithCommas(price)}
                      </td>
                      <td className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                        Rp. {numberWithCommas(subtotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700"
                    colSpan={3}
                  ></td>
                  <td className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700 ">
                    Total Berat
                  </td>
                  <td className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700 ">
                    {numberWithCommas(totalWeight)} gr
                  </td>
                </tr>
                <tr>
                  <td
                    className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700"
                    colSpan={3}
                  ></td>
                  <td className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700 ">
                    Biaya pengiriman
                  </td>
                  <td className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700 ">
                    Rp.{" "}
                    {currentExp
                      ? numberWithCommas(currentExp?.cost[0].value)
                      : 0}
                  </td>
                </tr>
                <tr>
                  <td
                    className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700"
                    colSpan={3}
                  ></td>
                  <td className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700 ">
                    Total
                  </td>
                  <td className="h-12 px-6 text-sm font-medium border-t border-l first:border-l-0 stroke-slate-700 text-slate-700 ">
                    Rp.{" "}
                    {currentExp
                      ? numberWithCommas(total + currentExp?.cost[0].value)
                      : numberWithCommas(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <Jarak />
          <hr />
          <Jarak />
          <div>
            <span>Alamat pengiriman: </span>
            <Jarak />
            {loadingFetchAddress ? (
              <span>Mengambil informasi alamat...</span>
            ) : (
              <div className="flex flex-col  border-b border-gray-300  ">
                <div className="w-full max-w-lg">
                  <h3 className="text-sm font-bold">
                    {defaultAddress?.address}
                  </h3>
                  <span className="text-xs italic">
                    {defaultAddress?.provinsi?.province_name} -{" "}
                    {defaultAddress?.kota?.city_name} -
                    {defaultAddress?.user_address_kodepos}
                  </span>
                </div>
              </div>
            )}
          </div>
          <Jarak />
          <SelectInput
            label="Pilih Expedisi"
            value={expeditionSelect}
            name="expedisi"
            onChangeInput={(e) => handleGetExpedition(e)}
          >
            {expeditions?.map((expedisi) => {
              return (
                <option value={expedisi} key={expedisi}>
                  {expedisi.toUpperCase()}
                </option>
              );
            })}
          </SelectInput>
          <Jarak />
          {loadingExp ? (
            <span>Mengambil data ekspedisi...</span>
          ) : (
            <div className="flex flex-col lg:flex-row flex-wrap gap-4 ">
              {expeditionResult &&
                expeditionResult.map((expedisi: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`flex flex-row items-center gap-4`}
                    >
                      <input
                        type="radio"
                        name="ekspedisi"
                        className="radio"
                        checked={
                          currentExp?.service === expedisi.service
                            ? true
                            : false
                        }
                        onChange={() => setCurrentExp(expedisi)}
                      />
                      <div className="flex flex-col">
                        <span>
                          <strong>{expedisi.service}</strong> - Rp.
                          {numberWithCommas(expedisi.cost[0].value)}
                        </span>
                        <span className="text-sm italic">
                          Est. {expedisi.cost[0].etd} (hari)
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          <Jarak />
          <SelectInput
            label="Pilih Bank"
            value={bank}
            name="bank"
            onChangeInput={(e) => setBank(e.target.value)}
          >
            {banks?.map((b) => {
              return (
                <option value={b} key={b}>
                  {b.toUpperCase()}
                </option>
              );
            })}
          </SelectInput>
          <Jarak />
          <div className=" flex justify-end mt-5">
            <button
              type="button"
              className={`bg-emerald-500 hover:bg-emerald-300 p-2 rounded-sm ${
                orderLoading ? "disabled:cursor-not-allowed bg-emerald-300" : ""
              }`}
              onClick={handleCheckOut}
              disabled={orderLoading ? true : false}
            >
              <span className="text-white">
                {orderLoading ? "Loading..." : "Checkout"}
              </span>
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <Image src={Cart} width={300} height={300} alt="empty cart" />
            <span>Oops! keranjang belanja masih kosong nih!</span>
          </div>
        </div>
      )}
      {/* modal */}
      <Modal
        isOpen={modalCheckExp}
        handleClose={() => setModalCheckExp(false)}
        title="Error!"
      >
        <div className="flex justify-center flex-col items-center gap-5">
          <Image src={Courier} width={150} height={150} alt="courier" />
          <span>Oops! Kamu belum pilih ekspedisi nih!</span>
        </div>
      </Modal>

      <Modal
        isOpen={modalCheckBank}
        handleClose={() => setModalCheckBank(false)}
        title="Error!"
      >
        <div className="flex justify-center flex-col items-center gap-5">
          <Image src={BankLogo} width={150} height={150} alt="bank logo" />
          <span>Oops! Kamu belum pilih bank pembayaran nih!</span>
        </div>
      </Modal>
    </div>
  );
}

export default withWebStore(CartPage);
