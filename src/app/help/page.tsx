import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help | TAMUfindr',
  description: 'Learn how TAMUfindr works and find answers to frequently asked questions.',
};

const faqs = [
  {
    question: 'Does TAMUfindr have possession of my item?',
    answer:
      'No. TAMUfindr is a platform for reporting and locating lost items, but it does not physically possess any items.',
  },
  {
    question: 'How do I report a found item?',
    answer: 'Create a listing and provide information about the item and where you found it.',
  },
  {
    question: 'How do I claim an item?',
    answer: 'Open the item listing and follow the provided claim instructions.',
  },
];

type FAQItem = {
  question: string;
  answer: string;
};

function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <div className="divide-y divide-secondary border-y border-secondary">
      {items.map(({ question, answer }) => (
        <details key={question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            {question}

            <span
              aria-hidden="true"
              className="text-2xl font-normal transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>

          <p className="max-w-2xl pt-3 leading-7 text-slate-600">{answer}</p>
        </details>
      ))}
    </div>
  );
}

export default function HelpPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12 md:py-16">
      <header className="mb-12">
        <p className="mb-2 font-semibold uppercase tracking-wider text-accent">Help Center</p>

        <h1 className="text-4xl font-bold text-primary md:text-5xl">How TAMUfindr Works</h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          TAMUfindr helps students report, locate, and recover lost items around campus.
        </p>
      </header>

      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="mb-6 text-2xl font-bold text-primary">
          Frequently Asked Questions
        </h2>

        <FAQ items={faqs} />
      </section>

      <section aria-labelledby="links-heading" className="mt-12 border-b border-secondary pb-10">
        <h2 id="links-heading" className="mb-4 text-2xl font-bold text-primary">
          Helpful Links
        </h2>

        <a
          href="https://www.tamu.edu/contact/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent underline decoration-secondary underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          Visit the TAMU Contact Information Page
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </section>

      <section aria-labelledby="contact-heading" className="mt-10">
        <h2 id="contact-heading" className="mb-4 text-2xl font-bold text-primary">
          Contact Us
        </h2>

        <p className="leading-7 text-slate-600">
          If you have questions or need assistance, contact us at{' '}
          <a
            href="mailto:support@tamufindr.com"
            className="font-semibold text-accent underline decoration-secondary underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            support@tamufindr.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
