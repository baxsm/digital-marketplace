import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { PRODUCT_CATEGORIES } from "@/config";
import { FC } from "react";

type Param = string | string[] | undefined;

interface PageProps {
  searchParams: {
    [key: string]: Param;
  };
}

const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined;
};

const Page: FC<PageProps> = ({ searchParams }) => {
  const sort = parse(searchParams.sort);
  const category = parse(searchParams.category);

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category
  )?.label;

  return (
    <MaxWidthWrapper>
      <ProductReel
        title={label || "Browse high-quality assets"}
        query={{
          sort: sort === "desc" || sort === "asc" ? sort : undefined,
          category,
          limit: 40,
        }}
      />
    </MaxWidthWrapper>
  );
};

export default Page;
