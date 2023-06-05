

import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import React, { ChangeEvent } from 'react';
import Input from '../../../../../shared/inputs/Input';
import { twMerge } from 'tailwind-merge';

export interface IExitStrategyInput {
  isPercentage: boolean;
  value: number;
  onChange: (newValue: number) => void;
}

export default function ExitStrategyInput({ isPercentage, value, onChange }: IExitStrategyInput) {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value ?? 0);
    if (isPercentage) {
      if (value > 100) {
        onChange(100);
      } else if (value < 0) {
        onChange(0);
      } else {
        onChange(value);
      }
    } else {
      onChange(value);
    }
  };

  const handleIncrement = () => {
    let newValue = value + 1;
    if (isPercentage && (newValue > 100)) {
      newValue = 100;
    }
    onChange(newValue);
  };

  const handleDecrement = () => {
    let newValue = value - 1;
    if (newValue < 0) {
      newValue = 0;
    }
    onChange(newValue);
  };

  const onKeyDown = (e: any) => {
    if (!e)
      return;
    if ((e.code === 'Minus' && e.keyCode === 189 && e.key === '-') || (e.keyCode === 187 && e.key === '+')
      || (e.code === 'KeyE' && e.keyCode === 69 && e.key === 'e')) {
      e.preventDefault();
    }
  }

  return (
    <div className='flex items-center justify-between flex-1'>
      <button className='px-4' onClick={handleDecrement}>
        <MinusIcon className='w-4' />
      </button>
      <div className='flex items-center'>
        <Input
          type="number"
          value={value}
          onChange={handleChange}
          className={twMerge('p-0 bg-transparent border-0 text-center text-blue-1 md:w-6')}
          max={isPercentage ? 100 : undefined}
          min={0}
          onKeyDown={onKeyDown}
        />
        {isPercentage && <span className='text-blue-1'>%</span>}
      </div>
      <button className='px-4' onClick={handleIncrement}>
        <PlusIcon className='w-4' />
      </button>
    </div>
  );
}