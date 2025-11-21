import type { ReactNode } from "react";
import Box from "./images/box";
import { Logo } from "./images/logo";
import Tip from "./images/tip";

export default function BaseTemplate({
  title,
  description,
  site,
}: {
  title: ReactNode;
  description: ReactNode;
  site?: ReactNode;
}) {
  return (
    <div tw="relative bg-[#F2F2F2] w-full h-full">
      <div tw="absolute size-1440 rounded-full bg-[#F7F7F7] right-30 -bottom-380" />
      <div tw="relative z-1 w-full h-full py-14 px-14 flex flex-col justify-between">
        <div tw="flex flex-col">
          <div tw="text-3xl">{site}</div>
          <div tw="text-5xl font-medium mt-24">{title}</div>
          <p tw="text-3xl max-w-150 text-black/90">{description}</p>
        </div>
        <div>
          <Logo height={50} width={50} />
        </div>
      </div>
      <Tip
        height={104}
        tw="absolute right-[280px] top-[276px] z-2"
        width={85}
      />
      <Box
        height={132.5}
        tw="absolute right-[130px] top-[406px] z-2"
        width={140}
      />
    </div>
  );
}
