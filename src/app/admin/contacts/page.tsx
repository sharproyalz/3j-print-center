import { Instagram, Phone, Plus, Twitter } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <>
      <main className=" p-8">
        <div className="flex justify-between ">
          <div className="text-4xl font-bold">Contact</div>
          <button
            type="button"
            className="flex items-center gap-4 rounded-md border border-secondary p-4 hover:bg-secondary hover:text-white"
          >
            <div>Add</div>
            <Plus />
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-4 py-2">
            <Image src="/gmail.png" alt="Gmail Icon" height={28} width={28} />
            <div>printcenter.3j@gmail.com</div>
          </div>
          <div className="flex items-center gap-4 py-2">
            <Image src="/fb.png" alt="Facebook Icon" height={28} width={28} />
            <div>Threej Printcenter</div>
          </div>
          <div className="flex items-center gap-4 py-2">
            <Phone width={28} />
            <div>0933-942-2580 / 0915-714-3388</div>
          </div>
          <div className="flex items-center gap-4 py-2">
            <Instagram width={28} />
            <div>N/A</div>
          </div>
          <div className="flex items-center gap-4 py-2">
            <Twitter width={28} />
            <div>N/A</div>
          </div>
        </div>
      </main>
    </>
  );
}
