import { useState } from "react";

type View = "browse" | "detail" | "report" | "activity" | "claim-submitted" | "staff";

const ITEMS = [
  {
    id: "TAMU-930210",
    category: "Water Bottles",
    name: "Black Hydroflask 32oz",
    description: "Matte black 32oz Hydroflask with minor scratches on the bottom. No stickers.",
    foundLocation: "Zachry Engineering Education Complex, Room 264",
    heldAt: "Zachry Engineering Education Complex – Front Desk, Room 100",
    building: "Zachry",
    dateFound: "September 10, 2026",
    status: "available" as const,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=500&fit=crop&auto=format",
    color: "Black",
  },
  {
    id: "TAMU-930198",
    category: "Electronics",
    name: "MacBook Pro Charger",
    description: "White 140W USB-C MagSafe 3 charger with cable.",
    foundLocation: "Evans Library, Study Room 3B",
    heldAt: "Evans Library – Information Desk, 1st Floor",
    building: "Evans Library",
    dateFound: "September 11, 2026",
    status: "pending" as const,
    image: "https://images.unsplash.com/photo-1608751819407-8c8672b68a9b?w=600&h=500&fit=crop&auto=format",
    color: "White",
  },
  {
    id: "TAMU-930177",
    category: "Bags",
    name: "Blue Jansport Backpack",
    description: "Medium-sized navy blue Jansport backpack with multiple compartments.",
    foundLocation: "Memorial Student Center, 2nd Floor Lounge",
    heldAt: "Memorial Student Center – Lost & Found Office, Room 112",
    building: "Memorial Student Center",
    dateFound: "September 9, 2026",
    status: "available" as const,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=500&fit=crop&auto=format",
    color: "Blue",
  },
  {
    id: "TAMU-930154",
    category: "Keys",
    name: "Key Ring with 4 Keys",
    description: "Silver key ring with 4 keys and a small yellow carabiner clip.",
    foundLocation: "Rudder Tower, Room 402",
    heldAt: "Rudder Tower – Administrative Office, Room 200",
    building: "Rudder Tower",
    dateFound: "September 8, 2026",
    status: "available" as const,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop&auto=format",
    color: "Silver",
  },
  {
    id: "TAMU-930141",
    category: "Clothing",
    name: "Maroon TAMU Hoodie",
    description: "Texas A&M University hoodie, size large, maroon with white logo.",
    foundLocation: "Rec Sports Center, Locker Room B",
    heldAt: "Rec Sports Center – Front Desk",
    building: "Rec Sports",
    dateFound: "September 7, 2026",
    status: "claimed" as const,
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&h=500&fit=crop&auto=format",
    color: "Maroon",
  },
  {
    id: "TAMU-930128",
    category: "Electronics",
    name: "AirPods Pro (2nd Gen)",
    description: "White AirPods Pro case, second generation. Engraved initials 'R.A.' on the back.",
    foundLocation: "Langford Architecture Center, Studio A",
    heldAt: "Langford Architecture Center – Main Office",
    building: "Langford",
    dateFound: "September 6, 2026",
    status: "available" as const,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=500&fit=crop&auto=format",
    color: "White",
  },
];

