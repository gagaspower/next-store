"use client";
import { Jarak } from "@/components/application-ui/Spacing";
import { TProduct } from "@/interface/product";

import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { PRODUCT_IMAGE_URL } from "@/utils/const";
import { numberWithCommas } from "@/utils/func";
import { useSessionContext } from "@/context/sessionProvider";
import Modal from "@/components/application-ui/Modal";
import { useToastAlert } from "@/components/application-ui/Toast";
import { useCartContext } from "@/context/cart";

function ProductDetailCard({ data }: { data: TProduct }) {
  const { toastSuccess } = useToastAlert();
  const { sessionAuth } = useSessionContext();
  const { setCart } = useCartContext();
  const [modalAuth, setModalAuth] = useState<boolean>(false);

  // menghitung total stok tersedia
  const sumStock: number =
    data.variants_stock.length > 0
      ? data.variants_stock.reduce((total, item) => {
          return total + item.product_varian_stock;
        }, 0)
      : data.product_stock;

  // mencari harga termurah
  const minPrice = data.variants_stock.reduce((min, p) => {
    return min === 0 || p.product_varian_price < min
      ? p.product_varian_price
      : min;
  }, 0);

  // mencari harga termahal
  // const maxPrice = data.variants_stock.reduce((max, p) => {
  //   return p.product_varian_price > max ? p.product_varian_price : max;
  // }, 0);

  const [varianSelections, setVarianSelections] = useState<any>({});
  const [qty, setQty] = useState<number>(1);
  const [defaultStock, setDefaultStock] = useState<number>(sumStock);
  const [priceSelect, setPriceSelect] = useState<number>(data.product_price);
  const [selectedVariantsDetail, setSelectedVariantsDetail] = useState<any>({});
  const [modalVariantConfirm, setModalVariantConfirm] =
    useState<boolean>(false);
  const [modalConfirmStock, setModalConfirmStock] = useState<boolean>(false);

  const theObj = { __html: data.product_desc };

  const handleSelectVarian = (group: string, value: string) => {
    setVarianSelections((prevSelections: any) => ({
      ...prevSelections,
      [group]: prevSelections[group] === value ? "" : value,
    }));
  };

  const getVarianSelectionsString = useCallback(() => {
    const selectedVariants = Object.entries(varianSelections).filter(
      ([_, value]) => value
    );

    return selectedVariants
      .map(([_, value]) => `${value}`)
      .join(" | ")
      .trim();
  }, [varianSelections]);

  const variantSelectionsString = getVarianSelectionsString();

  useEffect(() => {
    if (variantSelectionsString) {
      const findStok = data.variants_stock.find(
        (item, index) => item.product_varian_name === variantSelectionsString
      );
      if (findStok) {
        setDefaultStock(findStok?.product_varian_stock);
        setPriceSelect(findStok.product_varian_price);
        setSelectedVariantsDetail(findStok);
      } else {
        setDefaultStock(sumStock);
        setSelectedVariantsDetail({});
      }
    } else {
      setDefaultStock(sumStock);
      setPriceSelect(data.product_price);
      setSelectedVariantsDetail({});
    }
  }, [variantSelectionsString]);

  const handlePlus = () => {
    setQty(qty + 1);
  };

  const handleMin = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleAddToCart = () => {
    if (!sessionAuth?.token) {
      setModalAuth(true);
    } else if (
      data.variants_stock.length > 0 &&
      Object.keys(selectedVariantsDetail).length === 0
    ) {
      setModalVariantConfirm(true);
    } else if (qty > selectedVariantsDetail.product_varian_stock) {
      setModalConfirmStock(true);
    } else {
      setCart((currentCart: any[]) => [
        ...currentCart,
        {
          cart_product_id: data?.id,
          cart_product_qty: qty,
          cart_product_variant_id: selectedVariantsDetail?.id,
          cart_user_id: sessionAuth?.session_id?.id,
          product: data,
        },
      ]);
      toastSuccess("Produk ditambahkan ke keranjang belanja");
    }
  };

  return (
    <>
      <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-2 gap-5">
        <Image
          src={`${PRODUCT_IMAGE_URL}/${data?.product_image}`}
          width={400}
          height={450}
          alt="produk"
          className="bg-gray-200 p-5 rounded-md object-cover w-full md:max-w-[400px]"
        />
        <div className="flex flex-col">
          <h3 className="font-bold">{data.product_name}</h3>
          <Jarak />

          <h2 className="text-orange-500 font-bold">
            {priceSelect !== 0
              ? "Rp. " + numberWithCommas(priceSelect)
              : "Rp. " + numberWithCommas(minPrice)}
          </h2>
          <Jarak />
          <div className="flex flex-col  gap-3">
            {data.variants.length > 0
              ? data.variants.map((v, index) => {
                  return (
                    <div className="flex flex-col" key={index}>
                      <span className="text-gray-500 font-thin">
                        {v.varian_group} :
                      </span>
                      <div className="flex flex-row flex-wrap gap-2">
                        {v.varian_item.split("|").map((val) => {
                          return (
                            <button
                              type="button"
                              key={val}
                              className={`bg-gray-100 rounded-sm p-1 group hover:border border-orange-500 hover:bg-white ${
                                varianSelections[v.varian_group] === val
                                  ? "border border-orange-500 bg-white"
                                  : ""
                              }`}
                              onClick={() =>
                                handleSelectVarian(v.varian_group, val)
                              }
                            >
                              <span className="text-gray-400 font-normal text-sm hover:text-orange-500">
                                {val}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
          <Jarak />
          <div className="relative flex items-center max-w-[8rem]">
            <button
              type="button"
              id="decrement-button"
              data-input-counter-decrement="quantity-input"
              className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              onClick={handleMin}
            >
              <svg
                className="w-3 h-3 text-gray-900 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 2"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h16"
                />
              </svg>
            </button>
            <input
              type="text"
              id="quantity-input"
              data-input-counter
              aria-describedby="helper-text-explanation"
              className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="1"
              value={qty}
              readOnly
            />
            <button
              type="button"
              id="increment-button"
              data-input-counter-increment="quantity-input"
              className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              onClick={handlePlus}
            >
              <svg
                className="w-3 h-3 text-gray-900 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </button>
          </div>
          <span className="text-sm">
            {defaultStock > 0 ? "Stok :" + defaultStock : "Stok habis"}
          </span>
          <Jarak />
          <Jarak />
          <button
            type="button"
            className={`inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none`}
            disabled={defaultStock === 0 ? true : false}
            onClick={handleAddToCart}
          >
            <span>Beli Produk</span>
          </button>
        </div>
      </div>
      <Jarak />
      <Jarak />
      <hr />
      <Jarak />
      <Jarak />
      <div>
        <span className="font-bold">Deskripsi Produk : </span>
        <Jarak />
        <div dangerouslySetInnerHTML={theObj} className="prose" />
      </div>

      {/* modal auth check */}
      <Modal
        isOpen={modalAuth}
        handleClose={() => setModalAuth(false)}
        title="Login dulu!"
      >
        <span className="text-sm">
          Silahkan login terlebih dahulul untuk melakukan transaksi!
        </span>
      </Modal>

      {/* modal check variant is selected */}
      {/* modal auth check */}
      <Modal
        isOpen={modalVariantConfirm}
        handleClose={() => setModalVariantConfirm(false)}
        title="Info!!"
      >
        <span className="text-sm">
          Untuk menghindari kesalahan, mohon pilih terlebih dahulu variasi
          produk
        </span>
      </Modal>

      {/* modal confirm stock check */}
      <Modal
        isOpen={modalConfirmStock}
        handleClose={() => setModalConfirmStock(false)}
        title="Info!!"
      >
        <span className="text-sm">Jumlah melebihi stok tersedia!</span>
      </Modal>
    </>
  );
}

export default ProductDetailCard;
