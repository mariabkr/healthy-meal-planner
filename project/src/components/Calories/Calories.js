import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell 
} from 'recharts';
import './Calories.css';

const Calories = () => {
  const [consumptionHistory, setConsumptionHistory] = useState([]);
  const [nutritionSummary, setNutritionSummary] = useState({
    calories: 0,
    proteins: 0,
    lipids: 0,
    carbs: 0
  });

  // tracker la largeur du conteneur pour un graphique responsive
  const [chartWidth, setChartWidth] = useState(0);
  const chartRef = useRef(null);

  // récupérer les données de consommation depuis l'API
  useEffect(() => {
    const fetchConsumptionHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/consumption/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setConsumptionHistory(data);
        
        // Calculer le résumé nutritionnel
        const summary = data.reduce((acc, item) => ({
          calories: acc.calories + item.calories,
          proteins: acc.proteins + item.proteins,
          lipids: acc.lipids + item.lipids,
          carbs: acc.carbs + item.carbs
        }), { calories: 0, proteins: 0, lipids: 0, carbs: 0 });
        
        setNutritionSummary(summary);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique de consommation:', error);
      }
    };

    fetchConsumptionHistory();
  }, []);


  //ajuster la taille des graphiques % la largeur de la fenêtre
  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.offsetWidth - 50);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // couleurs pour le PieChart
  const COLORS = ['#2E7D32', '#1976D2', '#FFA000'];

  const pieData = [
    { name: 'Proteins', value: nutritionSummary.proteins },
    { name: 'Lipids', value: nutritionSummary.lipids },
    { name: 'Carbs', value: nutritionSummary.carbs }
  ];



  return (
    <div className="calories-page">
      <h1>Your Nutrition Dashboard</h1>
      <p>Track your daily nutrition and consumption history</p>

      <div className="dashboard-container">
      
        <div className="chart-section" ref={chartRef}>
          <h2>Calories History</h2>
          <div className="chart-container">
            <LineChart 
              width={chartWidth || 500} 
              height={300} 
              data={consumptionHistory}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                stroke="#666"
              />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="calories" 
                stroke="#034f21" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
                dot={{ r: 4 }}
              />
            </LineChart>
          </div>
        </div>

        <div className="chart-section">
          <h2>Nutrition Distribution</h2>
          <div className="chart-container">
            <PieChart width={chartWidth || 400} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy={140}
                innerRadius={70}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
                position={{ x: 'auto', y: 'auto' }}
                wrapperStyle={{ zIndex: 100 }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                layout="horizontal"
                align="center"
                wrapperStyle={{
                  width: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bottom: 0
                }}
              />
            </PieChart>
          </div>
        </div>
        <div className="consumption-history">
          <h2>Recent Consumption</h2>
          <div className="history-list">
            {consumptionHistory.map((item, index) => (
              <div key={index} className="history-item">
                <span className="history-date">
                  {format(new Date(item.date), 'MMM dd, yyyy')}
                </span>
                <span className="history-meal">{item.meal_name}</span>
                <span className="history-calories">{item.calories} kcal</span>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Calories; 