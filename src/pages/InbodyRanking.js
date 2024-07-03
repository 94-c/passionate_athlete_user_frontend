import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMale, faFemale, faArrowLeft, faBell } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../contexts/UserContext';
import '../styles/InbodyRanking.css';
import { api } from '../api/Api.js';

const InbodyRanking = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [gender, setGender] = useState(user?.gender || 'male');
    const [rankingPeriod, setRankingPeriod] = useState('weekly');
    const [title, setTitle] = useState('주간 인바디 랭킹');
    const [rankingData, setRankingData] = useState([]);
    const [monthlyFatChange, setMonthlyFatChange] = useState(0);


    useEffect(() => {
        if (user) {
            fetchRankingData('weekly', user.gender || 'male');
        }
    }, [user]);

    const fetchMonthlyFatChange = async () => {
        try {
            const response = await api.get('/physicals/monthly-fat-change');
            if (response.data) {
                setMonthlyFatChange(response.data.fatChange);
            }
        } catch (error) {
            console.error('Error fetching monthly fat change:', error);
        }
    };

    const handleBackClick = () => {
        navigate('/inbody');
    };

    const handleGenderChange = (gender) => {
        setGender(gender);
        fetchRankingData(rankingPeriod, gender);
    };

    const handlePeriodChange = (period) => {
        setRankingPeriod(period);
        switch (period) {
            case 'weekly':
                setTitle('주간 인바디 랭킹');
                break;
            case 'monthly':
                setTitle('월간 인바디 랭킹');
                break;
            default:
                setTitle('인바디 랭킹');
        }
        fetchRankingData(period, gender);
    };

    const fetchRankingData = async (type, gender) => {
        try {
            const response = await api.get('/physicals/rankings', {
                params: {
                    type: type,
                    gender: gender,
                    limit: 5
                }
            });
            if (response.data && Array.isArray(response.data)) {
                setRankingData(response.data);
            } else {
                setRankingData([]);
            }
        } catch (error) {
            console.error('Error fetching ranking data:', error);
            setRankingData([]);
        }
    };

    const handleRefreshClick = () => {
        fetchRankingData(rankingPeriod, gender);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleRefreshClick();
        }, 30 * 60 * 1000); // 30분마다 자동 새로고침

        return () => clearInterval(interval);
    }, [rankingPeriod, gender]);

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
                <button className="inbody-ranking-back-button" onClick={handleBackClick}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h1 className="inbody-ranking-title">인바디 랭킹</h1>
                <div className="inbody-ranking-gender-buttons">
                    <button
                        className={gender === 'male' ? 'active' : ''}
                        onClick={() => handleGenderChange('male')}
                        data-hover-text="남성"
                    >
                        <FontAwesomeIcon icon={faMale} />
                    </button>
                    <button
                        className={gender === 'female' ? 'active' : ''}
                        onClick={() => handleGenderChange('female')}
                        data-hover-text="여성"
                    >
                        <FontAwesomeIcon icon={faFemale} />
                    </button>
                </div>
            </div>
            <div className="inbody-ranking-highlight">
                <p><span className="user-name">[{user?.branchName}] {user?.name}</span>님의 한달 감소 체지방량</p>
                <h2>{monthlyFatChange.toFixed(1)} kg</h2>
            </div>
            <div className="inbody-ranking-highlight-bar" onClick={handleRefreshClick}>
                <FontAwesomeIcon icon={faBell} className="bell-icon" />
                <p>랭킹은 매 시간 <span className="orange-text">30분</span> 단위로 자동 업데이트 됩니다. 수동 새로고침을 하시려면 클릭하세요.</p>
            </div>
            <div className="inbody-ranking-section">
                <div className="inbody-ranking-section-header">
                    <h2>{title}</h2>
                    <div className="inbody-ranking-period-buttons">
                        <button
                            className={rankingPeriod === 'weekly' ? 'active' : ''}
                            onClick={() => handlePeriodChange('weekly')}
                            data-hover-text="주간"
                        >
                            주간
                        </button>
                        <button
                            className={rankingPeriod === 'monthly' ? 'active' : ''}
                            onClick={() => handlePeriodChange('monthly')}
                            data-hover-text="월간"
                        >
                            월간
                        </button>
                    </div>
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
                        <span className="no-data">데이터가 없습니다.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InbodyRanking;
