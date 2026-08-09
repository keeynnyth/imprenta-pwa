interface StatCardProps {
  titulo: string;

  valorBs: number;
  valorUsd: number;

  color: "green" | "red" | "blue" | "gray";
}

export default function StatCard({
  titulo,
  valorBs,
  valorUsd,
  color,
}: StatCardProps) {
  const colores = {
    green: "border-green-500",
    red: "border-red-500",
    blue: "border-blue-500",
    gray: "border-gray-400",
  };

  const formatear = (
    valor: number,
    moneda: "Bs" | "USD"
  ) =>
    `${new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor)} ${moneda}`;

  return (
    <div
      className={`rounded-lg border-l-4 ${colores[color]} bg-white p-5 shadow`}
    >
      <p className="text-sm text-gray-500">
        {titulo}
      </p>

      <div className="mt-3 space-y-1">
        <p className="text-xl font-bold">
          {formatear(valorBs, "Bs")}
        </p>

        <p className="text-base font-medium text-gray-600">
          {formatear(valorUsd, "USD")}
        </p>
      </div>
    </div>
  );
}
