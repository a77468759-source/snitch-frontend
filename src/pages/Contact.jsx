import { Link } from "react-router-dom"

const helpTopics = [
  { title: "Orders & delivery", detail: "Sign in and visit Your orders to check order details and current status." },
  { title: "Sizing & availability", detail: "Each product page shows available sizes and stock for that item." },
  { title: "Need a hand?", detail: "Use the contact email configured for your store to reach your support team." },
]

const Contact = () => {
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL

  return (
    <main className="mx-auto min-h-[60vh] max-w-4xl pb-20">
      <section className="py-14 text-center sm:py-20">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">We’re here to help</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Contact & support</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-neutral-500">Quick answers to common questions. For anything else, our team would be happy to hear from you.</p>
      </section>
      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {helpTopics.map(({ title, detail }) => (
          <section key={title} className="flex flex-col gap-2 py-6 sm:flex-row sm:justify-between sm:gap-10">
            <h2 className="text-sm font-semibold sm:w-1/3">{title}</h2>
            <p className="text-sm leading-6 text-neutral-600 sm:w-2/3">{detail}</p>
          </section>
        ))}
      </div>
      <div className="mt-8 flex flex-col items-start justify-between gap-4 bg-stone-50 p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-lg font-semibold">Still have a question?</h2>
          <p className="mt-1 text-sm text-neutral-600">Our support team can help with your order or product questions.</p>
        </div>
        {contactEmail ? (
          <a href={`mailto:${contactEmail}`} className="shrink-0 bg-neutral-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-neutral-700">Email us</a>
        ) : (
          <p className="max-w-xs text-xs leading-5 text-neutral-500">Store support email is not configured yet. Set <code>VITE_CONTACT_EMAIL</code> in the client environment to add a contact link.</p>
        )}
      </div>
      <p className="mt-7 text-center text-sm text-neutral-500">Need order information? <Link to="/order" className="text-neutral-950 underline underline-offset-4">View your orders</Link></p>
    </main>
  )
}

export default Contact
