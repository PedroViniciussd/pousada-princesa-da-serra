import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { doc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function ReservaCard({ titulo, reservas }) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const porPagina = 5;
    const [filtroNome, setFiltroNome] = useState("");
    const [filtroCheckin, setFiltroCheckin] = useState("");
    const [filtroCheckout, setFiltroCheckout] = useState("");

    const reservasFiltradas = reservas.filter((r) => {
        const nome = r.nome?.toLowerCase() || "";
        const checkin = r.checkin?.toDate?.();
        const checkout = r.checkout?.toDate?.();

        const nomeInclui = nome.includes(filtroNome.toLowerCase());

        const checkinInclui = filtroCheckin ? (() => {
            const [ano, mes, dia] = filtroCheckin.split('-').map(Number);
            const inicio = new Date(ano, mes - 1, dia, 0, 0, 0);
            const fim = new Date(ano, mes - 1, dia, 23, 59, 59, 999);
            return checkin && checkin >= inicio && checkin <= fim;
        })() : true;

        const checkoutInclui = filtroCheckout ? (() => {
            const [ano, mes, dia] = filtroCheckout.split('-').map(Number);
            const inicio = new Date(ano, mes - 1, dia, 0, 0, 0);
            const fim = new Date(ano, mes - 1, dia, 23, 59, 59, 999);
            return checkout && checkout >= inicio && checkout <= fim;
        })() : true;

        return nomeInclui && checkinInclui && checkoutInclui;
    });

    const totalPaginas = Math.ceil(reservasFiltradas.length / porPagina);
    const reservasPaginadas = reservasFiltradas.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);

    const handleCancelar = async (reserva) => {
        const confirmar = confirm('Tem certeza que deseja cancelar esta reserva?');
        if (!confirmar) return;

        try {
            await setDoc(doc(db, 'reservasCanceladas', reserva.id), {
                ...reserva,
                status: 'cancelado',
                canceladoEm: new Date(),
            });

            await deleteDoc(doc(db, 'reservas', reserva.id));
            window.location.reload();
        } catch (error) {
            console.error('Erro ao cancelar reserva:', error);
            alert('Erro ao cancelar a reserva. Tente novamente.');
        }
    };

    const handleConfirmar = async (reservaId) => {
        try {
            await updateDoc(doc(db, 'reservas', reservaId), {
                status: 'confirmada'
            });
            alert('Reserva confirmada com sucesso!');
            window.location.reload();
        } catch (error) {
            console.error('Erro ao confirmar reserva:', error);
            alert('Erro ao confirmar a reserva. Tente novamente.');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-[#FFD675] mb-4">{titulo}</h2>

            <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-end flex-wrap">
                <div className="flex flex-col">
                    <label className="text-[#FFD675] text-sm mb-1">Buscar por nome</label>
                    <input
                        type="text"
                        placeholder="Digite o nome..."
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                        className="p-2 rounded-md border text-[#FFD675] w-full md:w-64 bg-transparent"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-[#FFD675] text-sm mb-1">Check-in</label>
                    <input
                        type="date"
                        value={filtroCheckin}
                        onChange={(e) => setFiltroCheckin(e.target.value)}
                        className="p-2 rounded-md border w-full md:w-48 bg-transparent text-[#FFD675] placeholder-white text-sm"
                        style={{ colorScheme: "dark" }}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-[#FFD675] text-sm mb-1">Check-out</label>
                    <input
                        type="date"
                        value={filtroCheckout}
                        onChange={(e) => setFiltroCheckout(e.target.value)}
                        className="p-2 rounded-md border w-full md:w-48 bg-transparent text-[#FFD675] placeholder-white text-sm"
                        style={{ colorScheme: "dark" }}
                    />
                </div>

                <button
                    onClick={() => {
                        setFiltroNome("");
                        setFiltroCheckin("");
                        setFiltroCheckout("");
                    }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition cursor-pointer"
                >
                    Limpar Filtros
                </button>
            </div>

            {reservasFiltradas.length === 0 ? (
                <p className="text-gray-400">Nenhuma reserva encontrada.</p>
            ) : (
                <>
                    {reservasPaginadas.map((reserva) => {
                        const entrada = reserva.checkin?.toDate?.();
                        const saida = reserva.checkout?.toDate?.();
                        const criadoEm = reserva.criadoEm?.toDate?.();
                        const canceladoEm = reserva.canceladoEm?.toDate?.();
                        const numeroWhatsApp = reserva.telefone?.replace(/\D/g, '');

                        const quartosSelecionados = Array.isArray(reserva.quartos) ? reserva.quartos : [];

                        return (
                            <div
                                key={reserva.id}
                                className="bg-[#1a1416] rounded-xl p-4 mb-4 shadow-md border border-[#FFD675]/20"
                            >
                                <p><strong>Nome:</strong> {reserva.nome}</p>
                                <p><strong>CPF:</strong> {reserva.cpf}</p>
                                <p><strong>Email:</strong> {reserva.email}</p>
                                <p><strong>Telefone:</strong> {reserva.telefone}</p>

                                <p><strong>Quartos:</strong></p>
                                <ul className="ml-4 list-disc">
                                    {quartosSelecionados.length > 0 ? (
                                        quartosSelecionados.map((q, i) => (
                                            <li key={i}>{q.quantidade}x {q.nome}</li>
                                        ))
                                    ) : (
                                        <li>Não informado</li>
                                    )}
                                </ul>

                                <p><strong>Quantidade de Pessoas:</strong> {reserva.quantidadePessoas}</p>
                                <p><strong>Valor Total:</strong> R$ {Number(reserva.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                <p><strong>Status:</strong> {reserva.status}</p>
                                <p><strong>Entrada:</strong> {entrada ? format(entrada, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR }) : '---'}</p>
                                <p><strong>Saída:</strong> {saida ? format(saida, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR }) : '---'}</p>
                                <p><strong>Criado em:</strong> {criadoEm ? format(criadoEm, "dd/MM/yyyy HH:mm", { locale: ptBR }) : '---'}</p>
                                {canceladoEm && (
                                    <p><strong>Cancelado em:</strong> {format(canceladoEm, "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                                )}

                                <div className="flex flex-wrap gap-4 mt-4">
                                    <a
                                        href={`https://wa.me/55${numeroWhatsApp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                                    >
                                        WhatsApp
                                    </a>

                                    {reserva.status === 'pendente' && (
                                        <button
                                            onClick={() => handleConfirmar(reserva.id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                        >
                                            Confirmar Reserva
                                        </button>
                                    )}

                                    {reserva.status !== 'cancelado' && (
                                        <button
                                            onClick={() => handleCancelar(reserva)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer"
                                        >
                                            Cancelar Reserva
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-center mt-6 gap-2">
                        {Array.from({ length: totalPaginas }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setPaginaAtual(i + 1)}
                                className={`cursor-pointer px-3 py-1 rounded-full ${paginaAtual === i + 1 ? 'bg-[#FFD675] text-black font-semibold' : 'bg-gray-700 text-white'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
