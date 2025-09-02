import Image from "next/image"
export default function RightColumn(){
    return(
        <>
           <div 
      className=" hidden
      h-full w-full 
      bg-white
      lg:flex "
      
      >
        <Image
        className="w-full  object-fit"
        src="images/right-column.svg" alt="err" width={100} height={50} />
      </div></>
    )
}