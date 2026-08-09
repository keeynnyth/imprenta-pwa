import { useEffect, useState } from "react";

import StatCard from "../../components/finance/StatCard";

import {
  obtenerResumenFinanciero,
  type ResumenFinanciero,
} from "../../services/movimientos.service";

export default function FinanceDashboardPage() {
  const [resumen, setResumen] =
    useState<ResumenFinanciero | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarResumen();
  }, []);

  async function cargarResumen() {
    try {
      const data =
        await obtenerResumenFinanciero();

      setResumen(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        Cargando resumen financiero...
      </div>
    );
  }

  if (!resumen) {
    return (
      <div className="p-8 text-red-600">
        No fue posible cargar el resumen financiero.
      </div>
    );
  }

  const gananciaHoyBs =
    resumen.ingresos_hoy_bs -
    resumen.egresos_hoy_bs;

  const gananciaHoyUsd =
    resumen.ingresos_hoy_usd -
    resumen.egresos_hoy_usd;

  const gananciaSemanaBs =
    resumen.ingresos_semana_bs -
    resumen.egresos_semana_bs;

  const gananciaSemanaUsd =
    resumen.ingresos_semana_usd -
    resumen.egresos_semana_usd;

  const gananciaMesBs =
    resumen.ingresos_mes_bs -
    resumen.egresos_mes_bs;

  const gananciaMesUsd =
    resumen.ingresos_mes_usd -
    resumen.egresos_mes_usd;

  const gananciaAnioBs =
    resumen.ingresos_anio_bs -
    resumen.egresos_anio_bs;

  const gananciaAnioUsd =
    resumen.ingresos_anio_usd -
    resumen.egresos_anio_usd;

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Finanzas
        </h1>

        <p className="text-gray-500">
          Resumen financiero de la empresa.
        </p>
      </div>

      {/* Hoy */}

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Hoy
        </h2>

        <div className="grid gap-4 md:grid-cols-4">

          <StatCard
            titulo="Ingresos"
            valorBs={resumen.ingresos_hoy_bs}
            valorUsd={resumen.ingresos_hoy_usd}
            color="green"
          />

          <StatCard
            titulo="Egresos"
            valorBs={resumen.egresos_hoy_bs}
            valorUsd={resumen.egresos_hoy_usd}
            color="red"
          />

          <StatCard
            titulo="Ganancia"
            valorBs={gananciaHoyBs}
            valorUsd={gananciaHoyUsd}
            color="blue"
          />

          <StatCard
            titulo="Saldo"
            valorBs={resumen.saldo_bs}
            valorUsd={resumen.saldo_usd}
            color="gray"
          />

        </div>
      </section>

      {/* Semana */}

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Esta semana
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <StatCard
            titulo="Ingresos"
            valorBs={resumen.ingresos_semana_bs}
            valorUsd={resumen.ingresos_semana_usd}
            color="green"
          />

          <StatCard
            titulo="Egresos"
            valorBs={resumen.egresos_semana_bs}
            valorUsd={resumen.egresos_semana_usd}
            color="red"
          />

          <StatCard
            titulo="Ganancia"
            valorBs={gananciaSemanaBs}
            valorUsd={gananciaSemanaUsd}
            color="blue"
          />

        </div>
      </section>

      {/* Mes */}

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Este mes
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <StatCard
            titulo="Ingresos"
            valorBs={resumen.ingresos_mes_bs}
            valorUsd={resumen.ingresos_mes_usd}
            color="green"
          />

          <StatCard
            titulo="Egresos"
            valorBs={resumen.egresos_mes_bs}
            valorUsd={resumen.egresos_mes_usd}
            color="red"
          />

          <StatCard
            titulo="Ganancia"
            valorBs={gananciaMesBs}
            valorUsd={gananciaMesUsd}
            color="blue"
          />

        </div>
      </section>

      {/* Año */}

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Este año
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <StatCard
            titulo="Ingresos"
            valorBs={resumen.ingresos_anio_bs}
            valorUsd={resumen.ingresos_anio_usd}
            color="green"
          />

          <StatCard
            titulo="Egresos"
            valorBs={resumen.egresos_anio_bs}
            valorUsd={resumen.egresos_anio_usd}
            color="red"
          />

          <StatCard
            titulo="Ganancia"
            valorBs={gananciaAnioBs}
            valorUsd={gananciaAnioUsd}
            color="blue"
          />

        </div>
      </section>

    </div>
  );
}