import Image from "next/image"

export default function Header() {
  return (
    <header className="w-full bg-transparent py-6 flex items-center justify-between px-6">
      <div className="flex items-center">
        <Image src="/logo-abaco.svg" alt="Abaco Logo" width={90} height={32} priority />
      </div>
    </header>
  )
}
