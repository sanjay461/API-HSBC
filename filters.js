import React, { useState } from 'react';

const Filters = ({ onApply }) => {
    const [category, setCategory] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [stepStart, setStepStart] = useState('');
    const [stepEnd, setStepEnd] = useState('');

    const handleApply = () => {
        onApply({ category, minAmount, maxAmount, stepStart, stepEnd });
    };

    return (
        <div>
            <h3>Filters</h3>
            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input type="number" placeholder="Min Amount" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
            <input type="number" placeholder="Max Amount" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
            <input type="number" placeholder="Step Start" value={stepStart} onChange={(e) => setStepStart(e.target.value)} />
            <input type="number" placeholder="Step End" value={stepEnd} onChange={(e) => setStepEnd(e.target.value)} />
            <button onClick={handleApply}>Apply Filters</button>
        </div>
    );
};

export default Filters;