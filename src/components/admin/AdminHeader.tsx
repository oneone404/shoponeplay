"use client"

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  rightElement?: React.ReactNode;
}

export default function AdminHeader({ title, subtitle, description, rightElement }: AdminHeaderProps) {
  const supportingText = subtitle ?? description;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-tighter">{title}</h1>
        {supportingText && (
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">
            {supportingText}
          </p>
        )}
      </div>
      {rightElement && (
        <div className="flex items-center gap-3 self-start md:self-auto md:ml-auto">
          {rightElement}
        </div>
      )}
    </div>
  );
}
