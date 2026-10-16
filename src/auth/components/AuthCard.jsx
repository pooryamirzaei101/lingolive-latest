export default function AuthCard({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-[24px] shadow-[0_24px_70px_rgba(35,75,57,.12)] p-7 sm:p-10 w-full max-w-md">

      <h1 className="font-serif text-4xl font-bold tracking-tight mb-3 text-left text-[#18251f]">
        {title}
      </h1>

      <p className="text-slate-500 leading-6 text-left mb-8">
        {subtitle}
      </p>

      {children}

    </div>
  );
}
