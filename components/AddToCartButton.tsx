"use client";

import { FC, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/payload-types";

interface AddToCartButtonProps {
  product: Product;
}

const AddToCartButton: FC<AddToCartButtonProps> = ({ product }) => {
  const { addItem } = useCart();

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, [isSuccess]);

  return (
    <Button
      onClick={() => {
        if (!isSuccess) {
          addItem(product);
          setIsSuccess(true);
        }
      }}
      size="lg"
      disabled={isSuccess}
      className={cn(
        "w-full duration-300 disabled:opacity-100 disabled:cursor-not-allowed",
        {
          "bg-green-500 hover:bg-green-500": isSuccess,
        }
      )}
    >
      {isSuccess ? <CheckCircle className="w-4 h-4 mr-2" /> : <></>}
      {isSuccess ? "Added!" : "Add to cart"}
    </Button>
  );
};

export default AddToCartButton;
