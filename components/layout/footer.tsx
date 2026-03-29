export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span className="font-semibold text-slate-600">Repurpose</span>
          </div>
          <p className="text-sm text-slate-500">
            Turn one piece of content into 10+ assets.
          </p>
        </div>
      </div>
    </footer>
  );
}