import { ExternalLink } from "lucide-react";

interface Group {
  _id: string;
  name: string;
  platform: string;
  link?: string;
  platformColor: string;
  platformBg: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  description: string;
}

export const GroupCard = ({ group }: { group: Group }) => {
  const Icon = group.icon;
  return (
    <div
      key={group._id}
      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`w-11 md:w-12 h-11 md:h-12 rounded-xl ${group.iconBg} flex items-center justify-center shrink-0`}
          >
            <Icon className={`${group.iconColor} size-5 md:size-6`} />
          </div>
          <div>
            <h4 className="text-[14px] md:text-[15px] lg:text-[16px] font-bold text-slate-900">
              {group.name}
            </h4>
            <p
              className={`text-[10px] md:text-[11px] lg:text-[12px] font-medium ${group.platformColor} ${group.platformBg} px-2 py-0.5 rounded-md inline-block mt-1 uppercase tracking-tight`}
            >
              {group.platform}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-[12px] md:text-[13px] lg:text-[14px] text-slate-600 leading-relaxed">
        {group.description}
      </p>

      {/* Join Button */}
      <button
        onClick={() => group.link && window.open(group.link, "_blank")}
        className="w-full bg-primary hover:bg-primary/90 text-white text-[12px] md:text-[13px] lg:text-[14px] font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer"
      >
        Join Group
        <ExternalLink size={18} />
      </button>
    </div>
  );
};
