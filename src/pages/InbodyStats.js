import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../styles/InbodyStats.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { UserContext } from '../contexts/UserContext';
import { api } from '../api/Api.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import HistoryModal from '../components/HistoryModal';

const InbodyStats = () => {
    const { user: currentUser } = useContext(UserContext);
    const [data, setData] = useState({
        weight: [],
        muscle: [],
        fat: [],
        bmi: [],
        bodyFatPercentage: [],
        measureDate: []
    });
    const [modalData, setModalData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;

    const fetchInbodyData = useCallback(async () => {
        try {
            const response = await api.get('/physicals/all');
            const allData = response.data.content;
            const limitedData = allData.slice(-10);

            limitedData.sort((a, b) => new Date(a.measureDate) - new Date(b.measureDate));

            const chartData = {
                weight: limitedData.map(item => item.weight),
                muscle: limitedData.map(item => item.muscleMass),
                fat: limitedData.map(item => item.bodyFatMass),
                bmi: limitedData.map(item => item.bmi),
                bodyFatPercentage: limitedData.map(item => item.bodyFatPercentage),
                measureDate: limitedData.map(item => item.measureDate)
            };
            setData(chartData);
        } catch (error) {
            console.error("Error fetching inbody data", error);
        }
    }, []);

    useEffect(() => {
        fetchInbodyData();
    }, [fetchInbodyData]);

    const openModal = (type) => {
        const titleMap = {
            weight: '체중 (kg)',
            muscle: '골격근량 (kg)',
            fat: '체지방량 (kg)',
            bmi: 'BMI (kg/m²)',
            bodyFatPercentage: '체지방률 (%)'
        };
        
        setModalTitle(titleMap[type] || type); // Modal 타이틀 설정
        fetchModalData(type, 0);
        setIsModalOpen(true);
    };

    const fetchModalData = async (type, page) => {
        try {
            const response = await api.get(`/physicals/history/${type}`, {
                params: {
                    page,
                    size: itemsPerPage,
                }
            });
            setModalData(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching modal data', error);
            setModalData([]);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchModalData(modalTitle, newPage);
    };

    const createChartData = (label, dataKey, borderColor) => ({
        labels: data.measureDate.map(date => new Date(date).toLocaleDateString()),
        datasets: [
            {
                label,
                data: data[dataKey],
                borderColor,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: borderColor,
                tension: 0.3,
                fill: true,
                datalabels: {
                    anchor: 'end',
                    align: 'start',
                    offset: 4,
                    formatter: (value) => value.toFixed(1),
                    font: {
                        size: 10,
                        weight: 'bold'
                    },
                    color: '#ff6600',
                }
            }
        ]
    });

    const options = {
        scales: {
            y: {
                display: false
            }
        },
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                color: '#ff6600',
                anchor: 'end',
                align: 'start',
                offset: 4,
                font: {
                    size: 10,
                    weight: 'bold'
                },
                formatter: (value) => value.toFixed(1)
            }
        }
    };

    return (
        <div className="inbody-stats-page">
            <div className="inbody-stats-container">
                <h3 className="chart-title" onClick={() => openModal('weight')}>체중 (kg)</h3>
                <div className="chart-card">
                    <div className="chart-item">
                        <Line data={createChartData('체중', 'weight', '#ff6600')} options={options} plugins={[ChartDataLabels]} />
                    </div>
                </div>
                <h3 className="chart-title" onClick={() => openModal('muscle')}>골격근량 (kg)</h3>
                <div className="chart-card">
                    <div className="chart-item">
                        <Line data={createChartData('골격근량', 'muscle', '#ff6600')} options={options} plugins={[ChartDataLabels]} />
                    </div>
                </div>
                <h3 className="chart-title" onClick={() => openModal('fat')}>체지방량 (kg)</h3>
                <div className="chart-card">
                    <div className="chart-item">
                        <Line data={createChartData('체지방량', 'fat', '#ff6600')} options={options} plugins={[ChartDataLabels]} />
                    </div>
                </div>
                <h3 className="chart-title" onClick={() => openModal('bmi')}>BMI (kg/m²)</h3>
                <div className="chart-card">
                    <div className="chart-item">
                        <Line data={createChartData('BMI', 'bmi', '#ff6600')} options={options} plugins={[ChartDataLabels]} />
                    </div>
                </div>
                <h3 className="chart-title" onClick={() => openModal('bodyFatPercentage')}>체지방률 (%)</h3>
                <div className="chart-card">
                    <div className="chart-item">
                        <Line data={createChartData('체지방률', 'bodyFatPercentage', '#ff6600')} options={options} plugins={[ChartDataLabels]} />
                    </div>
                </div>
            </div>

            <HistoryModal
                show={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                title={`${modalTitle}`}
                data={modalData}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default InbodyStats;
