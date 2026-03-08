import { Grid3X3 } from "lucide-react";

const sizes = [
  { value: 3, label: "3×3" },
  { value: 5, label: "5×5" },
  { value: 7, label: "7×7" },
];

const BoardSizeSelector = ({ boardSize, onChange }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Grid3X3 className="w-3.5 h-3.5" />
        <span className="text-xs font-medium uppercase tracking-wider">Board Size</span>
      </div>
      <div className="flex rounded-lg border border-border overflow-hidden">
        {sizes.map((s) => (
          <button
            key={s.value}
            onClick={() => onChange(s.value)}
            className={`px-4 py-2 text-sm font-semibold font-display transition-all ${
              boardSize === s.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BoardSizeSelector;
