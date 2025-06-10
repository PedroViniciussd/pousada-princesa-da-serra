export default function DepoimentoCard({ depoimento, aceitar, rejeitar }) {
    return (
        <div className="bg-black border border-[#FFD675] p-4 rounded-xl shadow-lg">
            <p className="italic text-lg mb-2">"{depoimento.mensagem}"</p>
            <p className="text-sm text-gray-400 mb-4">
                <strong>{depoimento.nome}</strong> - {depoimento.cidade}
            </p>
            <div className="flex gap-4">
                <button onClick={aceitar} className="bg-green-600 px-4 py-1 rounded hover:bg-green-700">Aceitar</button>
                <button onClick={rejeitar} className="bg-red-600 px-4 py-1 rounded hover:bg-red-700">Rejeitar</button>
            </div>
        </div>
    );
}
