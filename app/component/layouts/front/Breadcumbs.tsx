"use client";
import { Tbreadcumbs } from "@/app/interface/breadcumb";
import Link from "next/link";

export default function Breadcrumbs({ links }: { links?: Tbreadcumbs[] }) {
  return (
    <section className="w-full md:max-w-6xl m-auto px-5">
      <div className="text-sm breadcrumbs">
        <ul className="flex items-center gap-2">
          <Link href="/">Home</Link>
          {links?.map((x: Tbreadcumbs, index: number) => {
            return (
              <div key={index} className="flex gap-2">
                {" > "}
                <Link href={`${x.page_url}`}> {x.page_title} </Link>
              </div>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
