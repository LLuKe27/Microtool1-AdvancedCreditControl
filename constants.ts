import { CategoryDef } from './types';

export const TOTAL_CREDIT_LIMIT = 200; // Limite Total conforme diagrama

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'transport',
    title: 'Transporte',
    color: 'text-cyan-400',
    barColor: 'bg-cyan-500',
    limitEstimate: 70, // Atualizado para 70,00
  },
  {
    id: 'essential',
    title: 'Gasto Essencial',
    color: 'text-emerald-400',
    barColor: 'bg-emerald-500',
    limitEstimate: 80, // Atualizado para 80,00
  },
  {
    id: 'virtual',
    title: 'Gastos Virtuais',
    color: 'text-purple-400',
    barColor: 'bg-purple-500',
    limitEstimate: 25, // Atualizado para 25,00
  },
  {
    id: 'variable',
    title: 'Gastos Variáveis',
    color: 'text-orange-400',
    barColor: 'bg-orange-500',
    limitEstimate: 35, // Atualizado para 35,00
  },
];
