import Image from "next/image";

const Header = () => {
  return (
    <div className="bg-primary p-5">
      <Image src="logo.svg" alt="Neds logo" width={87} height={32} />
    </div>
  );
};

export default Header;
