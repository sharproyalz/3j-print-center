import Image from 'next/image';

export function NavigationBar() {
  return (
    <>
      <div className="flex justify-between border-none bg-primary px-8 py-4  text-white">
        <div className="flex items-center gap-8">
          <div className="flex items-center justify-center gap-4">
            <Image src="/3J-icon.png" alt="3J Logo" width={50} height={50} />{' '}
            <div className="text-lg">Print Center</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-lg">
          <div>Services</div>
          <div>About</div>
          <div>Contact</div>
        </div>
      </div>
    </>
  );
}
