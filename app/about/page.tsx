export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-6xl/9 font-dongle font-bold text-foreground mb-4">About</h1>
        <p className="text-foreground mb-8">
          We help families quickly compare hospice providers using official Medicare data—clear, transparent, and easy to use.
        </p>
        <h2 className="text-6xl/9 font-dongle font-bold text-foreground mb-3">Contact Founders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-secondary text-background rounded-3xl p-4 flex flex-col gap-4 items-left justify-center">
            <h3 className="font-dongle font-bold text-6xl/9">Devin Schutz</h3>
            <p className="">
              Phone: <a href="tel:17073929455" className="underline">707-392-9455</a>
            </p>
            <p className="">
              Email: <a href="mailto:schutzdevin@gmail.com" className="underline">schutzdevin@gmail.com</a>
            </p>
          </div>
          <div className="bg-secondary text-background rounded-3xl p-4 flex flex-col gap-4 items-left justify-center">
            <h3 className="font-dongle font-bold text-6xl/9">Zane Bennion</h3>
            <p className="">
              Phone: <a href="tel:19073304607" className="underline">907-330-4607</a>
            </p>
            <p className="">
              Email: <a href="mailto:zanebennion@gmail.com" className="underline">zanebennion@gmail.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
