"use client";
import { BtnDelete } from "@/app/component/application-ui/Button";
import ContentWrapper from "@/app/component/application-ui/ContentWrapper";
import Modal from "@/app/component/application-ui/Modal";
import { Jarak } from "@/app/component/application-ui/Spacing";
import React, { FC, useState } from "react";

interface IExample {
  optionTitle: string;
  optionValue: string[];
}

const ExamplePage: FC = () => {
  const [productOptions, setProductOptions] = useState<IExample[]>([]);
  const [modalVarian, setModalVarian] = useState<boolean>(false);

  const handleAddFields = () => {
    const values = [...productOptions];
    values.push({ optionTitle: "Option 1", optionValue: ["Black", "White"] });
    setProductOptions(values);
  };

  const handleModalVarian = () => {
    setModalVarian(!modalVarian);
  };

  return (
    <ContentWrapper>
      <div className="flex flex-row gap-5">
        {productOptions.length < 2 ? (
          <button className="border-b group hover:border-b-blue-300">
            <span
              className="font-normal items-center text-[14px] group-hover:text-blue-400"
              onClick={handleAddFields}
            >
              + Add Product Option
            </span>
          </button>
        ) : null}

        {productOptions.length > 0 ? (
          <button className="border-b group hover:border-b-blue-300">
            <span
              className="font-normal items-center text-[14px] group-hover:text-blue-400"
              onClick={handleModalVarian}
            >
              + Add Option value
            </span>
          </button>
        ) : null}
      </div>
      <Jarak />
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="border-b bg-slate-300 ">
            <tr className="">
              <th className="text-slate-700 font-normal text-[14px]">
                Common Option
              </th>
              <th className="text-slate-700 font-normal text-[14px]">
                Common Value
              </th>
              <th className="text-slate-700 font-normal text-[14px]"></th>
            </tr>
          </thead>
          <tbody>
            {productOptions?.map((option: IExample, index: number) => {
              return (
                <tr key={index}>
                  <td>{option.optionTitle}</td>
                  <td className="flex flex-col gap-2 max-w-52">
                    {option?.optionValue?.map((value: any, index: number) => {
                      return (
                        <div className="flex flex-row gap-2" key={index}>
                          <div className="flex p-2 border rounded-md border-blue-300 text-center items-center">
                            <span className="text-blue-300 ">{value}</span>
                          </div>
                          <BtnDelete onClick={() => console.log(value)} />
                        </div>
                      );
                    })}
                  </td>
                  <td>
                    <BtnDelete onClick={() => console.log("Remove")} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Jarak /> <Jarak />
      {productOptions.length > 0 ? (
        <>
          <span>Varian Stock :</span>
          <div className="overflow-x-auto">
            <table className="table ">
              <thead className="border-b bg-slate-300 ">
                <tr className="">
                  {productOptions?.map((varian: IExample, index: number) => {
                    return (
                      <th
                        className="text-slate-700 font-normal text-[14px]"
                        key={index}
                      >
                        {varian.optionTitle}
                      </th>
                    );
                  })}

                  <th className="text-slate-700 font-normal text-[14px]">
                    Stock
                  </th>
                  <th className="text-slate-700 font-normal text-[14px]">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {productOptions &&
                  productOptions[0]?.optionValue?.map(
                    (option: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{option}</td>
                          {productOptions[1] ? (
                            <>
                              <td className="">
                                {productOptions[1]?.optionValue?.map(
                                  (option2: any, index: number) => {
                                    return (
                                      <tr key={index}>
                                        <td>{option2}</td>
                                      </tr>
                                    );
                                  }
                                )}
                              </td>
                              {/* <td>15</td>
                              <td>50000</td> */}
                            </>
                          ) : (
                            <>
                              <td>15</td>
                              <td>50000</td>
                            </>
                          )}
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
      {/* modal value option*/}
      <Modal
        title="Add varian attribute"
        isOpen={modalVarian}
        handleClose={() => setModalVarian(!modalVarian)}
      >
        <div>Handle ADd</div>
      </Modal>
      {/* end: modal value option */}
    </ContentWrapper>
  );
};

export default ExamplePage;
