import React, { useState, useEffect } from 'react';
import api from '../lib/axios';

export function CategoryFilter({ onCategorySelect, selectedCategory }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/v1/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            <button
                onClick={() => onCategorySelect(null)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === null
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                All Products
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onCategorySelect(category.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === category.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