const STAFF_ITEMS = [
  { id: "TAMU-930210", thumb: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=80&h=80&fit=crop", category: "Water Bottles", received: "Sep 10", location: "Zachry Front Desk", status: "available", claims: 1 },
  { id: "TAMU-930198", thumb: "https://images.unsplash.com/photo-1608751819407-8c8672b68a9b?w=80&h=80&fit=crop", category: "Electronics", received: "Sep 11", location: "Evans Library Desk", status: "pending", claims: 1 },
  { id: "TAMU-930177", thumb: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop", category: "Bags", received: "Sep 9", location: "MSC Office 112", status: "available", claims: 0 },
  { id: "TAMU-930154", thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop", category: "Keys", received: "Sep 8", location: "Rudder Admin Office", status: "available", claims: 0 },
  { id: "TAMU-930141", thumb: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=80&h=80&fit=crop", category: "Clothing", received: "Sep 7", location: "Rec Sports Front Desk", status: "returned", claims: 1 },
];

const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  pending: "Pending Claim",
  claimed: "Claimed",
  returned: "Returned",
};

const STATUS_CLASSES: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  claimed: "bg-gray-100 text-gray-700",
  returned: "bg-blue-100 text-blue-800",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${STATUS_CLASSES[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status !== "available" ? null : <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />}
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function Header({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <button onClick={() => setView("browse")} className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity">
          <div>
            <div className="text-[9px] font-semibold tracking-widest text-gray-500 uppercase leading-none">Texas A&M University</div>
            <div className="text-lg font-semibold text-gray-900 leading-tight flex items-center gap-1">
              findr <span className="text-[#500000] text-xl leading-none">•</span>
            </div>
          </div>
        </button>
        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: "Browse", v: "browse" },
            { label: "Report", v: "report" },
            { label: "My Items", v: "activity" },
            { label: "Help", v: null },
          ].map(({ label, v }) => (
            <button
              key={label}
              onClick={() => v && setView(v as View)}
              className={`text-sm font-medium transition-colors hover:text-[#500000] ${
                view === v
                  ? "text-[#500000] border-b-2 border-[#500000] pb-0.5"
                  : "text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setView("staff")}
            className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            Staff
          </button>
        </nav>
        <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <svg className="w-3.5 h-3.5 text-[#500000]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          Sign in with NetID
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#3a0000] text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div>
            <div className="text-[9px] font-semibold tracking-widest text-white/50 uppercase">Texas A&M University</div>
            <div className="text-base font-semibold mt-0.5">findr lost &amp; found</div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Campus Safety</a>
            <a href="#" className="hover:text-white transition-colors">Division of IT</a>
            <a href="#" className="hover:text-white transition-colors">Contact Directory</a>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-white/40">
          <span>© 2026 Texas A&M University. Managed by the Student Services Administration.</span>
          <span>College Station, TX 77840</span>
        </div>
      </div>
    </footer>
  );
}

function BrowseView({ setView, setSelectedItem }: { setView: (v: View) => void; setSelectedItem: (id: string) => void }) {
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [search, setSearch] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("All Buildings");
  const [dateFilter, setDateFilter] = useState("Last 30 Days");
  const [colorFilter, setColorFilter] = useState("Any Color");

  const categories = ["All Items", "Electronics", "Clothing", "Keys", "Water Bottles", "Bags", "Books", "Other"];

  const filtered = ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "All Items" || item.category === activeCategory || (activeCategory === "Water Bottles" && item.category === "Water Bottles");
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    const matchesBuilding = buildingFilter === "All Buildings" || item.building === buildingFilter;
    const matchesColor = colorFilter === "Any Color" || item.color === colorFilter;
    return matchesCategory && matchesSearch && matchesBuilding && matchesColor;
  });

  return (
    <div>
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Lost something on campus?
        </h1>
        <p className="text-gray-500 text-base max-w-lg mb-7">
          We pool lost-and-found catalogs from all TAMU buildings—including Zachry, Evans Library, and the MSC—into a single, easy-to-use search.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for a water bottle, keys, backpack…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/30 focus:border-[#500000]"
            />
          </div>
          <button onClick={() => setView("report")} className="flex items-center gap-2 px-4 py-2.5 border border-gray-400 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Report Lost Item
          </button>
          <button onClick={() => setView("report")} className="flex items-center gap-2 px-4 py-2.5 bg-[#500000] text-white rounded-lg text-sm font-medium hover:bg-[#3a0000] transition-colors whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Found an Item
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="max-w-7xl mx-auto px-6 pb-5">
        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#500000] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Building / Area</label>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#500000]/30 bg-white"
            >
              <option>All Buildings</option>
              <option>Zachry</option>
              <option>Evans Library</option>
              <option>Memorial Student Center</option>
              <option>Rudder Tower</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Date Range Found</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#500000]/30 bg-white"
            >
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Primary Color</label>
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#500000]/30 bg-white"
            >
              <option>Any Color</option>
              <option>Black</option>
              <option>White</option>
              <option>Blue</option>
              <option>Silver</option>
              <option>Maroon</option>
            </select>
          </div>
          {(buildingFilter !== "All Buildings" || colorFilter !== "Any Color") && (
            <button
              onClick={() => { setBuildingFilter("All Buildings"); setColorFilter("Any Color"); }}
              className="mt-4 text-[#500000] text-sm font-medium hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Recently Found Items</h2>
          <span className="text-sm text-gray-400">
            Showing <strong className="text-gray-700">{filtered.length} results</strong> out of {ITEMS.length} total
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-gray-200 rounded-xl">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500 font-medium">No items match your search</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {filtered.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setSelectedItem(item.id); setView("detail"); }}
                  className="group text-left bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2.5 left-2.5">
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Featured card */}
              {filtered[0] && (
                <button
                  onClick={() => { setSelectedItem(filtered[0].id); setView("detail"); }}
                  className="group text-left bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <div className="relative h-52 bg-gray-100 overflow-hidden">
                    <img src={filtered[0].image} alt={filtered[0].name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2.5 left-2.5">
                      <StatusBadge status={filtered[0].status} />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{filtered[0].category}</div>
                    <div className="font-semibold text-gray-900 mb-2">{filtered[0].name}</div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-start gap-1.5">
                        <svg className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>Found: {filtered[0].foundLocation}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <svg className="w-3 h-3 text-[#500000] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Held at: {filtered[0].heldAt}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Reported: {filtered[0].dateFound}</span>
                      </div>
                    </div>
                  </div>
                </button>
              )}
              <div className="grid grid-cols-1 gap-4">
                {filtered.slice(3, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedItem(item.id); setView("detail"); }}
                    className="group text-left bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all flex"
                  >
                    <div className="relative w-28 shrink-0 bg-gray-100 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-1.5 left-1.5">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                    <div className="p-3 flex-1">
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{item.category}</div>
                      <div className="font-semibold text-gray-900 text-sm mb-1.5">{item.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">Found: {item.foundLocation}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.dateFound}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Load More Items
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DetailView({ itemId, setView }: { itemId: string; setView: (v: View) => void }) {
  const item = ITEMS.find((i) => i.id === itemId) ?? ITEMS[0];
  const [form, setForm] = useState({ name: "", uin: "", email: "", phone: "", description: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <button
        onClick={() => setView("browse")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#500000] transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to search results
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Item detail */}
        <div>
          <div className="rounded-xl overflow-hidden bg-gray-100 mb-5 aspect-[4/3]">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex items-center gap-3 mb-3">
            <StatusBadge status={item.status} />
            <span className="text-xs text-gray-400 font-mono">ID: {item.id}</span>
          </div>

          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{item.category}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {item.name}
          </h1>

          <div className="space-y-4 text-sm">
            <div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Found Location</div>
              <div className="text-gray-700">{item.foundLocation}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Currently Held At</div>
              <div className="text-gray-700 font-medium">{item.heldAt}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Date Found</div>
              <div className="text-gray-700">{item.dateFound}</div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-sm text-amber-800">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>This item is physically held at the location above. <strong>Please bring a valid university ID</strong> when picking up a claimed item.</span>
          </div>
        </div>

        {/* Right: Claim form */}
        <div>
          {submitted ? (
            <div className="bg-white border border-gray-200 rounded-xl p-7">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>Claim Under Review</h2>
              <p className="text-gray-500 text-sm mb-5">Your claim has been submitted. Building staff at <strong className="text-gray-700">{item.heldAt.split("–")[0].trim()}</strong> will review your ownership details within 1–2 business days.</p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 mb-5">
                <div className="font-semibold text-gray-900 mb-1">What happens next</div>
                <p>You'll receive a confirmation email at your university address once your claim is approved. Pickup instructions will be included in that email.</p>
              </div>
              <button
                onClick={() => setView("activity")}
                className="w-full bg-[#500000] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#3a0000] transition-colors"
              >
                View My Activity
              </button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-7">
              <h2 className="text-xl font-bold text-gray-900 mb-1.5" style={{ fontFamily: "'DM Serif Display', serif" }}>Submit a Claim Request</h2>
              <p className="text-gray-400 text-xs mb-6">Verification ensures items return safely to their rightful owner.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      placeholder="Revell Aggie"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/30 focus:border-[#500000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">University ID (UIN)</label>
                    <input
                      type="text"
                      placeholder="e.g. 123004567"
                      value={form.uin}
                      onChange={(e) => setForm({ ...form, uin: e.target.value })}
                      required
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/30 focus:border-[#500000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">University Email</label>
                    <input
                      type="email"
                      placeholder="aggie@tamu.edu"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/30 focus:border-[#500000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="(979) 555-0148"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/30 focus:border-[#500000]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ownership Description</label>
                  <textarea
                    placeholder="Describe any specific identifiers (e.g. stickers, specific scratches, contents, precise time you lost it)…"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/30 focus:border-[#500000] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Proof of Ownership Photo <span className="font-normal text-gray-400">(optional)</span></label>
                  <div className="border border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center gap-2 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs text-gray-500">Click to upload proof of ownership<br /><span className="text-gray-400">PNG, JPG up to 10MB (e.g. a photo of you holding it / a receipt)</span></p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#500000] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#3a0000] transition-colors mt-1"
                >
                  Submit Claim Verification
                </button>
              </form>

              <div className="mt-7 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">How claiming works</h3>
                <ol className="space-y-3.5">
                  {[
                    { n: "1", title: "Submit your claim", desc: "Fill out the verification form with as much unique details as possible to verify identity." },
                    { n: "2", title: "Building staff reviews", desc: "The department managing this specific location's storage desk will verify your details against the physical item." },
                    { n: "3", title: "Receive instructions", desc: "You'll receive a confirmation email with pickup instructions within 24–48 hours." },
                    { n: "4", title: "Bring your university ID", desc: "Visit the held-at location during operating hours and show your Aggie ID to receive the item." },
                  ].map(({ n, title, desc }) => (
                    <li key={n} className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#500000]/10 text-[#500000] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{n}</span>
                      <div>
                        <div className="text-xs font-semibold text-gray-900">{title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReportView({ setView }: { setView: (v: View) => void }) {
  const [type, setType] = useState<"lost" | "found" | null>(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ category: "", description: "", date: "", location: "", privateDetails: "", hasItem: "yes" });

  if (!type) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Report an Item</h1>
        <p className="text-gray-500 mb-10">Select which kind of report you're submitting.</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setType("lost")}
            className="group border-2 border-gray-200 hover:border-[#500000] rounded-xl p-8 text-center transition-all hover:shadow-sm"
          >
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-semibold text-gray-900 text-lg group-hover:text-[#500000] transition-colors">I lost something</div>
            <div className="text-sm text-gray-400 mt-1.5">Help us match you to a found item</div>
          </button>
          <button
            onClick={() => setType("found")}
            className="group border-2 border-gray-200 hover:border-[#500000] rounded-xl p-8 text-center transition-all hover:shadow-sm"
          >
            <div className="text-4xl mb-3">📦</div>
            <div className="font-semibold text-gray-900 text-lg group-hover:text-[#500000] transition-colors">I found something</div>
            <div className="text-sm text-gray-400 mt-1.5">Log an item so its owner can claim it</div>
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>Report Submitted</h2>
        <p className="text-gray-500 mb-7">
          {type === "lost"
            ? "We'll notify you if a possible match is found. Check My Items to track status."
            : "The item has been logged. The owner can now search and submit a claim."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setView("activity")}
            className="px-5 py-2.5 bg-[#500000] text-white rounded-lg text-sm font-medium hover:bg-[#3a0000] transition-colors"
          >
            View My Activity
          </button>
          <button
            onClick={() => { setType(null); setStep(1); setSubmitted(false); }}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Report Another Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <button
        onClick={() => { setType(null); setStep(1); }}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#500000] transition-colors mb-7"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="flex items-center gap-2 mb-7">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${type === "lost" ? "bg-amber-100 text-amber-800" : "bg-[#500000]/10 text-[#500000]"}`}>
          {type === "lost" ? "Lost Item Report" : "Found Item Report"}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
        {type === "lost" ? "Describe what you lost" : "Describe the item you found"}
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/30 focus:border-[#500000]"
          >
            <option value="">Select a category…</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Keys</option>
            <option>Water Bottles</option>
            <option>Bags</option>
            <option>Books</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Public Description</label>
          <textarea
            placeholder="Color, brand, general appearance — visible information only"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/30 focus:border-[#500000] resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Private Identifying Details <span className="font-normal text-gray-400">(not publicly shown)</span></label>
          <textarea
            placeholder="Serial numbers, engravings, specific contents, unique markings…"
            value={form.privateDetails}
            onChange={(e) => setForm({ ...form, privateDetails: e.target.value })}
            rows={2}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/30 focus:border-[#500000] resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Approximate Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/30 focus:border-[#500000]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Campus Location</label>
            <select
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/30 focus:border-[#500000]"
            >
              <option value="">Select building…</option>
              <option>Zachry Engineering Education Complex</option>
              <option>Evans Library</option>
              <option>Memorial Student Center</option>
              <option>Rudder Tower</option>
              <option>Rec Sports Center</option>
              <option>Langford Architecture Center</option>
              <option>Other / Unsure</option>
            </select>
          </div>
        </div>

        {type === "found" && (
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Do you still have the item?</label>
            <div className="flex gap-3">
              {["yes", "no"].map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasItem"
                    value={v}
                    checked={form.hasItem === v}
                    onChange={() => setForm({ ...form, hasItem: v })}
                    className="accent-[#500000]"
                  />
                  <span className="text-sm text-gray-700">{v === "yes" ? "Yes, I still have it" : "No, I handed it to a campus location"}</span>
                </label>
              ))}
            </div>
            {form.hasItem === "no" && (
              <p className="mt-2 text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                The item will not appear as "Ready for pickup" until the receiving location confirms receipt.
              </p>
            )}
          </div>
        )}

        <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <div className="text-sm text-gray-600 font-medium">Add a photo <span className="font-normal text-gray-400">(optional)</span></div>
            <div className="text-xs text-gray-400">PNG, JPG up to 10MB</div>
          </div>
        </div>

        <button
          onClick={() => setSubmitted(true)}
          className="w-full bg-[#500000] text-white rounded-lg py-3 text-sm font-semibold hover:bg-[#3a0000] transition-colors"
        >
          Submit Report
        </button>
      </div>
    </div>
  );
}

function ActivityView() {
  const lostReports = [
    { id: "LR-8821", name: "AirPods Pro Case", date: "Sep 5, 2026", status: "match", matchId: "TAMU-930128" },
    { id: "LR-8754", name: "Texas A&M Lanyard", date: "Aug 28, 2026", status: "open" },
  ];
  const foundReports = [
    { id: "FR-4421", name: "Navy Umbrella", date: "Sep 12, 2026", status: "open" },
  ];
  const claims = [
    { id: "CLM-1109", name: "Black Hydroflask 32oz", date: "Sep 13, 2026", status: "review" },
  ];

  const claimStatus: Record<string, string> = {
    open: "Open",
    match: "Possible Match",
    review: "Claim Under Review",
    approved: "Approved for Pickup",
    returned: "Returned",
  };
  const claimColors: Record<string, string> = {
    open: "bg-gray-100 text-gray-600",
    match: "bg-blue-100 text-blue-800",
    review: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    returned: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'DM Serif Display', serif" }}>My Activity</h1>

      {/* Possible match alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start justify-between gap-4">
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">Possible match found for "AirPods Pro Case"</div>
            <div className="text-xs text-gray-500 mt-0.5">A suggested match does not confirm ownership. Review the item and submit a claim if it looks right.</div>
          </div>
        </div>
        <button className="shrink-0 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
          Review Item
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Lost Reports */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Lost Reports</h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {lostReports.map((r, i) => (
              <div key={r.id} className={`flex items-center justify-between p-4 ${i !== 0 ? "border-t border-gray-100" : ""}`}>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{r.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Reported {r.date} · {r.id}</div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${claimColors[r.status]}`}>
                  {claimStatus[r.status]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Found Reports */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Found Reports</h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {foundReports.map((r, i) => (
              <div key={r.id} className={`flex items-center justify-between p-4 ${i !== 0 ? "border-t border-gray-100" : ""}`}>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{r.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Reported {r.date} · {r.id}</div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${claimColors[r.status]}`}>
                  {claimStatus[r.status]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Claims */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">My Claims</h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {claims.map((r, i) => (
              <div key={r.id} className={`flex items-center justify-between p-4 ${i !== 0 ? "border-t border-gray-100" : ""}`}>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{r.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Submitted {r.date} · {r.id}</div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${claimColors[r.status]}`}>
                  {claimStatus[r.status]}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StaffView() {
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Staff Workspace</div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>Zachry Engineering Center</h1>
        </div>
        <button className="flex items-center gap-2 bg-[#500000] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#3a0000] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Found Item
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Items in Storage", value: "4", color: "text-gray-900" },
          { label: "Pending Claims", value: "1", color: "text-amber-700" },
          { label: "Completed Returns", value: "12", color: "text-green-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Inventory</h2>
            <input
              type="text"
              placeholder="Search items…"
              className="border border-gray-200 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#500000]/30 w-44"
            />
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Item</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Received</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {STAFF_ITEMS.map((item, i) => (
                  <tr key={item.id} className={`border-t border-gray-100 hover:bg-gray-50 transition-colors ${i === 0 ? "border-t-0" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={item.thumb} alt="" className="w-9 h-9 rounded-md object-cover bg-gray-100" />
                        <div>
                          <div className="font-medium text-gray-900 text-xs">{item.category}</div>
                          <div className="text-[11px] text-gray-400">{item.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{item.id}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{item.received}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3">
                      {item.claims > 0 ? (
                        <button
                          onClick={() => setSelectedClaim(item.id)}
                          className="text-xs font-semibold text-[#500000] hover:underline"
                        >
                          Review Claim
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Claim review panel */}
        <div>
          {selectedClaim ? (
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Claim Review</h3>
                <button onClick={() => setSelectedClaim(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-400 font-mono mb-4">{selectedClaim}</div>
              <div className="space-y-3 mb-5">
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Claimant</div>
                  <div className="text-sm font-medium text-gray-900">Revell Aggie</div>
                  <div className="text-xs text-gray-400">aggie@tamu.edu · UIN 123004567</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Ownership Description</div>
                  <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2.5 leading-relaxed">
                    Matte black, has a small dent on the bottom from dropping it. I lost it between 2–4pm on Tuesday in Zachry 264. No stickers on it.
                  </div>
                </div>
              </div>
              <div className="space-y-2.5">
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="w-full bg-green-600 text-white rounded-lg py-2 text-xs font-semibold hover:bg-green-700 transition-colors"
                >
                  Approve — Send Pickup Instructions
                </button>
                <button className="w-full border border-gray-300 text-gray-700 rounded-lg py-2 text-xs font-medium hover:bg-gray-50 transition-colors">
                  Request More Information
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
              <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm text-gray-400">Select a claim to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("browse");
  const [selectedItem, setSelectedItem] = useState(ITEMS[0].id);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header view={view} setView={setView} />
      <main className="flex-1">
        {view === "browse" && <BrowseView setView={setView} setSelectedItem={setSelectedItem} />}
        {view === "detail" && <DetailView itemId={selectedItem} setView={setView} />}
        {view === "report" && <ReportView setView={setView} />}
        {view === "activity" && <ActivityView />}
        {view === "staff" && <StaffView />}
        {view === "claim-submitted" && <ActivityView />}
      </main>
      <Footer />
    </div>
  );
}
