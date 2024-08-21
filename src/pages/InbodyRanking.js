import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMale, faFemale, faSearch, faBell, faArrowLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../contexts/UserContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/InbodyRanking.css';
import { api } from '../api/Api.js';

const InbodyRanking = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [gender, setGender] = useState(user?.gender || 'male');
    const [rankingPeriod, setRankingPeriod] = useState('monthly');
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [title, setTitle] = useState('인바디 랭킹');
    const [rankingData, setRankingData] = useState([]);
    const [monthlyFatChange, setMonthlyFatChange] = useState(0);
    const [branches, setBranches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);

    useEffect(() => {
        if (user) {
            fetchBranches();
            fetchInitialRankingData('monthly', user.gender || 'male', selectedMonth.getMonth() + 1, selectedBranch);
            fetchMonthlyFatChange(new Date().getFullYear(), selectedMonth.getMonth() + 1);
        }
    }, [user]);

    const fetchBranches = async () => {
        try {
            const response = await api.get('/branches');
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const fetchMonthlyFatChange = async (year, month) => {
        try {
            const response = await api.get('/physicals/monthly-fat-change', {
                params: {
                    year: year,
                    month: month,
                }
            });
            if (response.data && response.data.fatChange !== undefined) {
                setMonthlyFatChange(parseFloat(response.data.fatChange).toFixed(1));
            } else {
                setMonthlyFatChange(0);
            }
        } catch (error) {
            console.error('Error fetching monthly fat change:', error);
            setMonthlyFatChange(0);
        }
    };

    const fetchInitialRankingData = async (type, gender, month, branch) => {
        try {
            const response = await api.get('/physicals/rankings', {
                params: {
                    type: type,
                    gender: gender,
                    month: month,
                    branch: branch === 'all' ? null : branch,
                    limit: 5
                }
            });
            if (response.data && Array.isArray(response.data)) {
                setRankingData(response.data.map(item => ({
                    ...item,
                    bodyFatMassChange: parseFloat(item.bodyFatMassChange).toFixed(1),
                })));
            } else {
                setRankingData([]); 
            }
        } catch (error) {
            console.error('Error fetching ranking data:', error);
            setRankingData([]); 
        }
    };

    const fetchFilteredRankingData = async (gender, month, branch) => {
        try {
            const response = await api.get('/physicals/find/monthly-fat-change', {
                params: {
                    gender: gender,
                    month: month,
                    branchId: branch === 'all' ? null : branch
                }
            });
            if (response.data && Array.isArray(response.data)) {
                setRankingData(response.data.map(item => ({
                    ...item,
                    bodyFatMassChange: parseFloat(item.bodyFatMassChange).toFixed(1),
                })));
            } else {
                setRankingData([]); 
            }
        } catch (error) {
            console.error('Error fetching filtered ranking data:', error);
            setRankingData([]); 
        }
    };

    const handleGenderChange = (gender) => {
        setGender(gender);
        fetchInitialRankingData(rankingPeriod, gender, selectedMonth.getMonth() + 1, selectedBranch);
    };

    const handlePeriodChange = (period) => {
        setRankingPeriod(period);
        setTitle(period === 'weekly' ? '주간 인바디 랭킹' : '월간 인바디 랭킹');
        fetchInitialRankingData(period, gender, selectedMonth.getMonth() + 1, selectedBranch);
    };

    const handleMonthChange = (date) => {
        setSelectedMonth(date);
        fetchInitialRankingData(rankingPeriod, gender, date.getMonth() + 1, selectedBranch);
        fetchMonthlyFatChange(date.getFullYear(), date.getMonth() + 1);
    };

    const handleBranchChange = (event) => {
        const branch = event.target.value;
        setSelectedBranch(branch);
        fetchInitialRankingData(rankingPeriod, gender, selectedMonth.getMonth() + 1, branch);
    };

    const handleRefreshClick = () => {
        fetchInitialRankingData(rankingPeriod, gender, selectedMonth.getMonth() + 1, selectedBranch);
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleConfirm = () => {
        setIsSearchActive(true);
        handleCloseModal();
        fetchFilteredRankingData(gender, selectedMonth.getMonth() + 1, selectedBranch);
    };

    const currentMonth = selectedMonth.toLocaleString('ko-KR', { month: 'long' });

    const paddedRankingData = [...rankingData];
    while (paddedRankingData.length < 5) {
        paddedRankingData.push({
            branchName: '',
            username: '순위 없음',
            bodyFatMassChange: '-'
        });
    }

    return (
        <div className="inbody-ranking-page">
            <div className="inbody-ranking-header">
                <button className="back-button" onClick={() => navigate("/inbody")}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h1 className="inbody-ranking-title">{title}</h1>
                <div className="inbody-ranking-gender-buttons">
                    <button
                        className={gender === 'male' ? 'active' : ''}
                        onClick={() => handleGenderChange('male')}
                    >
                        <FontAwesomeIcon icon={faMale} />
                    </button>
                    <button
                        className={gender === 'female' ? 'active' : ''}
                        onClick={() => handleGenderChange('female')}
                    >
                        <FontAwesomeIcon icon={faFemale} />
                    </button>
                    <button className="inbody-ranking-filter-button" onClick={handleOpenModal}>
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
            </div>
            <div className="inbody-ranking-highlight">
                <p><span className="user-name">[{user?.branchName}] {user?.name}</span>님의 {currentMonth} 감소 체지방량</p>
                <h2>{monthlyFatChange} kg</h2>
            </div>
            <div className="inbody-ranking-section">
                    <div className="inbody-ranking-highlight-bar" onClick={handleRefreshClick}>
                        <FontAwesomeIcon icon={faBell} className="bell-icon" />
                        <p>랭킹은 매 시간 <span className="orange-text">30분</span> 단위로 자동 업데이트 됩니다. 수동 새로고침을 하시려면 클릭하세요.</p>
                    </div>
                <div className="inbody-ranking-section-header">
                    <h2>{title}</h2>
                    {!isSearchActive && (
                        <div className="inbody-ranking-period-buttons">
                            <button
                                className={rankingPeriod === 'weekly' ? 'active' : ''}
                                onClick={() => handlePeriodChange('weekly')}
                            >
                                주간
                            </button>
                            <button
                                className={rankingPeriod === 'monthly' ? 'active' : ''}
                                onClick={() => handlePeriodChange('monthly')}
                            >
                                월간
                            </button>
                        </div>
                    )}
                </div>
                {rankingData.length > 0 ? (
                    <ul className="inbody-ranking-list">
                        {paddedRankingData.map((item, index) => (
                            <li key={index} className={`inbody-ranking-item ${index < 3 ? 'top-rank' : ''}`}>
                                <span className={`inbody-ranking-rank ${index < 3 ? `rank-${index + 1}` : ''}`}>{index + 1}</span>
                                <span className="inbody-ranking-username">{item.username === '순위 없음' ? item.username : `[${item.branchName}] ${item.username}`}</span>
                                <span className="inbody-ranking-body-fat-change">{item.bodyFatMassChange} kg</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="inbody-ranking-item no-data-item">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="no-data-icon" /> 
                        <span className="no-data">데이터가 없습니다.</span>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <div className="custom-modal-header">
                            <h2 className="custom-modal-title">검색</h2>
                            <button className="custom-modal-close-btn" onClick={handleCloseModal}>
                                &times;
                            </button>
                        </div>
                        <div className="custom-modal-body">
                            <div className="custom-filter-group">
                                <label>지점 </label>
                                <select value={selectedBranch} onChange={handleBranchChange}>
                                    <option value="all">전체 지점</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="custom-filter-group">
                                <label>월별 </label>
                                <DatePicker
                                    selected={selectedMonth}
                                    onChange={handleMonthChange}
                                    dateFormat="MM/yyyy"
                                    showMonthYearPicker
                                />
                            </div>
                            <button className="custom-confirm-btn" onClick={handleConfirm}>확인</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InbodyRanking;
