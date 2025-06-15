import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link className="relative h-10 w-32" href={"/"}>
      <Image
        src="/logo_light.png"
        fill
        alt="Logo"
        className="block object-contain dark:hidden"
        sizes="100%"
        priority
      />
      <Image
        src="/logo_dark.png"
        fill
        alt="Logo"
        className="hidden object-contain dark:block"
        sizes="100%"
        priority
      />
    </Link>
  );
}
