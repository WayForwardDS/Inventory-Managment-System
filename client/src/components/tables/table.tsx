import { ReactNode } from "react";

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table = ({ children, className }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full border-collapse border border-gray-300", className)}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children }: TableProps) => {
  return <thead className="bg-gray-200">{children}</thead>;
};

export const TableRow = ({ children }: TableProps) => {
  return <tr className="border-b border-gray-300">{children}</tr>;
};

export const TableHead = ({ children }: TableProps) => {
  return (
    <th className="px-4 py-2 font-semibold text-left text-gray-700 border border-gray-300">
      {children}
    </th>
  );
};

export const TableBody = ({ children }: TableProps) => {
  return <tbody>{children}</tbody>;
};

export const TableCell = ({ children }: TableProps) => {
  return <td className="px-4 py-2 border border-gray-300">{children}</td>;
};
