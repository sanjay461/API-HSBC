import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Filters from './Filters';

const Dashboard = ({ token }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/aggregate/customer', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setData(response.data);
                setFilteredData(response.data);  // Initialize filtered data
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [token]);

    const handleApplyFilters = async (filters) => {
        const { category, minAmount, maxAmount, stepStart, stepEnd } = filters;
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/data', {
                headers: { Authorization: `Bearer ${token}` },
                params: { category, min_amount: minAmount, max_amount: maxAmount, step_start: stepStart, step_end: stepEnd }
            });
            setFilteredData(response.data);
        } catch (error) {
            console.error("Error applying filters", error);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div>
            <h2>Dashboard</h2>
            <Filters onApply={handleApplyFilters} />
            
            <h3>Bar Chart: Total Spent by Customer</h3>
            <BarChart width={600} height={300} data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="customer" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_spent" fill="#8884d8" />
            </BarChart>
            
            <h3>Line Chart: Transaction Amount Over Time (Steps)</h3>
            <LineChart width={600} height={300} data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
            </LineChart>

            <h3>Pie Chart: Transaction Amount by Category</h3>
            <PieChart width={400} height={400}>
                <Pie
                    data={filteredData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                >
                    {filteredData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    );
};

export default Dashboard;