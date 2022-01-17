import React, {useEffect, useState} from 'react';
import './SelectCharacter.css';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import FungameABI from '../../utils/FunGame.json';
import { ethers } from 'ethers';

const SelectCharacter = ({ setCharacterNFT }) => {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);

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
    
    return (
        <div className="select-character-container">
        <h2>Mint Your Hero. Choose wisely.</h2>
        </div>
    );
};

export default SelectCharacter;