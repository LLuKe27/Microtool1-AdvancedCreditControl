import React, { useState, useMemo, useEffect } from 'react';
import { CreditCard, Calendar, Clock, AlertTriangle, Plus, Trash2, Loader2 } from 'lucide-react';
import { CATEGORIES, TOTAL_CREDIT_LIMIT } from './constants';
import { ExpenseItem, ModalState, CategoryId } from './types';
import { CategoryCard } from './components/CategoryCard';
import { ProgressBar } from './components/ProgressBar';
import { Modal } from './components/Modal';

const App: React.FC = () => {
  // State for expenses
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  
  // Modal State
  const [modal, setModal] = useState<ModalState>({ type: null });
  
  // Temporary state for the "Add" form
  const [newItemName, setNewItemName] = useState('');
  const [newItemValue, setNewItemValue] = useState('');

  // --- LOCAL STORAGE LOGIC ONLY ---

  const saveLocally = (data: ExpenseItem[]) => {
    try {
      localStorage.setItem('credit_control_data', JSON.stringify(data));
      localStorage.setItem('credit_control_updated', new Date().toISOString());
    } catch (e) {
      console.error('Failed to save locally', e);
    }
  };

  const loadLocally = (): ExpenseItem[] | null => {
    try {
      const stored = localStorage.getItem('credit_control_data');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  };

  // 1. Inicialização
  useEffect(() => {
    const localData = loadLocally();
    if (localData) {
      setExpenses(localData);
    }
    setIsLoadingInitial(false);
  }, []);

  // 2. Auto-save on change
  useEffect(() => {
    if (!isLoadingInitial) {
      saveLocally(expenses);
    }
  }, [expenses, isLoadingInitial]);

  // --- APP LOGIC ---

  const totalUsed = useMemo(() => expenses.reduce((acc, curr) => acc + curr.value, 0), [expenses]);
  const freeCredit = TOTAL_CREDIT_LIMIT - totalUsed;
  const progressPercentage = Math.min((totalUsed / TOTAL_CREDIT_LIMIT) * 100, 100);

  const openAddModal = (categoryId: CategoryId) => {
    setNewItemName('');
    setNewItemValue('');
    setModal({ type: 'add', categoryId });
  };

  const openDeleteModal = (itemId: string) => {
    setModal({ type: 'delete', itemId });
  };

  const openInfoModal = (itemId: string) => {
    setModal({ type: 'info', itemId });
  };

  const closeModal = () => {
    setModal({ type: null });
  };

  const handleAddItem = () => {
    if (!newItemName || !newItemValue || !modal.categoryId) return;
    
    const value = parseFloat(newItemValue.replace(',', '.'));
    if (isNaN(value) || value <= 0) return;

    const now = new Date();
    const newItem: ExpenseItem = {
      id: crypto.randomUUID(),
      name: newItemName,
      value: value,
      date: now.toISOString().split('T')[0],
      createdAt: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      categoryId: modal.categoryId,
    };

    const updatedExpenses = [newItem, ...expenses];
    setExpenses(updatedExpenses);
    closeModal();
  };

  const handleDeleteItem = () => {
    if (!modal.itemId) return;
    const updatedExpenses = expenses.filter(item => item.id !== modal.itemId);
    setExpenses(updatedExpenses);
    closeModal();
  };

  const getSelectedItem = () => {
    return expenses.find(e => e.id === modal.itemId);
  };

  if (isLoadingInitial) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-gray-200 p-4 md:p-8 flex flex-col items-center">
      
      {/* Top Header & Main Progress */}
      <div className="w-full max-w-6xl mb-10 space-y-6">
        
        <header className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/20 rounded-xl border border-primary/20">
            <CreditCard className="text-primary w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Controle Avançado</h1>
            <p className="text-gray-500 text-sm">Gerenciamento inteligente de faturas</p>
          </div>
        </header>

        {/* Global Progress Bar Section */}
        <section className="bg-surfaceHighlight/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Livre Crédito</span>
              <div className="text-3xl font-mono text-emerald-400 font-bold mt-1 tracking-tight">
                R$ {freeCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-right">
               <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Limite Total</span>
               <div className="text-xl font-mono text-white mt-1">
                R$ {TOTAL_CREDIT_LIMIT.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
               </div>
            </div>
          </div>
          <ProgressBar current={totalUsed} max={TOTAL_CREDIT_LIMIT} heightClass="h-8" colorClass="bg-gradient-to-r from-blue-600 to-purple-600" />
           <div className="mt-3 flex justify-between items-center">
             <span className="text-xs text-gray-600">Armazenamento local automático</span>
             <div className="text-xs text-gray-400 font-medium bg-black/40 px-2 py-1 rounded">
               {progressPercentage.toFixed(1)}% utilizado
             </div>
           </div>
        </section>
      </div>

      {/* Categories Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            expenses={expenses.filter(e => e.categoryId === category.id)}
            onAddClick={openAddModal}
            onDeleteClick={openDeleteModal}
            onInfoClick={openInfoModal}
          />
        ))}
      </div>

      {/* --- MODALS --- */}

      {/* Add Item Modal */}
      <Modal 
        isOpen={modal.type === 'add'} 
        onClose={closeModal} 
        title="Adicionar Nova Despesa"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-1 ml-1">Nome do Item / Evento</label>
            <div className="relative">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Ex: Jantar, Uber, Assinatura"
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-1 ml-1">Valor (R$)</label>
            <input
              type="number"
              value={newItemValue}
              onChange={(e) => setNewItemValue(e.target.value)}
              placeholder="0,00"
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <button 
            onClick={handleAddItem}
            className="w-full bg-primary hover:bg-violet-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-violet-900/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Plus size={18} />
            Adicionar ao Histórico
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={modal.type === 'delete'} 
        onClose={closeModal} 
        title="Confirmar Exclusão"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
            <AlertTriangle className="text-red-500 w-8 h-8" />
          </div>
          <p className="text-gray-300">
            Você tem certeza que deseja remover este item do histórico?
            <br />
            <span className="text-sm text-gray-500">Essa ação afetará o cálculo do limite disponível.</span>
          </p>
          <div className="flex gap-3 w-full mt-4">
            <button 
              onClick={closeModal}
              className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleDeleteItem}
              className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Sim, Excluir
            </button>
          </div>
        </div>
      </Modal>

      {/* Info Modal */}
      <Modal 
        isOpen={modal.type === 'info'} 
        onClose={closeModal} 
        title="Detalhes do Registro"
      >
        {getSelectedItem() && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Date Box */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
                <span className="text-xs uppercase text-gray-500 font-bold flex items-center gap-1">
                  <Calendar size={12} /> Data
                </span>
                <span className="text-xl font-mono text-white">
                  {new Date(getSelectedItem()!.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              {/* Time Box */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
                <span className="text-xs uppercase text-gray-500 font-bold flex items-center gap-1">
                  <Clock size={12} /> Horário
                </span>
                <span className="text-xl font-mono text-white">
                  {getSelectedItem()!.createdAt}
                </span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-gray-400 text-sm">Item:</span>
                 <span className="text-white font-medium">{getSelectedItem()!.name}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-gray-400 text-sm">Valor:</span>
                 <span className="text-emerald-400 font-bold">R$ {getSelectedItem()!.value.toFixed(2)}</span>
               </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default App;
