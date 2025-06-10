'use client'

import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    query,
    where,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function Depoimentos() {
    const [depoimentos, setDepoimentos] = useState([]);
    const [form, setForm] = useState({
        nome: "",
        cidade: "",
        mensagem: "",
        nota: "",
        tituloNota: "",
    });
    const [statusMsg, setStatusMsg] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [expandedIds, setExpandedIds] = useState([]);

    const notaMensagens = {
        1: "Péssimo.",
        2: "Muito ruim.",
        3: "Ruim.",
        4: "Ruim mas pode melhorar.",
        5: "Nada demais.",
        6: "Muito bom!",
        7: "Incrível!",
        8: "Muito Incrível!",
        9: "Excelente, ambiente agradável!",
        10: "Perfeito, super recomendo!!!",
    };

    useEffect(() => {
        setCurrentPage(0);
    }, [depoimentos]);

    useEffect(() => {
        const fetchDepoimentos = async () => {
            const q = query(
                collection(db, "depoimentos"),
                where("status", "==", "aceito")
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => {
                const d = doc.data();
                return {
                    id: doc.id,
                    nome: d.nome,
                    cidade: d.cidade,
                    mensagem: d.mensagem,
                    dataEnvio: d.dataEnvio,
                    nota: d.nota || "",
                    tituloNota: d.tituloNota || "",
                };
            });
            setDepoimentos(data);
        };

        fetchDepoimentos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "nota") {
            setForm((prev) => ({
                ...prev,
                nota: value,
                tituloNota: notaMensagens[value] || "",
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.nome || !form.cidade || !form.mensagem) {
            setStatusMsg("Preencha todos os campos.");
            return;
        }

        try {
            await addDoc(collection(db, "depoimentos"), {
                ...form,
                status: "pendente",
                dataEnvio: serverTimestamp(),
            });
            setForm({
                nome: "",
                cidade: "",
                mensagem: "",
                nota: "",
                tituloNota: "",
            });
            setStatusMsg("Seu depoimento foi enviado para aprovação!");
        } catch (error) {
            console.error("Erro ao enviar depoimento:", error);
            setStatusMsg("Erro ao enviar. Tente novamente.");
        }
    };

    const toggleExpand = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    return (
        <section
            className="bg-[#FFD675] py-16 px-6 md:px-10 text-black pt-[90px] pb-[35px]"
            aria-labelledby="depoimentos-heading"
        >
            <div className="max-w-7xl mx-auto">
                <h2
                    id="depoimentos-heading"
                    className="text-3xl md:text-4xl font-bold text-center mb-12"
                >
                    O que dizem nossos hóspedes
                </h2>

                {depoimentos.length === 0 ? (
                    <p className="text-center text-black/70">Nenhum depoimento ainda.</p>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            {depoimentos
                                .slice(currentPage * 3, currentPage * 3 + 3)
                                .map((dep) => {
                                    const isExpanded = expandedIds.includes(dep.id);
                                    const limit = 280;
                                    const isLong = dep.mensagem.length > limit;
                                    const displayText = isExpanded
                                        ? dep.mensagem
                                        : dep.mensagem.slice(0, limit);

                                    return (
                                        <div
                                            key={dep.id}
                                            className="bg-[#0F0A0B] text-white rounded-2xl shadow-lg p-6 flex flex-col justify-between transition-transform hover:scale-[1.02]"
                                        >


                                            {(dep.nota && dep.tituloNota) && (
                                                <div className="mb-4 flex items-center gap-2">
                                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#0F0A0B] text-sm font-bold">
                                                        {parseFloat(dep.nota).toFixed(1)}
                                                    </div>
                                                    <div className="text-[#FFD675] font-semibold text-sm">{dep.tituloNota}</div>
                                                </div>
                                            )}
                                            <p className="text-base mb-4 italic leading-relaxed">
                                                “{displayText}
                                                {isLong && !isExpanded ? "..." : ""}
                                                ”
                                            </p>



                                            {isLong && (
                                                <button
                                                    onClick={() => toggleExpand(dep.id)}
                                                    className="text-sm text-[#FFD675] hover:underline mb-2 text-left"
                                                >
                                                    {isExpanded ? "Ver menos" : "Ver mais"}
                                                </button>
                                            )}

                                            <div className="mt-auto text-sm border-t border-white/20 pt-3">
                                                <p className="font-semibold">{dep.nome}</p>
                                                <p className="text-xs text-white/70">{dep.cidade}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Dots */}
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: Math.ceil(depoimentos.length / 3) }).map(
                                (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i)}
                                        className={`h-3 w-3 rounded-full transition-all ${currentPage === i ? "bg-[#0F0A0B]" : "bg-[#0F0A0B]/40"
                                            }`}
                                        aria-label={`Ir para página ${i + 1}`}
                                    />
                                )
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-14 text-center">
                    <button
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        className=" cursor-pointer inline-block bg-[#0F0A0B] text-white px-8 py-3 rounded-full text-base font-semibold hover:bg-[#1a1a1a] transition"
                    >
                        Quero deixar meu depoimento
                    </button>
                </div>

                <div
                    className={`transition-all duration-700 overflow-hidden mt-10 ${mostrarFormulario ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <form
                        onSubmit={handleSubmit}
                        className="bg-[#0F0A0B] text-white p-8 rounded-xl shadow-xl max-w-2xl mx-auto"
                        aria-label="Formulário de depoimento"
                    >
                        <h3 className="text-2xl font-bold mb-6 text-white  text-center text-[#FFD675]">
                            Deixe seu depoimento
                        </h3>

                        <div className="space-y-2 ">
                            <h4 className="text-lg font-semibold text-[#FFD675]">Nome</h4>
                            <input
                                type="text"
                                name="nome"
                                placeholder="Seu nome"
                                value={form.nome}
                                onChange={handleChange}
                                className="w-full p-3 border border-white bg-[#0F0A0B] text-white rounded-lg focus:ring-2 focus:ring-white outline-none"
                                aria-label="Nome"
                            />
                            <h4 className="text-lg font-semibold text-[#FFD675] mt-2">Cidade</h4>
                            <input
                                type="text"
                                name="cidade"
                                placeholder="Cidade e estado (ex: Serra do Cipó - MG)"
                                value={form.cidade}
                                onChange={handleChange}
                                className="w-full p-3 border border-white bg-[#0F0A0B] text-white rounded-lg focus:ring-2 focus:ring-white outline-none"
                                aria-label="Cidade"
                            />
                            {/* Avaliar */}
                            <div className="space-y-2 mt-2">
                                <h4 className="text-lg font-semibold text-[#FFD675]">Avaliar</h4>

                                {/* Campo de nota acima */}
                                <select
                                    name="nota"
                                    value={form.nota}
                                    onChange={handleChange}
                                    className="w-full md:w-1/3 p-3 border border-white bg-[#0F0A0B] text-white rounded-lg focus:ring-2 focus:ring-white outline-none"
                                    aria-label="Nota"
                                >
                                    <option value="">Selecione a nota</option>
                                    {[...Array(10)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1} - {notaMensagens[i + 1]}
                                        </option>
                                    ))}
                                </select>

                                {/* Campo de mensagem abaixo (exemplo) */}
                                <textarea
                                    name="mensagem"
                                    value={form.mensagem}
                                    onChange={handleChange}
                                    placeholder="Digite sua mensagem"
                                    className="w-full p-3 border border-white bg-[#0F0A0B] text-white rounded-lg focus:ring-2 focus:ring-white outline-none"
                                    rows={4}
                                />
                            </div>
                        </div>

                        {statusMsg && (
                            <p
                                className={`mt-6 text-center ${statusMsg.includes("erro") ? "text-red-500" : "text-green-500"
                                    }`}
                                role="alert"
                            >
                                {statusMsg}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="cursor-pointer mt-6 w-full bg-[#FFD675] text-[#0F0A0B] font-bold py-3 rounded-full hover:bg-yellow-400 transition"
                        >
                            Enviar depoimento
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
