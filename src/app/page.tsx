import Link from 'next/link';

export default function Landing() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <div className="w-full text-left mb-8">
        <p className="mb-2 font-semibold uppercase tracking-wider text-accent">Welcome</p>
        <h1 className="text-5xl font-bold text-primary md:text-6xl pb-6">Howdy!</h1>
        <h2 className="text-2xl font-bold text-primary md:text-3xl pt-3">
          Lost something on campus?
        </h2>
        <p className="max-w-2xl text-m leading-8 text-slate-600 pt-0.5">
          {
            'We pool lost-and-found catalogs from all TAMU buildings—including Zachry, Evans Library, and the MSC—into a single, easy-to-use search.'
          }
        </p>
      </div>

      <section className="mb-10 w-full max-w-5xl">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-primary md:text-3xl">How it works</h2>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:justify-between">
          {[
            {
              number: '1',
              title: 'Lose something',
              description: 'Report your lost item within TAMUfindr.',
            },
            {
              number: '2',
              title: 'Someone finds it',
              description: 'They report the found item and note the Lost & Found location.',
            },
            {
              number: '3',
              title: 'Algorithm matches',
              description: 'Your report is matched to a relevant found report.',
            },
            {
              number: '4',
              title: 'You are notified',
              description: 'Review the match and verify it before connecting.',
            },
          ].map((step, index) => (
            <div key={step.number} className="flex items-center gap-3">
              <div className="flex h-52 w-52 flex-col rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <div className="mx-auto mt-3 flex h-12 w-12 items-center justify-center rounded-full border border-secondary bg-secondary/60 text-m font-bold text-primary">
                  {step.number}
                </div>
                <div className="mt-4.5 flex flex-1 flex-col justify-top">
                  <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-5 text-slate-600">{step.description}</p>
                </div>
              </div>

              {index < 3 && <div className="hidden text-xl font-bold text-primary md:block">→</div>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
