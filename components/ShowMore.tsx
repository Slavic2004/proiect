"use client";
import { ShowMoreProps } from "@/types";
import { useRouter } from "next/navigation";
import { updatesearchParams } from "@/utils";
import CustomButton from "./CustomButton";

const ShowMore = ({ pageNumber, isNext }: ShowMoreProps) => {
  const router = useRouter();
  
  const handleNavigation = () => {
    const newLimit = (pageNumber + 1) * 10;
    const newPathname = updatesearchParams("limit", newLimit.toString());
    router.push(newPathname);
  }
  
  return (
    <div className="w-full flex-center gap-5 mt-10">
        {!isNext && (
            <CustomButton
            title="Show More"
            btnType="button"
            containerStyles="bg-primary-blue rounded-full text-white"
            handleClick={handleNavigation}         
            />
        )}
        {isNext && (
          <p className="text-gray-500">No more cars to show</p>
        )}
    </div>
  )
}

export default ShowMore