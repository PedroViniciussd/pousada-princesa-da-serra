import { Suspense } from "react";
import ConfirmarPagamentoClient from "./ConfirmarPagamentoClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Carregando...</div>}>
      <ConfirmarPagamentoClient />
    </Suspense>
  );
}
