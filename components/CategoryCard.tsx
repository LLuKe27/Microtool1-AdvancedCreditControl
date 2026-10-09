import React from 'react';
import { Plus, Info, X } from 'lucide-react';
import { CategoryDef, ExpenseItem } from '../types';
import { ProgressBar } from './ProgressBar';

interface CategoryCardProps {
  category: CategoryDef;
  expenses: ExpenseItem[];
  onAddClick: (categoryId: string) => void;
  onDeleteClick: (itemId: string) => void;
  onInfoClick: (itemId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  expenses,
  onAddClick,
  onDeleteClick,
  onInfoClick,
}) => {
  const totalValue = expenses.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-surface border border-white/5 rounded-xl p-5 shadow-lg flex flex-col h-[400px]">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${category.barColor}`}></div>
        <h2 className={`uppercase text-xs tracking-widest font-bold ${category.color}`}>
          {category.title}
        </h2>
      </div>

      {/* Mini Bar Section */}
      <div className="bg-black/20 p-3 rounded-lg border border-white/5 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onAddClick(category.id)}
            className="flex items-center justify-center w-8 h-8 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white"
            aria-label="Adicionar despesa"
          >
            <Plus size={16} />
          </button>
          
          <div className="flex-1 flex flex-col justify-center">
             <div className="flex justify-between items-end mb-1 px-1">
               <span className="text-[10px] text-gray-500 uppercase">Progresso</span>
               <span className="text-[10px] text-gray-600 font-medium">
                 Meta: R$ {category.limitEstimate.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
               </span>
             </div>
             <ProgressBar 
               current={totalValue} 
               max={category.limitEstimate} 
               colorClass={category.barColor} 
               heightClass="h-2"
             />
          </div>

          <div className="text-right min-w-[70px]">
            <span className="text-sm font-bold text-white block">
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* History Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-2 px-1">
          <div className="h-[1px] flex-1 bg-white/10"></div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Área de Histórico</span>
          <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 border border-white/5 rounded-lg bg-black/20 p-2">
          {expenses.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-600 text-xs italic">
              Nenhum registro
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.map((item) => (
                <div key={item.id} className="group flex items-center gap-2 bg-surfaceHighlight/50 hover:bg-surfaceHighlight p-2 rounded border border-white/5 transition-colors">
                  
                  {/* Name Input/Display */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-gray-300 truncate">
                      {item.name}
                    </div>
                  </div>

                  {/* Value Input/Display */}
                  <div className="w-24">
                     <div className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-gray-300 text-right">
                      R$ {item.value.toFixed(2)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => onInfoClick(item.id)}
                      className="p-1 rounded bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 text-gray-500 border border-white/10 transition-colors"
                      title="Mais detalhes"
                    >
                      <Info size={10} />
                    </button>
                    <button 
                      onClick={() => onDeleteClick(item.id)}
                      className="p-1 rounded bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-500 border border-white/10 transition-colors"
                      title="Excluir"
                    >
                      <X size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
