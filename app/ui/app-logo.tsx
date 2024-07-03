import { inter } from '@/app/ui/fonts';
import Image from 'next/image';

export default function AcmeLogo({ fontSize }: { fontSize: string }) {

  let logoSize = 64;
  let titleSize = "text-base";
  let subTitleSize = "text-base";

  if (fontSize == "l"){
    logoSize = 96;
      subTitleSize = "text-2xl";
      titleSize = "text-3xl";

    } else {
      logoSize = 64;
      subTitleSize = "text-sm";
      titleSize = "text-base";
     
    }


  return (

    <div className={`${inter.className} flex flex-col items-center text-white`}>
      <div className="flex items-center ml-8 w-[250px] ml-[85px]">
        <Image
          src="/logo-white.png"
          width={logoSize}
          height={logoSize}
          alt="Workwatch logo em cor branca"
        />

        <div className="">
          <p className= {` ${titleSize} font-extrabold `}>Workwatch</p>
          <p className={ `${subTitleSize} text-sm w-full md:w-auto font-light italic`}>Uma solução TechERP</p>
        </div>
       
      </div>
      
    </div>
  );
}

