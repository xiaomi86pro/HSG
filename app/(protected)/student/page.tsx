const grades = [6, 7, 8, 9, 10, 11, 12]

export default function Page() {

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Thông tin người dùng</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Full name</p>
              <p className="mt-1 text-base font-semibold text-slate-900">Nguyen Van A</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</p>
              <p className="mt-1 text-base font-semibold text-slate-900">student@example.com</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label htmlFor="grade" className="text-sm font-medium text-slate-700">
            Chọn lớp
          </label>
          <select
            id="grade"
            name="grade"
            defaultValue="12"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-400"
          >
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-slate-800"
            >
              GENERATE EXAM
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold tracking-wide text-slate-900 transition hover:bg-slate-50"
            >
              VIEW HISTORY
            </button>
            <button
              type="button"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold tracking-wide text-red-700 transition hover:bg-red-100"
            >
              LOG OUT
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}