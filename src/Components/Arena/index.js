import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import FungameABI from '../../utils/FunGame.json';
import './Arena.css';

const Arena = ({ characterNFT }) => {
    const [gameContract, setGameContract] = useState(null);
    const [boss, setBoss] = useState(null);
    const [attackState, setAttackState] = useState('');

    const runAttackAction = async () => {
        try {
            if (gameContract) {
            setAttackState('attacking');
            console.log('Attacking boss...');
            const attackTxn = await gameContract.attackBoss();
            await attackTxn.wait();
            console.log('attackTxn:', attackTxn);
            setAttackState('hit');
            }
        } catch (error) {
            console.error('Error attacking boss:', error);
            setAttackState('');
        }
    };

    useEffect(() => {
        const { ethereum } = window;

        if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const gameContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            FungameABI.abi,
            signer
        );

        setGameContract(gameContract);
        } else {
        console.log('Ethereum object not found');
        }
    }, []);

    useEffect(() => {
        const fetchBoss = async () => {
            const bossTxn = await gameContract.getBigBoss();
            console.log('Boss:', bossTxn);
            setBoss(transformCharacterData(bossTxn));
        };
    
        if (gameContract) {
            fetchBoss();
        }
    }, [gameContract]);
  

  return (
    <div className="arena-container">
        {boss && (
            <div className="boss-container">
                <div className={`boss-content ${attackState}`}>
                    <h2>🔥 {boss.name} 🔥</h2>
                    <div className="image-content">
                        <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
                        <div className="health-bar">
                            <progress value={boss.hp} max={boss.maxHp} />
                            <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
                        </div>
                    </div>
                </div>
                <div className="attack-container">
                    <button className="cta-button" onClick={runAttackAction}>
                        {`💥 Attack ${boss.name}`}
                    </button>
                </div>
            </div>
        )}

        {characterNFT && (
            <div className="players-container">
                <div className="player-container">
                <p className='player-text'>Your Character</p>
                <div className="player">
                    <div className="image-content">
                        <h2>{characterNFT.name}</h2>
                        <img
                        src={characterNFT.imageURI}
                        alt={`Character ${characterNFT.name}`}
                        />
                        <div className="health-bar">
                        <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                        <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                        </div>
                    </div>
                    <div className="stats">
                        <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
                    </div>
                </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default Arena;