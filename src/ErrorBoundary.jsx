import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Nusantara OceanWatch Runtime Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-xl w-full bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 text-2xl">
                ⚠️
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Nusantara OceanWatch — Pemulihan Sistem</h1>
                <p className="text-xs text-slate-400">Terjadi kendala saat memuat antarmuka aplikasi.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto max-h-40 overflow-y-auto">
              {this.state.error?.toString()}
              {this.state.errorInfo?.componentStack && (
                <div className="mt-2 text-[10px] text-slate-400">
                  {this.state.errorInfo.componentStack}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                  } catch (e) {
                    // ignore
                  }
                  window.location.reload();
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Muat Ulang Aplikasi
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
