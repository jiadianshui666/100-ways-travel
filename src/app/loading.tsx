export default function RootLoading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 mx-auto border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin" />
        <p className="text-sm text-dark-400">正在加载...</p>
      </div>
    </div>
  );
}
