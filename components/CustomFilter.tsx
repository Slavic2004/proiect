"use client"
import { Fragment, useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react"
import { CustomFilterProps, OptionProps } from "@/types"
import { updatesearchParams } from "@/utils"
const CustomFilter = ({title, options }: CustomFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState(options[0] || { title: "", value: "" });

  useEffect(() => {
    const paramValue = searchParams.get(title);
    if (paramValue) {
      const matchingOption = options.find(option => 
        option.value.toLowerCase() === paramValue.toLowerCase()
      );
      if (matchingOption) {
        setSelected(matchingOption);
      }
    }
  }, [searchParams, title, options]);

const handleUpdateParams = (e: {title: string, value: string}) => {
  const newPathName = updatesearchParams(title, e.value.toLowerCase());


  router.push(newPathName);
}


  return (
    <div className="w-fit">
      <Listbox
      value={selected}
      onChange={(e) => {
        setSelected(e);
        handleUpdateParams(e);
      }}
      >
        <div className="relative w-fit z-10">
         <ListboxButton className="custom-filter__btn">
<span className="block truncate">
  {selected.title}
</span>
<Image
src="/chevron-up-down.svg" 
width={20}
height={20}
className="ml-4 object-contain"
alt="chevron up down"
 />
         </ListboxButton>
         <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          >
            <ListboxOptions className="custom-filter__options">
              {options.map((option) => (
                <ListboxOption
                key={option.title}
                value={option}
                className={({ active }) => `relative cursor-default select-none py-2 px-4 ${
                  active ? 'bg-primary-blue text-white' : 'text-gray-900'}`}
                >
                  {({selected}) => (
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {option.title}
                    </span>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
         </Transition>

        </div>
      </Listbox>
      
      
    </div>
  )
}

export default CustomFilter;