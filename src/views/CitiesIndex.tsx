import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { citiesByProvince, cityPath } from "@/lib/cities";

export default function CitiesIndexPage() {
  const groups = citiesByProvince();

  return (
    <main className="min-h-screen bg-slate-50">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Cities" },
        ]}
      />
      <Header currentPage="rates" />
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-3">Mortgage rates by Canadian city</h1>
          <p className="text-slate-300 text-lg max-w-3xl">
            Live national rates plus provincial land transfer tax, welcome tax, and first-time /
            renewal notes. We do not invent city-average home prices or city-only rate cards.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {groups.map((group) => (
          <section key={group.province}>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{group.name}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.cities.map((city) => (
                <li key={city.slug}>
                  <a
                    href={cityPath(city.slug)}
                    className="block rounded-lg border border-slate-200 bg-white px-4 py-3 hover:border-teal-300 hover:shadow-sm"
                  >
                    <span className="font-medium text-slate-900">{city.name}</span>
                    {city.region && (
                      <span className="block text-sm text-slate-500">{city.region}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <Footer />
    </main>
  );
}
