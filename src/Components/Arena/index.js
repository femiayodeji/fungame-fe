import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import FungameABI from '../../utils/FunGame.json';
import './Arena.css';

const Arena = ({ characterNFT }) => {
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
    <div className="arena-container">
      <p>BOSS GOES HERE</p>

      <p>CHARACTER NFT GOES HERE</p>
    </div>
  );
};

export default Arena;